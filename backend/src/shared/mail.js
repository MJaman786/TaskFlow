// ─── Nodemailer Email Service ───────────────────────────────────────────
// Centralized mail dispatcher using Gmail SMTP with an App Password.
// Sends transactional emails (OTP verification, recovery, alerts).

import nodemailer from 'nodemailer';
import envConfig from '../config/env.config.js';

// 1. Create reusable transporter instance
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: envConfig.mail.user,
        pass: envConfig.mail.password,
    },
});

// 2. Verify connection on server startup
if (envConfig.mail.user && envConfig.mail.password) {
    transporter.verify((error) => {
        if (error) {
            console.warn('⚠️  Email server connection warning:', error.message);
        } else {
            console.log('📧 Email transport is ready to send messages');
        }
    });
} else {
    console.warn('⚠️  GOOGLE_USER_EMAIL or GOOGLE_APP_PASSWORD is not configured. Emails will fail to send.');
}

/**
 * Generic email sender helper
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plaintext fallback
 * @param {string} options.html - Compiled HTML body
 */
export const sendEmail = async ({ to, subject, text = '', html }) => {
    try {
        const mailOptions = {
            from: `"TaskFlow" <${envConfig.mail.user}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✉️  Email sent to ${to} [Message ID: ${info.messageId}]`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error.message);
        throw error;
    }
};

export default transporter;