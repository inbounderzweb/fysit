# Email (Gmail API + Google OAuth2)

Sends email from one authorised Gmail account, with no per-send login.

| Path | Purpose |
| --- | --- |
| `src/lib/email/gmail.ts` | OAuth2 client and `sendEmail()` |
| `src/lib/email/templates/` | Email templates |
| `src/lib/email/errors.ts` | Error codes and Google error mapping |
| `src/services/notification.service.ts` | New-enquiry notifications |
| `src/lib/email/send-handler.ts` | Auth, rate limit and validation for the API |
| `src/validations/email.schema.ts` | Message validation and TypeScript types |
| `src/app/api/email/send/route.ts` | `POST /api/email/send` |
| `tests/email/` | Tests (`npm test`) |

Nodemailer builds the MIME message and the Gmail API (`users.messages.send`) delivers it. Nodemailer's SMTP transport is not used: it needs the full-mailbox scope and does not return a Gmail message ID.

## Setup

### 1. Google Cloud

1. In the Google Cloud project that owns your OAuth client, enable the **Gmail API**.
2. The refresh token must include the `https://www.googleapis.com/auth/gmail.send` scope (`https://mail.google.com/` also works).
3. On the OAuth consent screen, set the publishing status to **In production**. For an External app left in **Testing**, refresh tokens expire after 7 days.

If you need a new refresh token, use the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground):

1. Add `https://developers.google.com/oauthplayground` to the OAuth client's authorised redirect URIs (the client must be of type "Web application").
2. In the Playground settings, tick **Use your own OAuth credentials** and enter the client ID and secret.
3. Authorise the `gmail.send` scope while signed in as the sending account.
4. Exchange the code for tokens and copy the refresh token.
5. Set `GOOGLE_REDIRECT_URI` to the same Playground URL.

### 2. Environment variables

Set these in `.env.local`, and in the hosting provider's environment for production. Never add a `NEXT_PUBLIC_` prefix and never commit real values.

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_REDIRECT_URI=
GMAIL_USER=
```

`GMAIL_USER` must be the account that issued the refresh token (or one of its verified "Send mail as" aliases); otherwise Gmail replaces the From address. `GOOGLE_REDIRECT_URI` is only used when a token is issued, so sending works without it.

Restart the server after changing any of them.

## API

`POST /api/email/send`

Requires a signed-in admin session cookie for a `SUPER_ADMIN` or `ADMIN`. `EDITOR` accounts are refused.

| Field | Type | Notes |
| --- | --- | --- |
| `to` | string or string[] | Required. Bare addresses only |
| `cc`, `bcc` | string or string[] | Optional |
| `replyTo` | string | Optional, one address |
| `subject` | string | Required, one line, up to 200 characters |
| `html` | string | Up to 500,000 characters |
| `text` | string | Up to 200,000 characters |

At least one of `html` or `text` is required; send both for the best deliverability. Up to 20 recipients across `to`, `cc` and `bcc`. Unknown fields are rejected, including `from` and `attachments` (attachments are not supported).

Success (`200`):

```json
{ "success": true, "message": "Email sent successfully", "messageId": "gmail-message-id" }
```

Failure:

```json
{
  "success": false,
  "message": "Failed to send email: the message is invalid",
  "code": "INVALID_MESSAGE",
  "errors": { "to": ["Enter a valid email address"] }
}
```

| Status | `code` | Meaning |
| --- | --- | --- |
| 400 | `INVALID_JSON`, `INVALID_MESSAGE` | Bad request, or Gmail refused the message |
| 401 | `UNAUTHORIZED` | No valid session, or the user is inactive |
| 403 | `FORBIDDEN` | Role may not send email |
| 413 | `PAYLOAD_TOO_LARGE` | Body over 2 MB |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Not `application/json` |
| 429 | `RATE_LIMITED` | This app's limit or Gmail's quota |
| 502 | `AUTH_FAILED` | Bad client ID or secret, or the refresh token is expired or revoked |
| 502 | `PERMISSION_DENIED` | Gmail API disabled or scope missing |
| 502 | `PROVIDER_UNAVAILABLE` | Timeout or Google error. The email may have been sent: check Sent before retrying |
| 503 | `NOT_CONFIGURED` | An environment variable is missing (named in the server log) |
| 500 | `SEND_FAILED` | Unexpected error |

## Testing with Postman

1. Run `npm run dev` and sign in at `http://localhost:3000/admin/login`.
2. In the browser's developer tools, open **Application → Cookies** and copy the value of the `session` cookie.
3. In Postman, create a `POST` request to `http://localhost:3000/api/email/send`.
4. Under **Headers**, add `Cookie: session=<value>`.
5. Under **Body**, choose **raw → JSON**:

