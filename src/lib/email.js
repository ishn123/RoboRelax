import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST, // e.g., 'smtp.gmail.com'
    port: process.env.EMAIL_SERVER_PORT, // e.g., 465
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
    },
});

export async function sendEmail({ to, subject, html }) {
    try {
        await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log('Email sent');
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
}