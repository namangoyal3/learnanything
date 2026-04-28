import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { computeUpiPeriodEnd } from "@/lib/billing/upi-india-server";
import { grantProEntitlements } from "@/lib/billing/pro-reconciliation";

export type RazorpayPlanKey = "monthly" | "quarterly" | "yearly";
export type RazorpayInterval = "month" | "quarter" | "year";

const PLAN_DETAILS: Record<
  RazorpayPlanKey,
  {
    interval: RazorpayInterval;
    amountInRupees: number;
    title: string;
  }
> = {
  monthly: { interval: "month", amountInRupees: 249, title: "Monthly" },
  quarterly: { interval: "quarter", amountInRupees: 669, title: "Quarterly" },
  yearly: { interval: "year", amountInRupees: 1249, title: "Yearly" },
};

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";
const PAYMENT_SOURCE = "razorpay";

type DbClient = typeof prisma;

export type RazorpayCheckoutOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status?: string;
  notes?: Record<string, string>;
  created_at?: number;
};

export type RazorpayPayment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  captured?: boolean;
  captured_at?: number | null;
  order_id?: string;
  notes?: Record<string, string>;
  email?: string | null;
};

export type RazorpayOrderRecordPayload = {
  userId: string;
  email: string;
  plan: RazorpayPlanKey;
  interval: RazorpayInterval;
  planTitle: string;
  baseAmount: number;
  finalAmount: number;
  discountPercent: number;
  couponCode?: string | null;
  currency: "INR";
  order: RazorpayCheckoutOrder;
  notes: Record<string, string>;
};

function getKeyId(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? "";
}

function getKeySecret(): string {
  return process.env.RAZORPAY_KEY_SECRET ?? "";
}

function getWebhookSecret(): string {
  return process.env.RAZORPAY_WEBHOOK_SECRET ?? "";
}

function requireConfig() {
  const keyId = getKeyId();
  const keySecret = getKeySecret();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  return { keyId, keySecret };
}

function getBasicAuthHeader(): string {
  const { keyId, keySecret } = requireConfig();
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(getKeyId() && getKeySecret());
}

export function getRazorpayCheckoutKeyId(): string {
  return getKeyId();
}

export function getRazorpayPlanDetails(plan: RazorpayPlanKey) {
  const details = PLAN_DETAILS[plan];
  if (!details) {
    throw new Error(`Unsupported Razorpay plan: ${plan}`);
  }
  return details;
}

export function getRazorpayPlanAmount(plan: RazorpayPlanKey): number {
  return getRazorpayPlanDetails(plan).amountInRupees;
}

export function getRazorpayPlanTitle(plan: RazorpayPlanKey): string {
  return getRazorpayPlanDetails(plan).title;
}

export function getRazorpayPlanInterval(plan: RazorpayPlanKey): RazorpayInterval {
  return getRazorpayPlanDetails(plan).interval;
}

export function calculateRazorpayDiscountedAmount(baseAmount: number, discountPercent: number): number {
  if (!discountPercent || discountPercent <= 0) return baseAmount;
  const discounted = Math.round(baseAmount * (1 - discountPercent / 100));
  return Math.max(1, discounted);
}

export function verifyRazorpayCheckoutSignature(opts: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = getKeySecret();
  if (!secret) return false;
  const generated = createHmac("sha256", secret)
    .update(`${opts.orderId}|${opts.paymentId}`)
    .digest("hex");

  try {
    const a = Buffer.from(generated, "hex");
    const b = Buffer.from(opts.signature, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return generated === opts.signature;
  }
}

async function razorpayApiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  requireConfig();
  const res = await fetch(`${RAZORPAY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Razorpay API ${res.status}: ${text}`);
  }

  return JSON.parse(text) as T;
}

export async function createRazorpayOrder(opts: {
  userId: string;
  email: string;
  name?: string | null;
  plan: RazorpayPlanKey;
  couponCode?: string | null;
  discountPercent?: number;
  priceBand?: string | null;
}) {
  const details = getRazorpayPlanDetails(opts.plan);
  const baseAmount = details.amountInRupees;
  const discountPercent = opts.discountPercent ?? 0;
  const finalAmount = calculateRazorpayDiscountedAmount(baseAmount, discountPercent);
  const receipt = `pmstreak_${opts.plan}_${opts.userId.slice(-6)}_${Date.now()}`;
  const notes: Record<string, string> = {
    userId: opts.userId,
    email: opts.email,
    plan: opts.plan,
    planTitle: details.title,
    plan_title: details.title,
    interval: details.interval,
    gateway: PAYMENT_SOURCE,
    base_amount_inr: String(baseAmount),
    final_amount_inr: String(finalAmount),
    discount_percent: String(discountPercent),
  };

  if (opts.couponCode) {
    notes.coupon_code = opts.couponCode;
  }
  if (opts.name) {
    notes.customer_name = opts.name;
  }
  if (opts.priceBand) {
    notes.price_band = opts.priceBand;
  }

  const order = await razorpayApiRequest<RazorpayCheckoutOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: finalAmount * 100,
      currency: "INR",
      receipt,
      notes,
    }),
  });

  const payload: RazorpayOrderRecordPayload = {
    userId: opts.userId,
    email: opts.email,
    plan: opts.plan,
    interval: details.interval,
    planTitle: details.title,
    baseAmount,
    finalAmount,
    discountPercent,
    couponCode: opts.couponCode ?? null,
    currency: "INR",
    order,
    notes,
  };

  await prisma.billingEvent.create({
    data: {
      userId: opts.userId,
      provider: PAYMENT_SOURCE,
      eventType: "checkout.order_created",
      externalId: order.id,
      payload: JSON.stringify(payload),
    },
  });

  return payload;
}

