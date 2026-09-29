// ─── Email Verification Template ────────────────────────────────────────
// Dispatches the 6-digit OTP code to verify a newly registered user account.

import emailLayout from '../layouts/emailLayout.js';

const emailVerificationTemplate = ({ name, otp, expiryMinutes = 10 }) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>Welcome to TaskFlow! Please verify your email address to complete your registration and activate your account.</p>

        <!-- OTP Code Box -->
        <div style="background-color:#0f172a; border:2px dashed #10b981; border-radius:10px; text-align:center; padding:20px; margin:28px 0;">
            <div style="font-size:36px; font-weight:700; color:#10b981; letter-spacing:10px; font-family:monospace;">
                ${otp}
            </div>
            <p style="margin:8px 0 0 0; font-size:13px; color:#94a3b8;">One-Time Verification Code</p>
        </div>

        <p style="font-size:14px; color:#94a3b8;">
            ⏱️ This code will expire in <strong>${expiryMinutes} minutes</strong>.
        </p>

        <p style="font-size:13px; color:#64748b; margin-top:24px;">
            If you did not sign up for a TaskFlow account, you can safely ignore this email.
        </p>
    `;

    return emailLayout({
        title: 'Verify Your Email Address',
        heading: 'Confirm Your Registration',
        content,
    });
};

export default emailVerificationTemplate;