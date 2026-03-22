/**
 * Fixed-amount UPI QR images for India (static QR per plan).
 * Set NEXT_PUBLIC_* URLs in .env — same build-time rules as other public env.
 */

export type IndiaUpiPlan = {
  /** Public URL to QR image (PNG/WebP) */
  qrImageUrl: string;
  /** Shown next to the QR, e.g. "₹4,999 / year" */
  amountLabel: string;
  /** Short title, e.g. "Yearly Pro" */
  title: string;
};

function push(
  out: IndiaUpiPlan[],
  url: string | undefined,
  amountLabel: string | undefined,
  title: string | undefined,
) {
  const u = url?.trim();
  if (!u) return;
  out.push({
    qrImageUrl: u,
    amountLabel: amountLabel?.trim() || "See amount on QR",
    title: title?.trim() || "Pro",
  });
}

/** Returns configured India UPI plans (empty if none — hide the block). */
export function getIndiaUpiPlans(): IndiaUpiPlan[] {
  const out: IndiaUpiPlan[] = [];
  push(
    out,
    process.env.NEXT_PUBLIC_INDIA_UPI_YEARLY_QR_URL,
    process.env.NEXT_PUBLIC_INDIA_UPI_YEARLY_AMOUNT,
    process.env.NEXT_PUBLIC_INDIA_UPI_YEARLY_TITLE,
  );
  push(
    out,
    process.env.NEXT_PUBLIC_INDIA_UPI_QUARTERLY_QR_URL,
    process.env.NEXT_PUBLIC_INDIA_UPI_QUARTERLY_AMOUNT,
    process.env.NEXT_PUBLIC_INDIA_UPI_QUARTERLY_TITLE,
  );
  push(
    out,
    process.env.NEXT_PUBLIC_INDIA_UPI_MONTHLY_QR_URL,
    process.env.NEXT_PUBLIC_INDIA_UPI_MONTHLY_AMOUNT,
    process.env.NEXT_PUBLIC_INDIA_UPI_MONTHLY_TITLE,
  );
  // Single fallback when only one generic QR is set
  if (out.length === 0) {
    push(
      out,
      process.env.NEXT_PUBLIC_INDIA_UPI_QR_URL,
      process.env.NEXT_PUBLIC_INDIA_UPI_AMOUNT,
      process.env.NEXT_PUBLIC_INDIA_UPI_TITLE,
    );
  }
  return out;
}
