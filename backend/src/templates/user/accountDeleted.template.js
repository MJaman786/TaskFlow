// ─── Account Deletion Template ──────────────────────────────────────────
// Dispatched when an administrator or user permanently removes an account.

import emailLayout from '../layouts/emailLayout.js';

const accountDeletedTemplate = ({
    name,
    deletedAt = new Date().toLocaleString(),
}) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>This email confirms that your TaskFlow account has been permanently deleted.</p>

        <!-- Notice Box -->
        <div style="background-color:rgba(239,68,68,0.1); border-left:4px solid #ef4444; padding:18px 20px; margin:24px 0; border-radius:6px; color:#fca5a5;">
            <strong>Account Permanently Removed</strong><br />
            <span style="font-size:13px; color:#94a3b8;">Timestamp: ${deletedAt}</span>
        </div>

        <p style="font-size:14px; color:#cbd5e1;">
            All your associated records, including projects, task lists, and time logs, have been purged from our active database.
        </p>

        <p style="font-size:13px; color:#64748b; margin-top:24px;">
            If you did not authorize or expect this action, please contact our administrator immediately.
        </p>
    `;

    return emailLayout({
        title: 'Account Deletion Notice',
        heading: 'Account Has Been Deleted',
        content,
    });
};

export default accountDeletedTemplate;