import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

//Sends email with a simple retry mechanism
export const sendEmailWithRetry = async (to, subject, text, attachmentPath, retries = 2) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: [
            {
                filename: 'Resume.pdf',
                path: attachmentPath,
            },
        ],
    };

    for (let i = 0; i <= retries; i++) {
        try {
            await transporter.sendMail(mailOptions);
            return { email: to, status: 'success' };
        } catch (error) {
            if (i === retries) return { email: to, status: 'failed', error: error.message };
            console.log(`Retrying for ${to}... Attempt ${i + 1}`);
            // Wait 1 second before retry
            await new Promise(res => setTimeout(res, 1000));
        }
    }
};