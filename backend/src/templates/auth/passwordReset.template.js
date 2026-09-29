// ─── Password Reset Request Template ────────────────────────────────────
// Dispatches a 6-digit OTP code to authorize a forgotten password reset.

import emailLayout from '../layouts/emailLayout.js';

const passwordResetTemplate = ({ name, otp, expiryMinutes = 10 }) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>We received a request to reset the password associated with your TaskFlow account.</p>

        <!-- Recovery Code Box -->
        <div style="background-color:#0f172a; border:2px dashed #ef4444; border-radius:10px; text-align:center; padding:20px; margin:28px 0;">
            <div style="font-size:36px; font-weight:700; color:#ef4444; letter-spacing:10px; font-family:monospace;">
                ${otp}
            </div>
            <p style="margin:8px 0 0 0; font-size:13px; color:#94a3b8;">Password Recovery Code</p>
        </div>

        <p style="font-size:14px; color:#94a3b8;">
            ⏱️ This code is valid for <strong>${expiryMinutes} minutes</strong>.
        </p>

        <!-- Security Warning -->
        <div style="background-color:rgba(239,68,68,0.1); border-left:4px solid #ef4444; padding:12px 16px; margin-top:24px; border-radius:4px; font-size:13px; color:#fca5a5;">
            <strong>Security Notice:</strong> If you did not request a password reset, please log in and change your password immediately.
        </div>
    `;

    return emailLayout({
        title: 'Password Reset Request',
        heading: 'Reset Your Password',
        content,
    });
};

export default passwordResetTemplate;