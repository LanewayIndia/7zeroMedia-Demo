import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── Force Node.js runtime — nodemailer requires Node APIs (net, tls, etc.)
// that are not available in the Edge runtime.
export const runtime = "nodejs";

/* ─── Constants ──────────────────────────────────────────────────────────── */

const ALLOWED_SERVICES = [
  "Marketing Strategy",
  "Brand Identity",
  "Content Creation",
  "Filming & Production",
  "Social Media",
  "Other",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ─── Nodemailer transporter ─────────────────────────────────────────────────
   Created once at module initialisation — not recreated on every request.
   Node.js module caching ensures this runs only once per server process,
   which avoids creating a new TCP connection pool on every POST.
─────────────────────────────────────────────────────────────────────────── */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT ?? 587) === 465, // TLS on port 465, STARTTLS otherwise
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ─── Sanitizer ──────────────────────────────────────────────────────────── */

function sanitize(str: unknown, maxLen = 2000): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/<[^>]*>/g, "") // strip any HTML tags
    .replace(/[\r\n]/g, " ") // collapse newlines — prevents SMTP header injection
    .trim()
    .slice(0, maxLen);
}

/** HTML-encode the five dangerous characters to prevent injection into the email body. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ─── POST Handler ───────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // ── Honeypot check — bots fill hidden fields; humans don't ──────────────
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  // ── Extract & sanitize ──────────────────────────────────────────────────
  const name = sanitize(body.name, 120);
  const email = sanitize(body.email, 254);
  const company = sanitize(body.company, 120);
  const service = sanitize(body.service, 60);
  const message = sanitize(body.message, 4000);

  // ── Server-side validation ──────────────────────────────────────────────
  const errors: Record<string, string> = {};

  if (!name || name.length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!email || !EMAIL_RE.test(email))
    errors.email = "A valid email address is required.";

  if (!message || message.length < 10)
    errors.message = "Please tell us a bit more (at least 10 characters).";

  if (
    service &&
    !ALLOWED_SERVICES.includes(service as (typeof ALLOWED_SERVICES)[number])
  )
    errors.service = "Invalid service selection.";

  if (Object.keys(errors).length > 0)
    return NextResponse.json({ errors }, { status: 422 });

  // ── Send email ──────────────────────────────────────────────────────────

  const companyLine = company ? `Company:  ${company}` : "Company:  —";
  const serviceLine = service
    ? `Service:  ${service}`
    : "Service:  Not specified";

  const textBody = [
    "New contact inquiry received via 7ZeroMedia website.",
    "",
    `Name:     ${name}`,
    `Email:    ${email}`,
    companyLine,
    serviceLine,
    "",
    "Message:",
    message,
    "",
    "─────────────────────────────",
    "This email was sent automatically. Do not reply to this address.",
  ].join("\n");

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Inquiry</title>
</head>
<body style="margin:0;padding:0;background:#F8F8F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F8F8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#F97316 0%,#ea6c0a 100%);padding:28px 36px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.75);">7ZeroMedia</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">New Contact Inquiry</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px;">

              <!-- Fields -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 20px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Name</p>
                    <p style="margin:0;font-size:15px;color:#111111;font-weight:600;">${escapeHtml(name)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 20px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Email</p>
                    <p style="margin:0;font-size:15px;color:#111111;">
                      <a href="mailto:${escapeHtml(email)}" style="color:#F97316;text-decoration:none;">${escapeHtml(email)}</a>
                    </p>
                  </td>
                </tr>
                ${
                  company
                    ? `
                <tr>
                  <td style="padding:0 0 20px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Company / Brand</p>
                    <p style="margin:0;font-size:15px;color:#111111;">${escapeHtml(company)}</p>
                  </td>
                </tr>`
                    : ""
                }
                ${
                  service
                    ? `
                <tr>
                  <td style="padding:0 0 20px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Service Interested In</p>
                    <p style="margin:0;display:inline-block;font-size:13px;font-weight:600;color:#F97316;background:rgba(249,115,22,0.10);border:1px solid rgba(249,115,22,0.25);border-radius:100px;padding:4px 14px;">${escapeHtml(service)}</p>
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:0 0 4px;">
                    <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Message</p>
                    <div style="background:#F8F8F8;border-radius:12px;padding:16px 20px;border:1px solid rgba(0,0,0,0.06);">
                      <p style="margin:0;font-size:14px;line-height:1.7;color:#444444;white-space:pre-wrap;">${escapeHtml(message)}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td>
                    <a href="mailto:${escapeHtml(email)}?subject=Re: Your inquiry to 7ZeroMedia"
                       style="display:inline-block;background:linear-gradient(135deg,#F97316 0%,#ea6c0a 100%);color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:10px;">
                      Reply to ${escapeHtml(name)}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid rgba(0,0,0,0.06);">
              <p style="margin:0;font-size:11px;color:rgba(0,0,0,0.35);line-height:1.6;">
                Sent automatically from the 7ZeroMedia contact form. Do not reply to this system email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"7ZeroMedia" <${process.env.SMTP_USER}>`,
      to: "info@7zero.media",
      replyTo: email, // clicking Reply in the inbox goes to the sender
      subject: `New Contact Inquiry from ${name}`,
      text: textBody,
      html: htmlBody,
    });
  } catch (err) {
    // Log the SMTP error in development only — never expose it to the client
    if (process.env.NODE_ENV === "development") {
      console.error("[Contact API] SMTP error:", err);
    }
    return NextResponse.json(
      { error: "Unable to process request at this time." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
