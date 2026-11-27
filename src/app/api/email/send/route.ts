import { getApiUser } from "@/lib/dal";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email/gmail";
import { createSendHandler } from "@/lib/email/send-handler";

export const POST = createSendHandler({ getUser: getApiUser, send: sendEmail, checkRateLimit });
