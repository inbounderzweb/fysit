import type { Role } from "@/lib/constants";
import { can } from "@/lib/permissions";
import { emailMessageSchema, type EmailMessageInput } from "@/validations/email.schema";
import { toEmailError, validationError } from "@/lib/email/errors";
import type { SendEmailResponse, SendEmailResult } from "@/lib/email/types";

const MAX_BODY_BYTES = 2 * 1024 * 1024;
const USER_LIMIT = { limit: 20, windowMs: 10 * 60 * 1000 };
const GLOBAL_LIMIT = { limit: 200, windowMs: 60 * 60 * 1000 };

export type SendHandlerDeps = {
  getUser: () => Promise<{ id: string; role: Role } | null>;
  send: (message: EmailMessageInput) => Promise<SendEmailResult>;
  checkRateLimit: (key: string, options: { limit: number; windowMs: number }) => { allowed: boolean };
};

function reply(body: SendEmailResponse, status: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function fail(status: number, code: string, message: string, errors?: Record<string, string[]>) {
  return reply({ success: false, message, code, errors }, status);
}

/** The logic of POST /api/email/send, kept apart from Next.js so it can be tested. */
export function createSendHandler({ getUser, send, checkRateLimit }: SendHandlerDeps) {
  return async function handle(request: Request): Promise<Response> {
    try {
      const user = await getUser();
      if (!user) return fail(401, "UNAUTHORIZED", "Authentication required");
      if (!can(user.role, "create", "emails")) {
        return fail(403, "FORBIDDEN", "You are not allowed to send email");
      }

      // Also blocks cross-site form posts, which cannot set this content type.
      const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
      if (contentType !== "application/json") {
        return fail(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json");
      }

      if (
        !checkRateLimit(`email:user:${user.id}`, USER_LIMIT).allowed ||
        !checkRateLimit("email:global", GLOBAL_LIMIT).allowed
      ) {
        return fail(429, "RATE_LIMITED", "Too many emails. Please try again later");
      }

      const tooLarge = () => fail(413, "PAYLOAD_TOO_LARGE", "Request body is too large");
      if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return tooLarge();
      const text = await request.text();
      if (Buffer.byteLength(text) > MAX_BODY_BYTES) return tooLarge();

      let body: unknown;
      try {
        body = JSON.parse(text);
      } catch {
        return fail(400, "INVALID_JSON", "Request body must be valid JSON");
      }

      const parsed = emailMessageSchema.safeParse(body);
      if (!parsed.success) throw validationError(parsed.error);

      const { messageId } = await send(parsed.data);
      return reply({ success: true, message: "Email sent successfully", messageId }, 200);
    } catch (error) {
      const failure = toEmailError(error);
      // The sender logs its own failures; this catches anything else (e.g. the database).
      if (failure.code === "SEND_FAILED") {
        console.error("Email API error", error instanceof Error ? error.name : "unknown");
      }
      return fail(failure.status, failure.code, failure.message, failure.errors);
    }
  };
}
