import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import path from 'path';

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}/gi;

export const extractEmailsFromBuffer = async (buffer, originalname) => {
    const ext = path.extname(originalname).toLowerCase();
    let text = '';

    try {
        if (ext === '.pdf') {
            const data = await pdf(buffer);
            text = data.text;
        }
        else if (ext === '.docx' || ext === '.doc') {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        }
        else if (ext === '.txt') {
            text = buffer.toString('utf-8');
        }
        else {
            console.warn('Unsupported file type:', ext);
            return [];
        }

        const foundEmails = text.match(emailRegex) || [];
        return [...new Set(foundEmails.map(e => e.toLowerCase()))];

    } catch (error) {
        console.error('File parsing error:', error.message);
        return [];
    }
};
