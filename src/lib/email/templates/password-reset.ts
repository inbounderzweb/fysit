import { siteConfig } from "@/config/site";
import { escapeHtml, greeting, paragraph, renderEmail, safeUrl } from "./layout";

/** `resetUrl` must carry the caller's own single-use, expiring token. */
export function passwordResetEmail({
  name,
  resetUrl,
  expiresInMinutes,
}: {
  name?: string;
  resetUrl: string;
  expiresInMinutes: number;
}) {
  const url = safeUrl(resetUrl);
  const intro = "We received a request to reset your password.";
  const outro = `The link expires in ${expiresInMinutes} minutes. If you didn't ask for it, you can ignore this email and your password will stay the same.`;
  return renderEmail({
    subject: `Reset your ${siteConfig.name} password`,
    bodyHtml: [
      paragraph(greeting(name)),
      paragraph(intro),
      `<p style="margin:0 0 16px"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 20px;background:#1f2933;color:#ffffff;border-radius:6px;text-decoration:none">Reset password</a></p>`,
      paragraph(outro),
    ].join("\n"),
    text: [greeting(name), intro, `Reset your password: ${url}`, outro].join("\n\n"),
  });
}
