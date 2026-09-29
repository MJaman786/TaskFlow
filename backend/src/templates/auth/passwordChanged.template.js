// ─── Password Changed Notification Template ─────────────────────────────
// Security alert informing the user that their account password was updated.

import emailLayout from '../layouts/emailLayout.js';

const passwordChangedTemplate = ({ name }) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>Your TaskFlow account password was updated successfully.</p>

        <!-- Status Confirmation Box -->
        <div style="background-color:rgba(16,185,129,0.1); border-left:4px solid #10b981; padding:16px 20px; margin:24px 0; border-radius:6px; color:#6ee7b7;">
            <strong>✓ Password Updated</strong><br />
            All other active sessions on other devices have been automatically terminated.
        </div>

        <p style="font-size:14px; color:#94a3b8;">
            If you made this change, no further action is required.
        </p>

        <!-- Critical Security Notice -->
        <div style="background-color:rgba(245,158,11,0.1); border-left:4px solid #f59e0b; padding:12px 16px; margin-top:24px; border-radius:4px; font-size:13px; color:#fcd34d;">
            <strong>Didn't make this change?</strong> Please contact support immediately or reset your password to regain control of your account.
        </div>
    `;

    return emailLayout({
        title: 'Security Alert: Password Updated',
        heading: 'Password Changed Successfully',
        content,
    });
};

export default passwordChangedTemplate;