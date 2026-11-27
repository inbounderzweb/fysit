import "server-only";
import { sendEmail } from "@/lib/email/gmail";
import { bookingConfirmationEmail, contactNotificationEmail } from "@/lib/email/templates";
import { checkRateLimit } from "@/lib/rate-limit";
import { getNotificationRecipients } from "@/services/settings.service";
import { DEFAULT_NOTIFICATION_EMAIL } from "@/lib/constants";
import type { EnquiryInput } from "@/validations/enquiry.schema";

type Enquiry = Omit<EnquiryInput, "company">;

// The forms don't verify addresses, so these stop repeat submissions filling
// one inbox, or using up the Gmail account's daily quota.
const CONFIRMATION_LIMIT = { limit: 3, windowMs: 60 * 60 * 1000 };
const ALL_CONFIRMATIONS_LIMIT = { limit: 100, windowMs: 60 * 60 * 1000 };

function logFailure(what: string, error: unknown) {
  // EmailError carries no credentials or message content.
  console.error(`${what} was not sent`, error instanceof Error ? error.message : "unknown error");
}

/** Tells the addresses in Admin → Email notifications about the enquiry. */
async function notifyClinic(enquiry: Enquiry) {
  let recipients: string[] = [DEFAULT_NOTIFICATION_EMAIL];
  try {
    recipients = await getNotificationRecipients();
  } catch (error) {
    console.error("Enquiry notification: using the default recipient only", error);
  }

  try {
    await sendEmail({ to: recipients, replyTo: enquiry.email, ...contactNotificationEmail(enquiry) });
  } catch (error) {
    logFailure("Enquiry notification", error);
  }
}

/** Tells the person who booked that their request arrived. */
async function confirmToVisitor(enquiry: Enquiry) {
  const key = `confirmation:${enquiry.email.toLowerCase()}`;
  if (
    !checkRateLimit(key, CONFIRMATION_LIMIT).allowed ||
    !checkRateLimit("confirmation:all", ALL_CONFIRMATIONS_LIMIT).allowed
  ) {
    return;
  }

  try {
    await sendEmail({
      to: enquiry.email,
      replyTo: DEFAULT_NOTIFICATION_EMAIL,
      ...bookingConfirmationEmail(enquiry),
    });
  } catch (error) {
    logFailure("Booking confirmation", error);
  }
}

/**
 * Sends both emails for a new website enquiry. Never throws: the enquiry is
 * already saved, and a mail problem must not turn that into an error for the
 * visitor.
 */
export async function notifyNewEnquiry(enquiry: Enquiry): Promise<void> {
  await Promise.all([notifyClinic(enquiry), confirmToVisitor(enquiry)]);
}
