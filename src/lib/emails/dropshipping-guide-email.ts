import { siteConfig } from "@/lib/site-config";

// Inline styles + a table-based layout throughout, since email clients
// (Outlook especially) don't reliably support external/embedded stylesheets
// or modern CSS layout.
export function buildDropshippingGuideEmail({
  name,
  downloadUrl,
}: {
  name: string;
  downloadUrl: string;
}): { subject: string; html: string; text: string } {
  const logoUrl = `${siteConfig.url}/images/logo.png`;
  const firstName = name.trim().split(/\s+/)[0] || "there";

  const subject = "Your Free Dropshipping Guide is ready 🎉";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border:1px solid #111111;border-radius:4px;">
            <tr>
              <td style="padding:32px 32px 8px;text-align:center;">
                <img src="${logoUrl}" alt="DgConcept" width="140" style="display:inline-block;height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0;text-align:center;">
                <h1 style="margin:0;font-size:22px;color:#111111;">Hi ${escapeHtml(firstName)},</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 32px 0;text-align:center;">
                <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
                  Your free copy of <strong>The Ultimate Dropshipping Guide</strong> is
                  ready! Click the button below to download it now:
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fb923c,#ea580c);border-radius:8px;">
                  <tr>
                    <td style="padding:24px 16px;text-align:center;">
                      <p style="margin:0 0 4px;font-size:14px;font-weight:bold;letter-spacing:2px;color:#ffffff;">FREE</p>
                      <p style="margin:0;font-size:26px;font-weight:900;line-height:1.15;color:#111111;text-transform:uppercase;">Dropshipping<br />Guide</p>
                      <p style="margin:12px 0 4px;font-size:20px;color:#ffffff;">&#8595;</p>
                      <p style="margin:0;font-size:13px;font-weight:bold;color:#ffffff;">over 50+ downloads</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0;text-align:center;">
                <a href="${downloadUrl}" style="display:inline-block;background-color:#111111;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:6px;">
                  Get Your Guide
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 0;text-align:center;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#374151;">
                  If you have any questions or need help getting started, feel
                  free to reach out. Wishing you success in your dropshipping
                  journey!
                </p>
                <p style="margin:12px 0 0;font-size:13px;color:#374151;">Best,</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 0;">
                <hr style="border:none;border-top:1px solid #d1d5db;margin:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 4px;">
                <p style="margin:0;font-family:'Brush Script MT','Segoe Script',cursive;font-size:32px;color:#111111;">Omotola&hellip;</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <p style="margin:0;font-size:13px;font-weight:bold;color:#0d9488;">Omotola O.</p>
                <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">E-Commerce Expert</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Hi ${firstName},

Your free copy of The Ultimate Dropshipping Guide is ready! Download it here:
${downloadUrl}

If you have any questions or need help getting started, feel free to reach out. Wishing you success in your dropshipping journey!

Best,
Omotola O.
E-Commerce Expert`;

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
