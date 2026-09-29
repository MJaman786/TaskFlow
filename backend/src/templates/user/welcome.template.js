// ─── Welcome Email Template ─────────────────────────────────────────────
// Dispatched after a user successfully completes OTP email verification.

import emailLayout from '../layouts/emailLayout.js';

const welcomeTemplate = ({ name }) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>Your email address has been verified. Welcome to <strong>TaskFlow</strong>!</p>

        <!-- Welcome Banner -->
        <div style="background-color:rgba(16,185,129,0.1); border-left:4px solid #10b981; padding:18px 20px; margin:24px 0; border-radius:6px;">
            <p style="margin:0; font-weight:600; color:#6ee7b7;">Your account is now fully active.</p>
        </div>

        <p>Here is what you can do right now:</p>
        <ul style="color:#cbd5e1; padding-left:20px; line-height:1.8;">
            <li><strong>Organize Tasks:</strong> Create, categorize, and prioritize your daily to-dos.</li>
            <li><strong>Track Time:</strong> Use the live start/stop stopwatch on any active task.</li>
            <li><strong>View Analytics:</strong> Monitor your daily productivity and build continuous activity streaks.</li>
        </ul>

        <p style="margin-top:24px;">Happy productive tracking!</p>
    `;

    return emailLayout({
        title: 'Welcome to TaskFlow',
        heading: 'Welcome Aboard! 🎉',
        content,
    });
};

export default welcomeTemplate;