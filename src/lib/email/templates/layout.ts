import { siteConfig } from "@/config/site";
import type { EmailContent } from "@/lib/email/types";

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Every value interpolated into template HTML goes through this. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ENTITIES[char]);
}

/** Collapses line breaks and control characters so a value is safe in a subject. */
export function oneLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f\u0085\u2028\u2029\s]+/g, " ").trim();
}

/** Allows only web links, so a template can never emit a javascript: or data: URL. */
export function safeUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Email links must use http or https");
  }
  return url.href;
}

export function greeting(name?: string): string {
  return name?.trim() ? `Hi ${oneLine(name)},` : "Hi,";
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 16px">${escapeHtml(text).replace(/\r?\n/g, "<br>")}</p>`;
}

/**
 * Wraps a template's body in the shared branded shell. `bodyHtml` must already
 * be escaped; `text` is the plain-text body.
 */
export function renderEmail(options: { subject: string; bodyHtml: string; text: string }): EmailContent {
  const subject = oneLine(options.subject).slice(0, 200);
  const brand = escapeHtml(siteConfig.name);

  return {
    subject,
    html: `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1f2933">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px">
<p style="margin:0 0 24px;font-size:20px;font-weight:bold">${brand}</p>
${options.bodyHtml}
<p style="margin:32px 0 0;font-size:12px;color:#6b7280">${brand} · ${escapeHtml(siteConfig.tagline)}</p>
</div>
</body>
</html>`,
    text: `${options.text}\n\n${siteConfig.name} · ${siteConfig.tagline}`,
  };
}
