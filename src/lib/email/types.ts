/** The rendered parts of an email, as produced by the templates. */
export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

export type SendEmailResult = {
  /** Gmail's own ID for the sent message. */
  messageId: string;
  threadId?: string;
};

export type GmailConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  redirectUri?: string;
  /** The authorised mailbox; used as the From address. */
  user: string;
};

export type SendEmailResponse =
  | { success: true; message: string; messageId: string }
  | { success: false; message: string; code: string; errors?: Record<string, string[]> };
