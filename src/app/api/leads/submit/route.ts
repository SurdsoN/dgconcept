import { NextRequest, NextResponse } from "next/server";
import { upsertFileOnGitHub } from "@/lib/github-publish";
import { verifyRecaptcha } from "@/lib/verify-recaptcha";
import { sendEmail } from "@/lib/mailer";
import { buildDropshippingGuideEmail } from "@/lib/emails/dropshipping-guide-email";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

const MAX_NAME_LENGTH = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, recaptchaToken } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim() || name.trim().length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed — please try again" },
        { status: 400 },
      );
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const path = `src/content/leads/${id}.json`;
    const fileContent = JSON.stringify(
      {
        name: trimmedName,
        email: trimmedEmail,
        source: "dropshipping-guide",
        date: new Date().toISOString().slice(0, 10),
      },
      null,
      2,
    );

    await upsertFileOnGitHub(
      path,
      Buffer.from(fileContent, "utf-8").toString("base64"),
      `Add lead: ${trimmedEmail}`,
    );

    const downloadUrl = `${siteConfig.url}/downloads/dgconcept-dropshipping-guide.pdf`;
    const { subject, html, text } = buildDropshippingGuideEmail({
      name: trimmedName,
      downloadUrl,
    });

    await sendEmail({ to: trimmedEmail, subject, html, text });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to process lead submission", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong sending your guide. Please try again, or email us directly if it keeps happening.",
      },
      { status: 500 },
    );
  }
}
