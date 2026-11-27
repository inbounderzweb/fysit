import { escapeHtml, paragraph, renderEmail } from "./layout";

/** Sent to the clinic. Pass the visitor's address as `replyTo` when sending. */
export function contactNotificationEmail(enquiry: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  department?: string;
  doctor?: string;
  preferredDate?: string;
  message: string;
}) {
  const fields = (
    [
      ["Name", enquiry.name],
      ["Email", enquiry.email],
      ["Phone", enquiry.phone],
      ["Subject", enquiry.subject],
      ["Department", enquiry.department],
      ["Doctor", enquiry.doctor],
      ["Preferred date", enquiry.preferredDate],
    ] as [string, string | undefined][]
  ).filter((field): field is [string, string] => Boolean(field[1]));

  return renderEmail({
    subject: `New enquiry from ${enquiry.name}`,
    bodyHtml: [
      ...fields.map(
        ([label, value]) =>
          `<p style="margin:0 0 4px"><strong>${label}:</strong> ${escapeHtml(value)}</p>`
      ),
      `<p style="margin:16px 0 4px"><strong>Message</strong></p>`,
      paragraph(enquiry.message),
    ].join("\n"),
    text: [...fields.map(([label, value]) => `${label}: ${value}`), "", "Message:", enquiry.message].join("\n"),
  });
}
