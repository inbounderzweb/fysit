import { siteConfig } from "@/config/site";
import { paragraph, renderEmail } from "./layout";

/**
 * Sent to the person who booked. The booking forms don't verify addresses, so
 * this deliberately repeats nothing they typed except a format-checked date:
 * otherwise the form could be used to send someone else's text to any inbox.
 */
export function bookingConfirmationEmail({ preferredDate }: { preferredDate?: string }) {
  const lines = [
    "Hi,",
    `Thank you for contacting ${siteConfig.name}. We've received your request and will get back to you the same day.`,
    ...(preferredDate && /^\d{4}-\d{2}-\d{2}$/.test(preferredDate)
      ? [`Preferred date: ${preferredDate}. Your appointment is confirmed once our team has contacted you.`]
      : []),
    "If you didn't send this request, you can ignore this email.",
  ];
  return renderEmail({
    subject: `We've received your request - ${siteConfig.name}`,
    bodyHtml: lines.map(paragraph).join("\n"),
    text: lines.join("\n\n"),
  });
}