export async function fetchRazorpayOrder(orderId: string): Promise<{
  id: string;
  amount: number;
  currency: string;
  status: string;
  notes?: Record<string, string>;
  created_at?: number;
}> {
  return razorpayApiRequest(`/orders/${encodeURIComponent(orderId)}`);
}

export async function fetchRazorpayPayment(paymentId: string): Promise<RazorpayPayment> {
  return razorpayApiRequest(`/payments/${encodeURIComponent(paymentId)}`);
}

export async function captureRazorpayPayment(opts: {
  paymentId: string;
  amount: number;
}): Promise<RazorpayPayment> {
  return razorpayApiRequest(`/payments/${encodeURIComponent(opts.paymentId)}/capture`, {
    method: "POST",
    body: JSON.stringify({ amount: opts.amount }),
  });
}

export function getRazorpayWebhookSecret(): string {
  return getWebhookSecret();
}

export async function grantRazorpayPro(opts: {
  db: DbClient;
  userId: string;
  paymentId: string;
  orderId: string;
  plan: RazorpayPlanKey;
  paidAt?: Date;
  currency?: string;
}) {
  const paidAt = opts.paidAt ?? new Date();
  const interval = getRazorpayPlanInterval(opts.plan);

  const existing = await opts.db.subscription.findFirst({
    where: {
      userId: opts.userId,
      provider: PAYMENT_SOURCE,
      status: "active",
      currentPeriodEnd: { gt: new Date() },
    },
    orderBy: { currentPeriodEnd: "desc" },
  });

  const base =
    existing?.currentPeriodEnd && existing.currentPeriodEnd > paidAt
      ? existing.currentPeriodEnd
      : paidAt;
  const periodEnd = computeUpiPeriodEnd(base, interval);

  const subscriptionData = {
    userId: opts.userId,
    provider: PAYMENT_SOURCE,
    paddleSubscriptionId: opts.paymentId,
    paddlePriceId: opts.orderId,
    status: "active",
    billingInterval: interval === "quarter" ? "quarter" : interval,
    currentPeriodEnd: periodEnd,
  } as const;

  if (existing) {
    await opts.db.subscription.update({
      where: { id: existing.id },
      data: {
        status: "active",
        billingInterval: subscriptionData.billingInterval,
        currentPeriodEnd: periodEnd,
        paddleSubscriptionId: opts.paymentId,
        paddlePriceId: opts.orderId,
      },
    });
  } else {
    await opts.db.subscription.create({
      data: subscriptionData,
    });
  }

  await grantProEntitlements(opts.db, opts.userId, periodEnd, "razorpay");

  await opts.db.user.update({
    where: { id: opts.userId },
    data: {
      plan: "pro",
      billingStatus: "active",
      billingProvider: "razorpay",
      currency: "INR",
      priceBand: "C",
      renewsAt: periodEnd,
      cancelsAt: null,
    },
  });

  return {
    currentPeriodEnd: periodEnd,
    billingInterval: subscriptionData.billingInterval,
  };
}

export async function finalizeRazorpayPayment(opts: {
  db: DbClient;
  orderId: string;
  paymentId: string;
  eventType: string;
  payment: RazorpayPayment;
  orderPayload: RazorpayOrderRecordPayload;
  rawEvent?: unknown;
}) {
  return opts.db.$transaction(async (tx) => {
    const existing = await tx.billingEvent.findUnique({
      where: { externalId: opts.paymentId },
    });
    if (existing) {
      return {
        alreadyProcessed: true,
        currentPeriodEnd: null as Date | null,
      };
    }

    const grant = await grantRazorpayPro({
      db: tx as typeof prisma,
      userId: opts.orderPayload.userId,
      paymentId: opts.paymentId,
      orderId: opts.orderId,
      plan: opts.orderPayload.plan,
      paidAt: opts.payment.captured_at ? new Date(opts.payment.captured_at * 1000) : new Date(),
      currency: opts.payment.currency,
    });

    await tx.billingEvent.create({
      data: {
        userId: opts.orderPayload.userId,
        provider: PAYMENT_SOURCE,
        eventType: opts.eventType,
        externalId: opts.paymentId,
        payload: JSON.stringify({
          orderId: opts.orderId,
          paymentId: opts.paymentId,
          payment: opts.payment,
          orderPayload: opts.orderPayload,
          rawEvent: opts.rawEvent ?? null,
        }),
      },
    });

    return {
      alreadyProcessed: false,
      currentPeriodEnd: grant.currentPeriodEnd,
    };
  });
}
