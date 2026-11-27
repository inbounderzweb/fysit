import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Role } from "@/lib/constants";
import { checkRateLimit } from "@/lib/rate-limit";
import { EmailError } from "@/lib/email/errors";
import { createSendHandler, type SendHandlerDeps } from "@/lib/email/send-handler";

const valid = {
  to: "customer@example.com",
  subject: "Welcome to Our Company",
  html: "<h1>Welcome!</h1>",
  text: "Welcome!",
};

let userCount = 0;
function setup(overrides: Partial<SendHandlerDeps> & { role?: Role } = {}) {
  const sent: unknown[] = [];
  const id = `user-${++userCount}`;
  const handle = createSendHandler({
    getUser: async () => ({ id, role: overrides.role ?? "ADMIN" }),
    send: async (message) => {
      sent.push(message);
      return { messageId: "gmail-message-id" };
    },
    checkRateLimit: () => ({ allowed: true }),
    ...overrides,
  });

  const post = async (body: unknown, headers: Record<string, string> = { "content-type": "application/json" }) => {
    const response = await handle(
      new Request("http://localhost/api/email/send", {
        method: "POST",
        headers,
        body: typeof body === "string" ? body : JSON.stringify(body),
      })
    );
    return { status: response.status, body: await response.json() };
  };

  return { post, sent };
}

describe("POST /api/email/send", () => {
  it("sends a valid email", async () => {
    const { post, sent } = setup();
    assert.deepEqual(await post(valid), {
      status: 200,
      body: { success: true, message: "Email sent successfully", messageId: "gmail-message-id" },
    });
    assert.equal(sent.length, 1);
  });

  const invalid: [string, object, string][] = [
    ["an invalid recipient", { ...valid, to: "not-an-email" }, "to"],
    ["an invalid address in a list", { ...valid, to: ["a@example.com", "nope"] }, "to"],
    ["a missing recipient", { ...valid, to: undefined }, "to"],
    ["too many recipients", { ...valid, to: Array(15).fill("a@example.com"), cc: Array(6).fill("b@example.com") }, "to"],
    ["a missing subject", { ...valid, subject: undefined }, "subject"],
    ["a blank subject", { ...valid, subject: "   " }, "subject"],
    ["missing content", { to: valid.to, subject: valid.subject }, "content"],
    ["blank content", { ...valid, html: " ", text: "" }, "content"],
    ["unsupported fields", { ...valid, attachments: [] }, "body"],
  ];

  for (const [name, body, field] of invalid) {
    it(`rejects ${name}`, async () => {
      const { post, sent } = setup();
      const response = await post(body);
      assert.equal(response.status, 400);
      assert.equal(response.body.success, false);
      assert.ok(response.body.errors[field], JSON.stringify(response.body.errors));
      assert.equal(sent.length, 0);
    });
  }

  it("rejects an unauthenticated request", async () => {
    const { post, sent } = setup({ getUser: async () => null });
    assert.equal((await post(valid)).status, 401);
    assert.equal(sent.length, 0);
  });

  it("rejects a role without permission", async () => {
    const { post, sent } = setup({ role: "EDITOR" });
    assert.equal((await post(valid)).status, 403);
    assert.equal(sent.length, 0);
  });

  it("allows a super admin", async () => {
    assert.equal((await setup({ role: "SUPER_ADMIN" }).post(valid)).status, 200);
  });

  it("requires a JSON content type", async () => {
    const response = await setup().post(JSON.stringify(valid), { "content-type": "text/plain" });
    assert.equal(response.status, 415);
  });

  it("rejects malformed JSON", async () => {
    assert.equal((await setup().post("{nope")).status, 400);
  });

  it("rejects an oversized body", async () => {
    assert.equal((await setup().post("x".repeat(2 * 1024 * 1024 + 1))).status, 413);
  });

  it("limits each user to 20 requests per window", async () => {
    const { post, sent } = setup({ checkRateLimit });
    for (let i = 0; i < 20; i++) assert.equal((await post(valid)).status, 200);
    assert.equal((await post(valid)).status, 429);
    assert.equal(sent.length, 20);
  });

  it("passes on a Gmail quota error", async () => {
    const { post } = setup({
      send: async () => {
        throw new EmailError("RATE_LIMITED");
      },
    });
    const response = await post(valid);
    assert.equal(response.status, 429);
    assert.equal(response.body.code, "RATE_LIMITED");
  });

  it("hides the details of unexpected errors", async (t) => {
    t.mock.method(console, "error", () => {});
    const { post } = setup({
      send: async () => {
        throw new Error("secret internal detail");
      },
    });
    const response = await post(valid);
    assert.equal(response.status, 500);
    assert.equal(response.body.message, "Failed to send email");
  });
});
