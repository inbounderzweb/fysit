import "server-only";
import { google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { emailMessageSchema, type EmailMessage, type EmailMessageInput } from "@/validations/email.schema";
import { EmailError, toEmailError, validationError } from "@/lib/email/errors";
import type { GmailConfig, SendEmailResult } from "@/lib/email/types";

const REQUEST_TIMEOUT_MS = 20_000;

export function readGmailConfig(env: Record<string, string | undefined> = process.env): GmailConfig {
  const config = {
    clientId: env.GOOGLE_CLIENT_ID?.trim() ?? "",
    clientSecret: env.GOOGLE_CLIENT_SECRET?.trim() ?? "",
    refreshToken: env.GOOGLE_REFRESH_TOKEN?.trim() ?? "",
    // Only used when a refresh token is first issued, so sending works without it.
    redirectUri: env.GOOGLE_REDIRECT_URI?.trim() || undefined,
    user: env.GMAIL_USER?.trim() ?? "",
  };

  const missing = [
    !config.clientId && "GOOGLE_CLIENT_ID",
    !config.clientSecret && "GOOGLE_CLIENT_SECRET",
    !config.refreshToken && "GOOGLE_REFRESH_TOKEN",
    !z.email().safeParse(config.user).success && "GMAIL_USER",
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error(`Email: missing or invalid environment variables: ${missing.join(", ")}`);
    throw new EmailError("NOT_CONFIGURED");
  }
  return config;
}

/** Whether every setting needed to send is present (not whether Google accepts them). */
export function isEmailConfigured(): boolean {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GMAIL_USER } = process.env;
  return [GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GMAIL_USER].every((value) => value?.trim());
}

/**
 * Nodemailer builds the MIME message (encoding, multipart, header safety);
 * the Gmail API delivers it, so only the gmail.send scope is needed.
 */
async function buildRawMessage(from: string, message: EmailMessage): Promise<string> {
  const mime = new MailComposer({
    from: { name: siteConfig.name, address: from },
    to: message.to,
    cc: message.cc,
    bcc: message.bcc,
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
    newline: "win",
    disableFileAccess: true,
    disableUrlAccess: true,
  }).compile();
  // Gmail reads recipients from the headers, so Bcc has to stay in them.
  // Gmail removes it from the copies it delivers.
  mime.keepBcc = true;

  return (await mime.build()).toString("base64url");
}

/**
 * One OAuth2 client per sender: it fetches an access token on first use,
 * caches it, refreshes it shortly before expiry, and (with
 * forceRefreshOnFailure) refreshes and retries once if Gmail rejects it early.
 */
export function createGmailSender(
  config: GmailConfig,
  options: { fetchImplementation?: typeof fetch } = {}
) {
  const auth = new google.auth.OAuth2({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    forceRefreshOnFailure: true,
    transporterOptions: {
      timeout: REQUEST_TIMEOUT_MS,
      fetchImplementation: options.fetchImplementation,
    },
  });
  auth.setCredentials({ refresh_token: config.refreshToken });
  const gmail = google.gmail({ version: "v1", auth });

  return async function send(input: EmailMessageInput): Promise<SendEmailResult> {
    // Validated here as well as at the API, so server code that calls the
    // service directly gets the same header-injection protection.
    const parsed = emailMessageSchema.safeParse(input);
    if (!parsed.success) throw validationError(parsed.error);
    const message = parsed.data;
    const recipients = message.to.length + (message.cc?.length ?? 0) + (message.bcc?.length ?? 0);

    try {
      const raw = await buildRawMessage(config.user, message);
      // Never retried automatically: a repeated send is a duplicate email.
      const { data } = await gmail.users.messages.send(
        { userId: "me", requestBody: { raw } },
        { retry: false }
      );
      if (!data.id) throw new EmailError("SEND_FAILED");

      console.info("Email sent", { messageId: data.id, recipients });
      return { messageId: data.id, threadId: data.threadId ?? undefined };
    } catch (error) {
      const failure = toEmailError(error);
      console.error("Email failed", { code: failure.code, reason: failure.reason, recipients });
      throw failure;
    }
  };
}

let defaultSender: ReturnType<typeof createGmailSender> | undefined;

/** Sends through the account configured in the environment. Throws EmailError. */
export async function sendEmail(input: EmailMessageInput): Promise<SendEmailResult> {
  defaultSender ??= createGmailSender(readGmailConfig());
  return defaultSender(input);
}
