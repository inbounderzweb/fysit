import { siteConfig } from "@/config/site";
import { escapeHtml, greeting, paragraph, renderEmail } from "./layout";

/** Generating, storing and checking the code is the caller's job. */
export function otpEmail({ name, code, expiresInMinutes }: { name?: string; code: string; expiresInMinutes: number }) {
  const intro = "Use this code to verify your request:";
  const outro = `It expires in ${expiresInMinutes} minutes. If you didn't ask for it, you can ignore this email. Never share this code with anyone.`;
  return renderEmail({
    subject: `Your ${siteConfig.name} verification code`,
    bodyHtml: [
      paragraph(greeting(name)),
      paragraph(intro),
      `<p style="margin:0 0 16px;font-size:30px;font-weight:bold;letter-spacing:6px">${escapeHtml(code)}</p>`,
      paragraph(outro),
    ].join("\n"),
    text: [greeting(name), intro, code, outro].join("\n\n"),
  });
}
