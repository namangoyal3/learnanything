import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  captureRazorpayPayment,
  fetchRazorpayPayment,
  finalizeRazorpayPayment,
  getRazorpayWebhookSecret,
  getRazorpayPlanDetails,
  type RazorpayOrderRecordPayload,
  type RazorpayPlanKey,
} from "@/lib/billing/razorpay-server";

function timingSafeCompare(a: string, b: string): boolean {
  try {
    const left = Buffer.from(a, "hex");
    const right = Buffer.from(b, "hex");
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  } catch {
    return a === b;
  }
}

function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = getRazorpayWebhookSecret();
  if (!secret) return false;
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeCompare(digest, signature);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parsePlan(value: unknown): RazorpayPlanKey | null {
  if (value === "monthly" || value === "quarterly" || value === "yearly") return value;
  return null;
}

async function resolveOrderPayload(params: {
  orderId: string;
  paymentEntity: Record<string, unknown>;
  orderEntity: Record<string, unknown>;
}): Promise<RazorpayOrderRecordPayload | null> {
  const orderEvent = await prisma.billingEvent.findUnique({
    where: { externalId: params.orderId },
  });

  if (orderEvent && orderEvent.provider === "razorpay" && orderEvent.eventType === "checkout.order_created") {
    try {
      return JSON.parse(orderEvent.payload) as RazorpayOrderRecordPayload;
    } catch {
      // Fall through to notes-based recovery below.
    }
  }

  const notes = (params.orderEntity.notes as Record<string, unknown> | undefined) ??
    (params.paymentEntity.notes as Record<string, unknown> | undefined) ??
    {};

  const plan = parsePlan(notes.plan);
  if (!plan) return null;

  const interval = readString(notes.interval);
  const planDetails = getRazorpayPlanDetails(plan);
  const userId = readString(notes.userId);
  const email = readString(notes.email);
  if (!userId || !email) return null;

  const noteBaseAmount = Number(notes.base_amount_inr);
  const baseAmount = Number.isFinite(noteBaseAmount) && noteBaseAmount > 0 ? noteBaseAmount : planDetails.amountInRupees;
  const noteFinalAmount = Number(notes.final_amount_inr);
  const finalAmount = Number.isFinite(noteFinalAmount) && noteFinalAmount > 0
    ? noteFinalAmount
    : Number(params.paymentEntity.amount ?? planDetails.amountInRupees * 100) / 100;
  const discountPercent = Number(notes.discount_percent ?? 0);

  return {
    userId,
    email,
    plan,
    interval: interval === "quarter" || interval === "year" ? interval : planDetails.interval,
    planTitle: readString(notes.planTitle) || readString(notes.plan_title) || planDetails.title,
    baseAmount: Number.isFinite(baseAmount) ? baseAmount : planDetails.amountInRupees,
    finalAmount: Number.isFinite(finalAmount) ? finalAmount : planDetails.amountInRupees,
    discountPercent: Number.isFinite(discountPercent) ? discountPercent : 0,
    couponCode: readString(notes.coupon_code) || null,
    currency: "INR",
    order: {
      id: params.orderId,
      amount: Number(params.paymentEntity.amount ?? planDetails.amountInRupees * 100),
      currency: readString(params.paymentEntity.currency) || "INR",
      receipt: readString(params.orderEntity.receipt),
      status: readString(params.orderEntity.status),
      notes: Object.fromEntries(Object.entries(notes).map(([key, value]) => [key, String(value)])),
      created_at: typeof params.orderEntity.created_at === "number" ? params.orderEntity.created_at : undefined,
    },
    notes: Object.fromEntries(Object.entries(notes).map(([key, value]) => [key, String(value)])),
  };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = readString(body.event);
  if (eventType !== "payment.captured" && eventType !== "order.paid" && eventType !== "payment.failed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const paymentEntity = (body.payload as any)?.payment?.entity ?? (body.payload as any)?.payment ?? {};
  const orderEntity = (body.payload as any)?.order?.entity ?? (body.payload as any)?.order ?? {};
  const paymentId = readString(paymentEntity.id);
  const orderId = readString(orderEntity.id) || readString(paymentEntity.order_id);

  if (!paymentId || !orderId) {
    return NextResponse.json({ error: "Webhook payload missing order/payment IDs" }, { status: 400 });
  }

  if (eventType === "payment.failed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const orderPayload = await resolveOrderPayload({
    orderId,
    paymentEntity,
    orderEntity,
  });
  if (!orderPayload) {
    return NextResponse.json({ error: "Unable to resolve order payload" }, { status: 404 });
  }

  const payment = await fetchRazorpayPayment(paymentId);
  if (payment.order_id && payment.order_id !== orderId) {
    return NextResponse.json({ error: "Payment does not belong to this order" }, { status: 400 });
  }

  if (payment.amount !== orderPayload.finalAmount * 100) {
    return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
  }

  let finalPayment = payment;
  if (payment.status === "authorized" && !payment.captured) {
    finalPayment = await captureRazorpayPayment({ paymentId, amount: payment.amount });
  } else if (payment.status !== "captured") {
    return NextResponse.json({ ok: true, ignored: true, reason: payment.status });
  }

  const result = await finalizeRazorpayPayment({
    db: prisma,
    orderId,
    paymentId,
    eventType,
    payment: finalPayment,
    orderPayload,
    rawEvent: body,
  });

  return NextResponse.json({
    ok: true,
    alreadyProcessed: result.alreadyProcessed,
    currentPeriodEnd: result.currentPeriodEnd?.toISOString() ?? null,
  });
}
