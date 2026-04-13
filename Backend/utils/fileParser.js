import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import officeParser from 'officeparser';
import { readFile } from 'fs/promises';
import path from 'path';

export const extractEmailsFromFile = async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    let text = "";

    try {
        if (ext === '.pdf') {
            const dataBuffer = await readFile(filePath);
            const data = await pdf(dataBuffer);
            text = data.text;
        }
        else if (ext === '.docx' || ext === '.doc') {
            const result = await mammoth.extractRawText({ path: filePath });
            text = result.value;
        }
        else if (ext === '.txt') {
            text = await readFile(filePath, 'utf-8');
        }
        else if (ext === '.pptx' || ext === '.ppt') {
            text = await new Promise((resolve, reject) => {
                officeParser.parseOffice(filePath, (data, err) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        }

        // Standard Email Regex
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}/gi;
        const foundEmails = text.match(emailRegex) || [];
        return [...new Set(foundEmails.map(e => e.toLowerCase()))];

    } catch (error) {
        console.error("File Parsing Error:", error);
        return [];
    }
};