// The real googleapis and Nodemailer code runs here; only the network is faked.
import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";
import { createGmailSender, readGmailConfig } from "@/lib/email/gmail";
import { EmailError, type EmailErrorCode } from "@/lib/email/errors";

const config = {
  clientId: "test-client-id",
  clientSecret: "test-client-secret",
  refreshToken: "test-refresh-token",
  user: "sender@example.com",
};
const message = { to: "customer@example.com", subject: "Hello", text: "Hi there" };

type Reply = { status: number; body: unknown };
const ok = (body: unknown): Reply => ({ status: 200, body });
const apiError = (status: number, reason: string): Reply => ({
  status,
  body: { error: { code: status, errors: [{ reason }] } },
});

function fakeGoogle(replies: { token?: Reply[]; send?: Reply[] } = {}) {
  const calls = { token: 0, send: [] as { authorization: string | null; mime: string }[] };
  const fetchImplementation = (async (input: string | URL, init: RequestInit) => {
    const url = String(input);
    let next: Reply;
    if (url.includes("oauth2.googleapis.com/token")) {
      calls.token += 1;
      next = replies.token?.shift() ?? ok({ access_token: `access-${calls.token}`, expires_in: 3600 });
    } else {
      assert.match(url, /gmail\/v1\/users\/me\/messages\/send/);
      const { raw } = JSON.parse(String(init.body));
      calls.send.push({
        authorization: new Headers(init.headers).get("authorization"),
        mime: Buffer.from(raw, "base64url").toString("utf8"),
      });
      next = replies.send?.shift() ?? ok({ id: "gmail-message-id", threadId: "thread-id" });
    }
    return new Response(JSON.stringify(next.body), {
      status: next.status,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  return { calls, send: createGmailSender(config, { fetchImplementation }) };
}

const rejectsWith = (promise: Promise<unknown>, code: EmailErrorCode) =>
  assert.rejects(promise, (error) => error instanceof EmailError && error.code === code);

let logs: unknown[][] = [];
beforeEach(() => {
  logs = [];
  for (const level of ["info", "error"] as const) {
    mock.method(console, level, (...args: unknown[]) => void logs.push(args));
  }
});

describe("Gmail sender", () => {
  it("sends and returns the Gmail message ID", async () => {
    const google = fakeGoogle();
    const result = await google.send({
      ...message,
      to: ["a@example.com", "b@example.com"],
      cc: "c@example.com",
      bcc: "hidden@example.com",
      replyTo: "reply@example.com",
      html: "<h1>Hi there</h1>",
    });

    assert.deepEqual(result, { messageId: "gmail-message-id", threadId: "thread-id" });
    const [{ mime, authorization }] = google.calls.send;
    assert.equal(authorization, "Bearer access-1");
    assert.match(mime, /^From: .*<sender@example\.com>\r$/m);
    assert.match(mime, /^To: a@example\.com, b@example\.com\r$/m);
    assert.match(mime, /^Cc: c@example\.com\r$/m);
    assert.match(mime, /^Bcc: hidden@example\.com\r$/m);
    assert.match(mime, /^Reply-To: reply@example\.com\r$/m);
    assert.match(mime, /multipart\/alternative/);
  });

  it("reuses the access token between sends", async () => {
    const google = fakeGoogle();
    await google.send(message);
    await google.send(message);
    assert.equal(google.calls.token, 1);
  });

  it("refreshes an access token that has expired", async () => {
    const google = fakeGoogle({ token: [ok({ access_token: "short-lived", expires_in: 1 })] });
    await google.send(message);
    await google.send(message);
    assert.equal(google.calls.token, 2);
    assert.equal(google.calls.send[1].authorization, "Bearer access-2");
  });

  it("refreshes and retries once when Gmail rejects the token early", async () => {
    const google = fakeGoogle({ send: [apiError(401, "authError")] });
    const result = await google.send(message);
    assert.equal(result.messageId, "gmail-message-id");
    assert.equal(google.calls.token, 2);
    assert.equal(google.calls.send.length, 2);
  });

  for (const reason of ["invalid_grant", "invalid_client"]) {
    it(`reports invalid OAuth credentials (${reason})`, async () => {
      const google = fakeGoogle({ token: [{ status: reason === "invalid_client" ? 401 : 400, body: { error: reason } }] });
      await rejectsWith(google.send(message), "AUTH_FAILED");
      assert.equal(google.calls.send.length, 0);
    });
  }

  it("reports a 429 as rate limited without resending", async () => {
    const google = fakeGoogle({ send: [apiError(429, "rateLimitExceeded")] });
    await rejectsWith(google.send(message), "RATE_LIMITED");
    assert.equal(google.calls.send.length, 1);
  });

  it("reports a 403 quota error as rate limited", async () => {
    const quota = apiError(403, "dailyLimitExceeded");
    const google = fakeGoogle({ send: [quota, quota] });
    await rejectsWith(google.send(message), "RATE_LIMITED");
  });

  it("reports missing permission", async () => {
    const denied = apiError(403, "insufficientPermissions");
    const google = fakeGoogle({ send: [denied, denied] });
    await rejectsWith(google.send(message), "PERMISSION_DENIED");
  });

  it("does not resend after a Gmail server error", async () => {
    const google = fakeGoogle({ send: [apiError(503, "backendError")] });
    await rejectsWith(google.send(message), "PROVIDER_UNAVAILABLE");
    assert.equal(google.calls.send.length, 1);
  });

  it("rejects header injection before contacting Google", async () => {
    const google = fakeGoogle();
    for (const bad of [
      { subject: "Hello\r\nBcc: victim@example.com" },
      { to: "a@example.com\r\nBcc: victim@example.com" },
      { replyTo: "a@example.com, victim@example.com" },
    ]) {
      await rejectsWith(google.send({ ...message, ...bad }), "INVALID_MESSAGE");
    }
    assert.equal(google.calls.token + google.calls.send.length, 0);
  });

  it("keeps credentials and content out of errors and logs", async () => {
    const google = fakeGoogle({ send: [apiError(500, "backendError")] });
    const error = await google.send(message).catch((caught: unknown) => caught);
    const output = JSON.stringify([logs, error, (error as Error).stack]);
    for (const secret of [config.clientSecret, config.refreshToken, "access-1", message.to, message.text]) {
      assert.ok(!output.includes(secret), `leaked: ${secret}`);
    }
  });

  it("reports missing configuration", () => {
    assert.throws(() => readGmailConfig({}), (error) => error instanceof EmailError && error.code === "NOT_CONFIGURED");
  });
});
