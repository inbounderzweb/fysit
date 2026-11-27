import type { EmailContent } from "@/lib/email/types";
import { oneLine } from "./layout";

/**
 * Your own HTML, sent exactly as given, without the branded shell. It is NOT
 * escaped: only pass markup written by trusted code or staff, and run any
 * user-supplied value inside it through escapeHtml().
 */
export function customEmail({ subject, html, text }: { subject: string; html: string; text?: string }): EmailContent {
  return { subject: oneLine(subject), html, text: text ?? "" };
}
