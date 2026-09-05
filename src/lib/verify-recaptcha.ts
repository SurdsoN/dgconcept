// Server-side verification for the reCAPTCHA v2 checkbox token a client
// widget produces. The site key (public) lives in site-config.ts; the
// matching secret key is server-only and must never reach the client.
export async function verifyRecaptcha(token: unknown): Promise<boolean> {
  if (typeof token !== "string" || !token) return false;

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    throw new Error("RECAPTCHA_SECRET_KEY is not configured");
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  if (!res.ok) return false;

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
