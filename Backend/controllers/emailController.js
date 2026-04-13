import fs from 'fs';
import { extractEmailsFromFile } from '../utils/fileParser.js';
import { sendEmailWithRetry } from '../utils/mailer.js';

export const processEmails = async (req, res) => {
    const { emailListFile, resumePDF } = req.files;
    const { manualEmails, customMessage, subject } = req.body;

    let finalEmailList = [];

    try {
        if (emailListFile) {
            const fileEmails = await extractEmailsFromFile(emailListFile[0].path);
            finalEmailList = [...finalEmailList, ...fileEmails];
        }

        if (manualEmails) {
            const manualRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}/gi;
            const extractedManual = manualEmails.match(manualRegex) || [];
            finalEmailList = [...finalEmailList, ...extractedManual];
        }

        finalEmailList = [...new Set(finalEmailList.map(e => e.toLowerCase()))];

        if (finalEmailList.length === 0) {
            return res.status(400).json({ message: 'No valid emails found anywhere.' });
        }

        const results = [];
        for (let i = 0; i < finalEmailList.length; i++) {
            const result = await sendEmailWithRetry(
                finalEmailList[i],
                subject || "Resume Submission",
                customMessage,
                resumePDF[0].path
            );
            results.push(result);

            if (i < finalEmailList.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        if (emailListFile) fs.unlinkSync(emailListFile[0].path);
        fs.unlinkSync(resumePDF[0].path);

        res.status(200).json({ success: true, total: finalEmailList.length, results });

    } catch (error) {
        res.status(500).json({ message: 'Server processing error.' });
    }
};