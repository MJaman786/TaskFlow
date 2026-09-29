// ─── Base Email HTML Layout ─────────────────────────────────────────────
// Reusable, client-friendly responsive table layout for all email types.

const emailLayout = ({ title, heading, content }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0f172a; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#cbd5e1;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px; background-color:#0f172a;">
            <tr>
                <td align="center">
                    <!-- Main Card Container -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#1e293b; border:1px solid #334155; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.3);">
                        
                        <!-- Header Banner -->
                        <tr>
                            <td style="background-color:#10b981; padding:24px 30px; text-align:center;">
                                <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff; letter-spacing:0.5px;">
                                    TaskFlow
                                </h1>
                            </td>
                        </tr>

                        <!-- Body Content Area -->
                        <tr>
                            <td style="padding:32px 30px; line-height:1.6; font-size:15px; color:#e2e8f0;">
                                <h2 style="margin-top:0; margin-bottom:20px; font-size:20px; font-weight:600; color:#f8fafc;">
                                    ${heading}
                                </h2>

                                ${content}
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#0f172a; padding:20px 30px; text-align:center; font-size:12px; color:#64748b; border-top:1px solid #334155;">
                                <p style="margin:0 0 6px 0;">This is an automated system notification from TaskFlow.</p>
                                <p style="margin:0;">&copy; ${new Date().getFullYear()} TaskFlow Inc. All rights reserved.</p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export default emailLayout;