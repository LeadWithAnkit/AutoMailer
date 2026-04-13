import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // Increase timeout for Render's slow cold starts
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
});

// Verify transporter on startup
transporter.verify((error) => {
    if (error) {
        console.error('Mailer config error:', error.message);
    } else {
        console.log('Mailer ready ');
    }
});

export const sendEmailWithRetry = async (to, subject, text, resumeBuffer, retries = 2) => {
    const mailOptions = {
        from: `"AutoMailer" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: text || 'Please find my resume attached.',
        attachments: [
            {
                filename: 'Resume.pdf',
                content: resumeBuffer,   // buffer — no file path needed
                contentType: 'application/pdf',
            },
        ],
    };

    for (let i = 0; i <= retries; i++) {
        try {
            await transporter.sendMail(mailOptions);
            console.log(` Sent to ${to}`);
            return { email: to, status: 'success' };
        } catch (error) {
            console.error(` Failed to ${to} (attempt ${i + 1}): ${error.message}`);
            if (i === retries) return { email: to, status: 'failed', error: error.message };
            await new Promise(res => setTimeout(res, 1000));
        }
    }
};