```json
{
  "to": "you@example.com",
  "subject": "Welcome to Our Company",
  "html": "<h1>Welcome!</h1><p>Thank you for contacting us.</p>",
  "text": "Welcome! Thank you for contacting us."
}
```

The same with curl:

```bash
curl -i http://localhost:3000/api/email/send \
  -H 'Content-Type: application/json' \
  -H 'Cookie: session=<value>' \
  -d '{"to":"you@example.com","subject":"Test","text":"Hello"}'
```

More cases to try: remove the cookie (401), set `to` to `abc` (400), remove `subject` (400), remove both `html` and `text` (400).

The session cookie grants full admin access for up to 7 days, so don't save it in a shared Postman collection.

## Sending from server code

Call the service directly from server actions and route handlers. Do not call the HTTP API from your own server.

```ts
import { sendEmail } from "@/lib/email/gmail";
import { contactNotificationEmail } from "@/lib/email/templates";

await sendEmail({
  to: "clinic@example.com",
  replyTo: enquiry.email,
  ...contactNotificationEmail(enquiry),
});
```

`sendEmail` validates its input and throws `EmailError` (`code`, `status`). It does **not** check who is calling or apply a rate limit. In any public flow, add both yourself, fix the recipient or tie it to a verified record, and catch the error so a mail failure doesn't lose the user's submission.

| Template | Input |
| --- | --- |
| `welcomeEmail` | `name?` |
| `otpEmail` | `name?`, `code`, `expiresInMinutes` |
| `passwordResetEmail` | `name?`, `resetUrl`, `expiresInMinutes` |
| `orderConfirmationEmail` | `name?`, `orderId`, `items`, `currency?` (INR) |
| `bookingConfirmationEmail` | `preferredDate?` |
| `contactNotificationEmail` | `name`, `email`, `message`, plus optional enquiry fields |
| `customEmail` | `subject`, `html`, `text?` |

Templates escape their inputs, except `customEmail`, which sends your HTML as is. They only render email: reset-token generation, storage and checking are not included.

## Booking forms

The forms on the home, services and Contact pages save the enquiry as soon as they are submitted. Email addresses are not verified. Each IP may submit 5 times every 10 minutes.

## Testing real delivery

```bash
npm run email:test -- you@example.com
```

It reads `.env.local`, sends one message and prints the Gmail message ID, or says why it failed.

## Enquiry notifications

Every new enquiry from either form is emailed to `thefysit@gmail.com` plus the addresses saved under **Admin → Email notifications**, with the visitor as Reply-To. If the email fails, the enquiry is still saved and the failure is logged.

The person who booked also gets a short confirmation (at most 3 per address and 100 overall per hour). It repeats nothing they typed except the preferred date.

## Limits and security

- This app allows 20 requests per user per 10 minutes and 200 per hour overall. Calls made directly to `sendEmail` are not counted.
- The limiter is in memory (`src/lib/rate-limit.ts`): it resets on restart and is per instance. Use a shared store such as Redis on serverless or multi-instance hosting.
- Gmail has its own daily sending limits (roughly 500 recipients for a personal account and 2,000 for Workspace; check [Google's current limits](https://support.google.com/a/answer/166852)). Use a dedicated email provider for bulk mail.
- Logs contain the message ID, recipient count and error code only. Don't log caught Google client errors: they include tokens and message content.
- Sends are not retried automatically, to avoid duplicates. The one exception is a request Google rejected with 401 or 403, which is retried once with a fresh access token.

## Deployment

1. Add the five variables to the production environment.
2. Run `npm test` and `npm run build`.
3. The route needs the Node.js runtime (the default), not Edge, and outbound HTTPS to `googleapis.com`.
4. Send one test email from the deployed site and confirm it arrives.
5. If a secret leaks, reset the client secret in Google Cloud, revoke the app's access in the Google account, and issue a new refresh token.

Changing the sending account's Google password revokes refresh tokens that carry Gmail scopes, so issue a new one afterwards.
