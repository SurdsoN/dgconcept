import { NextRequest, NextResponse } from "next/server";
import { upsertFileOnGitHub } from "@/lib/github-publish";
import { verifyRecaptcha } from "@/lib/verify-recaptcha";

export const runtime = "nodejs";

const MAX_QUOTE_LENGTH = 1000;
const MAX_NAME_LENGTH = 100;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, company, rating, quote, recaptchaToken } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim() || name.trim().length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  }
  if (
    company !== undefined &&
    company !== "" &&
    (typeof company !== "string" || company.length > MAX_NAME_LENGTH)
  ) {
    return NextResponse.json({ error: "Company name is too long" }, { status: 400 });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: "Please choose a rating from 1 to 5" }, { status: 400 });
  }
  if (typeof quote !== "string" || !quote.trim() || quote.trim().length > MAX_QUOTE_LENGTH) {
    return NextResponse.json(
      { error: "Please share a few words about your experience" },
      { status: 400 },
    );
  }

  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed — please try again" },
        { status: 400 },
      );
    }

    const slug = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const path = `src/content/reviews/${slug}.json`;

    const fileContent = JSON.stringify(
      {
        name: name.trim(),
        company: typeof company === "string" && company.trim() ? company.trim() : null,
        rating: ratingNum,
        quote: quote.trim(),
        date: new Date().toISOString().slice(0, 10),
        status: "pending",
      },
      null,
      2,
    );

    await upsertFileOnGitHub(
      path,
      Buffer.from(fileContent, "utf-8").toString("base64"),
      `Add pending review from ${name.trim()}`,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to submit review", error);
    return NextResponse.json(
      { error: "Something went wrong submitting your review. Please try again later." },
      { status: 500 },
    );
  }
}
