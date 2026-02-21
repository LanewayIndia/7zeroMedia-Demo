import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── Node.js runtime required — nodemailer uses net/tls/dns, unavailable on Edge
export const runtime = "nodejs";

/* ─── Constants ──────────────────────────────────────────────────────────── */

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_EXPERIENCE = new Set([
  "Fresher",
  "1-3 Years",
  "3-5 Years",
  "5+ Years",
  "Currently Attending College",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ─── Nodemailer transporter ─────────────────────────────────────────────────
   Created once at module level — reuses the same TCP connection pool
   across requests rather than opening a new connection per submission.
─────────────────────────────────────────────────────────────────────────── */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT ?? 587) === 465,
  auth: {
    user: process.env.SMTP_HR_USER,
    pass: process.env.SMTP_HR_PASS,
  },
});

/* ─── Sanitizer ──────────────────────────────────────────────────────────── */

function sanitize(val: FormDataEntryValue | null, maxLen = 2000): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLen);
}

function isValidUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/* ─── POST Handler ───────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  // ── Parse multipart form (supports file upload) ──────────────────────────
  let body: globalThis.FormData;
  try {
    body = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // ── Honeypot — bots fill it, humans don't ────────────────────────────────
  if (body.get("website")) {
    return NextResponse.json({ ok: true });
  }

  // ── Extract & sanitize text fields ──────────────────────────────────────
  const name = sanitize(body.get("name"), 120);
  const email = sanitize(body.get("email"), 254);
  const portfolio = sanitize(body.get("portfolio"), 512);
  const linkedin = sanitize(body.get("linkedin"), 512);
  const github = sanitize(body.get("github"), 512);
  const experience = sanitize(body.get("experience"), 60);
  const about = sanitize(body.get("about"), 4000);
  const jobTitle = sanitize(body.get("jobTitle"), 120);

  // ── Extract CV file ──────────────────────────────────────────────────────
  const cvEntry = body.get("cv");
  const cvFile = cvEntry instanceof File && cvEntry.size > 0 ? cvEntry : null;

  // ── Server-side validation ───────────────────────────────────────────────
  const errors: Record<string, string> = {};

  if (!name || name.length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!email || !EMAIL_RE.test(email))
    errors.email = "A valid email address is required.";

  if (portfolio && !isValidUrl(portfolio))
    errors.portfolio = "Portfolio must be a valid URL.";

  if (linkedin && !isValidUrl(linkedin))
    errors.linkedin = "LinkedIn must be a valid URL.";

  if (github && !isValidUrl(github))
    errors.github = "GitHub must be a valid URL.";

  if (!experience || !ALLOWED_EXPERIENCE.has(experience))
    errors.experience = "A valid experience level is required.";

  if (!about || about.length < 10)
    errors.about = "Please provide more detail (at least 10 characters).";

  if (!cvFile) errors.file = "A CV file is required.";

  // Validate MIME type and size server-side (client checks are bypassable)
  if (cvFile) {
    if (!ALLOWED_MIME.has(cvFile.type))
      errors.file = "Only PDF, DOC, or DOCX files are accepted.";
    else if (cvFile.size > MAX_FILE_BYTES)
      errors.file = "CV must be 5 MB or smaller.";
  }

  if (Object.keys(errors).length > 0)
    return NextResponse.json({ errors }, { status: 422 });

  // ── Build email content ──────────────────────────────────────────────────

  const textBody = [
    `New job application received via 7ZeroMedia website.`,
    `Position: ${jobTitle || "Not specified"}`,
    "",
    `Name:        ${name}`,
    `Email:       ${email}`,
    `Experience:  ${experience}`,
    portfolio ? `Portfolio:   ${portfolio}` : null,
    linkedin ? `LinkedIn:    ${linkedin}` : null,
    github ? `GitHub:      ${github}` : null,
    "",
    "About the candidate:",
    about,
    "",
    "─────────────────────────────",
    "CV is attached to this email.",
    "This message was sent automatically from the 7ZeroMedia careers form.",
  ]
    .filter(Boolean)
    .join("\n");

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Job Application</title>
</head>
<body style="margin:0;padding:0;background:#F8F8F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F8F8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#F97316 0%,#ea6c0a 100%);padding:28px 36px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.75);">7ZeroMedia — Careers</p>
              <h1 style="margin:8px 0 0;font-size:20px;font-weight:700;color:#ffffff;line-height:1.3;">New Application Received</h1>
              ${jobTitle ? `<p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">Position: <strong>${jobTitle}</strong></p>` : ""}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Name -->
                <tr><td style="padding:0 0 18px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Full Name</p>
                  <p style="margin:0;font-size:15px;color:#111111;font-weight:600;">${name}</p>
                </td></tr>

                <!-- Email -->
                <tr><td style="padding:0 0 18px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Email</p>
                  <p style="margin:0;font-size:15px;color:#111111;">
                    <a href="mailto:${email}" style="color:#F97316;text-decoration:none;">${email}</a>
                  </p>
                </td></tr>

                <!-- Experience -->
                <tr><td style="padding:0 0 18px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Experience Level</p>
                  <p style="margin:0;display:inline-block;font-size:13px;font-weight:600;color:#F97316;background:rgba(249,115,22,0.10);border:1px solid rgba(249,115,22,0.25);border-radius:100px;padding:4px 14px;">${experience}</p>
                </td></tr>

                ${
                  portfolio
                    ? `
                <!-- Portfolio -->
                <tr><td style="padding:0 0 18px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">Portfolio</p>
                  <p style="margin:0;font-size:14px;"><a href="${portfolio}" style="color:#F97316;text-decoration:none;">${portfolio}</a></p>
                </td></tr>`
                    : ""
                }

                ${
                  linkedin
                    ? `
                <!-- LinkedIn -->
                <tr><td style="padding:0 0 18px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">LinkedIn</p>
                  <p style="margin:0;font-size:14px;"><a href="${linkedin}" style="color:#F97316;text-decoration:none;">${linkedin}</a></p>
                </td></tr>`
                    : ""
                }

                ${
                  github
                    ? `
                <!-- GitHub -->
                <tr><td style="padding:0 0 18px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">GitHub</p>
                  <p style="margin:0;font-size:14px;"><a href="${github}" style="color:#F97316;text-decoration:none;">${github}</a></p>
                </td></tr>`
                    : ""
                }

                <!-- About -->
                <tr><td style="padding:0 0 4px;">
                  <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;">About the Candidate</p>
                  <div style="background:#F8F8F8;border-radius:12px;padding:16px 20px;border:1px solid rgba(0,0,0,0.06);">
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#444444;white-space:pre-wrap;">${about}</p>
                  </div>
                </td></tr>

              </table>

              <!-- CV notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:#F8F8F8;border-radius:12px;border:1px solid rgba(0,0,0,0.06);padding:16px 20px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;color:#555555;">
                      📎 <strong>CV is attached</strong> to this email as <em>${cvFile?.name ?? "cv"}</em>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td>
                    <a href="mailto:${email}?subject=Re: Your application for ${encodeURIComponent(jobTitle || "the position")} at 7ZeroMedia"
                       style="display:inline-block;background:linear-gradient(135deg,#F97316 0%,#ea6c0a 100%);color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:10px;">
                      Reply to ${name}
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
                Sent automatically from the 7ZeroMedia careers form. Do not reply to this system email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  // ── Attach the CV file ───────────────────────────────────────────────────
  let cvAttachment: nodemailer.SendMailOptions["attachments"] = [];
  if (cvFile) {
    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
    cvAttachment = [
      {
        filename: cvFile.name,
        content: cvBuffer,
        contentType: cvFile.type,
      },
    ];
  }

  // ── Send email ───────────────────────────────────────────────────────────
  try {
    await transporter.sendMail({
      from:
        process.env.SMTP_HR_FROM ??
        `"7ZeroMedia Careers" <${process.env.SMTP_HR_USER}>`,
      to: "hr@laneway.in",
      replyTo: email,
      subject: `New Application: ${jobTitle || "Open Position"} — ${name}`,
      text: textBody,
      html: htmlBody,
      attachments: cvAttachment,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Careers API] SMTP error:", err);
    }
    return NextResponse.json(
      {
        error:
          "Unable to process your application at this time. Please try again.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
