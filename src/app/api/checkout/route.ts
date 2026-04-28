import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getValidCheckoutCoupon } from "@/lib/billing/checkout-coupons";

const DODO_ENV =
  (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode" | undefined) ??
  "live_mode";

const DODO_BASE =
  DODO_ENV === "test_mode"
    ? "https://test.dodopayments.com"
    : "https://live.dodopayments.com";

const RETURN_URL =
  process.env.DODO_PAYMENTS_RETURN_URL ??
  `${process.env.NEXTAUTH_URL ?? ""}/dashboard?checkout=success`;

const DISCOUNTED_PRODUCTS: Record<string, string> = {
  monthly: process.env.NEXT_PUBLIC_DODO_MONTHLY_DISCOUNTED_PRODUCT_ID ?? "",
  quarterly: process.env.NEXT_PUBLIC_DODO_QUARTERLY_DISCOUNTED_PRODUCT_ID ?? "",
  yearly: process.env.NEXT_PUBLIC_DODO_YEARLY_DISCOUNTED_PRODUCT_ID ?? "",
};

const FALLBACK_PRODUCTS: Record<string, string> = {
  monthly: process.env.NEXT_PUBLIC_DODO_MONTHLY_PRODUCT_ID ?? "",
  quarterly: process.env.NEXT_PUBLIC_DODO_QUARTERLY_PRODUCT_ID ?? "",
  yearly: process.env.NEXT_PUBLIC_DODO_YEARLY_PRODUCT_ID ?? "",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const gateway = searchParams.get("gateway") ?? "dodo";

  if (gateway === "razorpay") {
    const redirectUrl = new URL("/checkout/razorpay", req.url);
    for (const [key, value] of searchParams.entries()) {
      if (key === "gateway") continue;
      redirectUrl.searchParams.set(key, value);
    }
    return NextResponse.redirect(redirectUrl.toString());
  }

  const plan = searchParams.get("metadata_plan") ?? searchParams.get("plan");
  let productId = searchParams.get("productId");

  // If no productId provided but plan is, use the base product for that plan
  if (!productId && plan) {
    productId = FALLBACK_PRODUCTS[plan];
  }

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  if (productId.trim() === "") {
    console.error("[checkout] productId resolved to empty string — check DODO product ID env vars");
    return NextResponse.json({ error: "Checkout is misconfigured. Please contact support." }, { status: 500 });
  }

  // Construct the checkout URL
  const checkoutUrl = new URL(
    `${DODO_BASE.replace("live.dodopayments.com", "checkout.dodopayments.com").replace("test.dodopayments.com", "test.checkout.dodopayments.com")}/buy/${productId}`
  );

  checkoutUrl.searchParams.set("quantity", "1");
  checkoutUrl.searchParams.set("redirect_url", RETURN_URL);

  const email = searchParams.get("email");
  if (email) checkoutUrl.searchParams.set("email", email);

  // Resolve the authenticated user's email for coupon ownership checks
  let sessionEmail: string | null = null;
  const userId = await getCurrentUserId();
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    sessionEmail = user?.email ?? null;
  }

  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("metadata_")) {
      checkoutUrl.searchParams.set(key, value);
    }
    if (key === "discount_code") {
      const coupon = await getValidCheckoutCoupon({
        code: value,
        email,
        sessionEmail,
      });
      if (coupon) {
        checkoutUrl.searchParams.set(key, coupon.code);
      }
    }
  }

  return NextResponse.redirect(checkoutUrl.toString());
}
