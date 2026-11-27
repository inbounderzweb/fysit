import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emailMessageSchema } from "@/validations/email.schema";
import {
  bookingConfirmationEmail,
  contactNotificationEmail,
  orderConfirmationEmail,
  otpEmail,
  passwordResetEmail,
  welcomeEmail,
} from "@/lib/email/templates";

describe("email templates", () => {
  it("produces sendable content", () => {
    for (const content of [
      welcomeEmail({ name: "Asha" }),
      otpEmail({ code: "123456", expiresInMinutes: 10 }),
      passwordResetEmail({ resetUrl: "https://example.com/reset?token=abc", expiresInMinutes: 30 }),
      orderConfirmationEmail({ orderId: "A-1", items: [{ name: "Session", quantity: 2, unitPrice: 500 }] }),
      contactNotificationEmail({ name: "Asha", email: "asha@example.com", message: "Hello" }),
    ]) {
      assert.ok(emailMessageSchema.safeParse({ to: "a@example.com", ...content }).success, content.subject);
    }
  });

  it("escapes visitor input and keeps the subject on one line", () => {
    const content = contactNotificationEmail({
      name: "Eve\r\nBcc: victim@example.com",
      email: "eve@example.com",
      message: "<script>alert(1)</script>",
    });
    assert.doesNotMatch(content.subject, /[\r\n]/);
    assert.doesNotMatch(content.html, /<script>/);
    assert.match(content.html, /&lt;script&gt;/);
  });

  it("keeps visitor text out of the booking confirmation", () => {
    const content = bookingConfirmationEmail({ preferredDate: "visit http://spam.example" });
    assert.doesNotMatch(content.html + content.text, /spam\.example/);
  });

  it("refuses non-web reset links", () => {
    assert.throws(() => passwordResetEmail({ resetUrl: "javascript:alert(1)", expiresInMinutes: 5 }));
  });
});
