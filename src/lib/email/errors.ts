import type { z } from "zod";

const ERRORS = {
  INVALID_MESSAGE: { status: 400, message: "Failed to send email: the message is invalid" },
  NOT_CONFIGURED: { status: 503, message: "Failed to send email: email is not configured on the server" },
  AUTH_FAILED: { status: 502, message: "Failed to send email: Google rejected the OAuth credentials" },
  PERMISSION_DENIED: {
    status: 502,
    message: "Failed to send email: the Google account or project is not permitted to send",
  },
  RATE_LIMITED: { status: 429, message: "Failed to send email: Gmail sending limit reached, try again later" },
  PROVIDER_UNAVAILABLE: {
    status: 502,
    message: "Failed to send email: no confirmation from Gmail. Check the Sent folder before retrying",
  },
  SEND_FAILED: { status: 500, message: "Failed to send email" },
} as const;

export type EmailErrorCode = keyof typeof ERRORS;

/**
 * The only error the email module throws. It carries no cause on purpose:
 * Google client errors hold the request, including the access token, client
 * secret and message body, and must never reach a log or a response.
 */
export class EmailError extends Error {
  readonly code: EmailErrorCode;
  readonly status: number;
  readonly errors?: Record<string, string[]>;
  /** Google's short reason code (e.g. "invalid_grant"); safe to log. */
  readonly reason?: string;

  constructor(code: EmailErrorCode, details: { errors?: Record<string, string[]>; reason?: string } = {}) {
    super(ERRORS[code].message);
    this.name = "EmailError";
    this.code = code;
    this.status = ERRORS[code].status;
    this.errors = details.errors;
    this.reason = details.reason;
  }
}

export function validationError(error: z.ZodError): EmailError {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "body");
    (errors[field] ??= []).push(issue.message);
  }
  return new EmailError("INVALID_MESSAGE", { errors });
}

const RATE_LIMIT_REASONS = new Set([
  "rateLimitExceeded",
  "userRateLimitExceeded",
  "dailyLimitExceeded",
  "quotaExceeded",
  "RESOURCE_EXHAUSTED",
]);

type GoogleErrorShape = {
  config?: unknown;
  response?: {
    status?: number;
    data?: {
      // The token endpoint sends a string; the Gmail API sends an object.
      error?: string | { status?: string; errors?: { reason?: string }[] };
    };
  };
};

/** Maps anything thrown while talking to Google onto an EmailError. */
export function toEmailError(error: unknown): EmailError {
  if (error instanceof EmailError) return error;

  const { config, response } = (error ?? {}) as GoogleErrorShape;
  // No request attached means it failed before reaching the network.
  if (!config && !response) return new EmailError("SEND_FAILED");
  if (!response) return new EmailError("PROVIDER_UNAVAILABLE");

  const status = response.status ?? 0;
  const body = response.data?.error;
  const reason = typeof body === "string" ? body : (body?.errors?.[0]?.reason ?? body?.status);
  const as = (code: EmailErrorCode) => new EmailError(code, { reason });

  if (status === 429 || (reason && RATE_LIMIT_REASONS.has(reason))) return as("RATE_LIMITED");
  if (reason === "invalid_grant" || reason === "invalid_client" || reason === "unauthorized_client") {
    return as("AUTH_FAILED");
  }
  if (status === 401) return as("AUTH_FAILED");
  if (status === 403 || reason === "invalid_scope") return as("PERMISSION_DENIED");
  if (status === 400) return as("INVALID_MESSAGE");
  if (status >= 500) return as("PROVIDER_UNAVAILABLE");
  return as("SEND_FAILED");
}
