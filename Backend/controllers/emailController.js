import { extractEmailsFromBuffer } from '../utils/fileParser.js';
import { sendEmailWithRetry } from '../utils/mailer.js';

export const processEmails = async (req, res) => {
    const { emailListFile, resumePDF } = req.files || {};
    const { manualEmails, customMessage, subject } = req.body;

    let finalEmailList = [];

    try {
        // Extract emails from uploaded file 
        if (emailListFile && emailListFile[0]) {
            const file = emailListFile[0];
            const fileEmails = await extractEmailsFromBuffer(file.buffer, file.originalname);
            finalEmailList = [...finalEmailList, ...fileEmails];
        }

        // emails from manual input
        if (manualEmails) {
            const manualRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}/gi;
            const extractedManual = manualEmails.match(manualRegex) || [];
            finalEmailList = [...finalEmailList, ...extractedManual];
        }

        // Deduplicate
        finalEmailList = [...new Set(finalEmailList.map(e => e.toLowerCase()))];

        if (finalEmailList.length === 0) {
            return res.status(400).json({ message: 'No valid emails found.' });
        }

        if (!resumePDF || !resumePDF[0]) {
            return res.status(400).json({ message: 'Resume PDF is required.' });
        }

        const resumeBuffer = resumePDF[0].buffer;

        // Send emails with 1s dely
        const results = [];
        for (let i = 0; i < finalEmailList.length; i++) {
            const result = await sendEmailWithRetry(
                finalEmailList[i],
                subject || 'Resume Submission',
                customMessage,
                resumeBuffer
            );
            results.push(result);

            if (i < finalEmailList.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        res.status(200).json({
            success: true,
            total: finalEmailList.length,
            sent: results.filter(r => r.status === 'success').length,
            failed: results.filter(r => r.status === 'failed').length,
            results
        });

    } catch (error) {
        console.error('processEmails error:', error);
        res.status(500).json({ message: 'Server processing error: ' + error.message });
    }
};
