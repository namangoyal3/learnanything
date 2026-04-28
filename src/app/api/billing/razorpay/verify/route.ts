import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  captureRazorpayPayment,
  fetchRazorpayPayment,
  finalizeRazorpayPayment,
  type RazorpayOrderRecordPayload,
  verifyRazorpayCheckoutSignature,
} from "@/lib/billing/razorpay-server";

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = readString(body.orderId) || readString(body.razorpay_order_id);
  const paymentId = readString(body.razorpay_payment_id);
  const signature = readString(body.razorpay_signature);
  const plan = readString(body.plan);

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { error: "orderId, razorpay_payment_id, and razorpay_signature are required" },
      { status: 400 }
    );
  }

  const orderEvent = await prisma.billingEvent.findUnique({
    where: { externalId: orderId },
  });
  if (!orderEvent || orderEvent.provider !== "razorpay" || orderEvent.eventType !== "checkout.order_created") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  let orderPayload: RazorpayOrderRecordPayload;
  try {
    orderPayload = JSON.parse(orderEvent.payload) as RazorpayOrderRecordPayload;
  } catch {
    return NextResponse.json({ error: "Order payload is corrupted" }, { status: 500 });
  }

  if (orderPayload.userId !== userId) {
    return NextResponse.json({ error: "This checkout belongs to a different user" }, { status: 403 });
  }

  if (plan && plan !== orderPayload.plan) {
    return NextResponse.json({ error: "Plan mismatch" }, { status: 400 });
  }

  if (!verifyRazorpayCheckoutSignature({ orderId, paymentId, signature })) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const payment = await fetchRazorpayPayment(paymentId);
  if (payment.order_id && payment.order_id !== orderId) {
    return NextResponse.json({ error: "Payment does not belong to the submitted order" }, { status: 400 });
  }

  if (payment.amount !== orderPayload.finalAmount * 100) {
    return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
  }

  let finalPayment = payment;
  if (payment.status === "authorized" && !payment.captured) {
    finalPayment = await captureRazorpayPayment({
      paymentId,
      amount: payment.amount,
    });
  } else if (payment.status !== "captured") {
    return NextResponse.json(
      { error: `Payment is not captured yet (${payment.status})` },
      { status: 400 }
    );
  }

  const result = await finalizeRazorpayPayment({
    db: prisma,
    orderId,
    paymentId,
    eventType: "payment.captured",
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
