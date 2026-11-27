// Usage: npm run email:test -- you@example.com
import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(process.cwd()));

async function main() {
  const to = process.argv[2];
  if (!to) throw new Error("Give a recipient: npm run email:test -- you@example.com");

  const { sendEmail } = await import("../src/lib/email/gmail");
  const { messageId } = await sendEmail({
    to,
    subject: "Test email from the website",
    text: "This is a test. If you can read it, Gmail sending is working.",
  });
  console.log(`Sent to ${to} (Gmail message ID ${messageId})`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
