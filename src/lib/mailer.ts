import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

// Sends mail through the business's own Gmail account (an App Password,
// not the account password) rather than a transactional email API — those
// require a verified custom domain to send to third parties, which this
// site doesn't have. Gmail's ~500/day sending cap is far more than a lead
// magnet funnel needs.
function getTransporter(): Transporter {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be configured");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const user = process.env.GMAIL_USER;
  await getTransporter().sendMail({
    from: `"Omotola from DgConcept" <${user}>`,
    ...options,
  });
}
