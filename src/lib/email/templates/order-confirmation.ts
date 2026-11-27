import { escapeHtml, greeting, oneLine, paragraph, renderEmail } from "./layout";

export type OrderItem = { name: string; quantity: number; unitPrice: number };

export function orderConfirmationEmail({
  name,
  orderId,
  items,
  currency = "INR",
}: {
  name?: string;
  orderId: string;
  items: OrderItem[];
  currency?: string;
}) {
  const money = new Intl.NumberFormat("en-IN", { style: "currency", currency });
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const intro = `Thank you for your order. Your order number is ${oneLine(orderId)}.`;

  const rows = items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0">${escapeHtml(item.name)} × ${item.quantity}</td><td style="padding:8px 0;text-align:right">${escapeHtml(money.format(item.quantity * item.unitPrice))}</td></tr>`
    )
    .join("");

  return renderEmail({
    subject: `Order confirmation ${orderId}`,
    bodyHtml: [
      paragraph(greeting(name)),
      paragraph(intro),
      `<table role="presentation" style="width:100%;border-collapse:collapse">${rows}<tr><td style="padding:12px 0;border-top:1px solid #e5e7eb;font-weight:bold">Total</td><td style="padding:12px 0;border-top:1px solid #e5e7eb;text-align:right;font-weight:bold">${escapeHtml(money.format(total))}</td></tr></table>`,
    ].join("\n"),
    text: [
      greeting(name),
      intro,
      items
        .map((item) => `${item.name} × ${item.quantity}: ${money.format(item.quantity * item.unitPrice)}`)
        .join("\n"),
      `Total: ${money.format(total)}`,
    ].join("\n\n"),
  });
}
