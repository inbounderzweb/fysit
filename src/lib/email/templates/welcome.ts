import { siteConfig } from "@/config/site";
import { greeting, paragraph, renderEmail } from "./layout";

export function welcomeEmail({ name }: { name?: string }) {
  const lines = [
    greeting(name),
    `Welcome to ${siteConfig.name}. We're glad to have you with us.`,
    "If you have any questions, just reply to this email.",
  ];
  return renderEmail({
    subject: `Welcome to ${siteConfig.name}`,
    bodyHtml: lines.map(paragraph).join("\n"),
    text: lines.join("\n\n"),
  });
}
