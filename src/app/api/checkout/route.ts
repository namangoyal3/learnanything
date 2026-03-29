import { NextRequest, NextResponse } from "next/server";

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
  let productId = searchParams.get("productId");
  const plan = searchParams.get("metadata_plan") ?? searchParams.get("plan");

  if (!productId && plan) {
    productId = DISCOUNTED_PRODUCTS[plan] || FALLBACK_PRODUCTS[plan];
  }

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  let checkoutUrl: URL;
  
  if (DISCOUNTED_PRODUCTS[plan || ""]) {
    checkoutUrl = new URL(
      `${DODO_BASE.replace("live.dodopayments.com", "checkout.dodopayments.com").replace("test.dodopayments.com", "test.checkout.dodopayments.com")}/buy/${productId}`
    );
  } else {
    checkoutUrl = new URL(
      `${DODO_BASE.replace("live.dodopayments.com", "checkout.dodopayments.com").replace("test.dodopayments.com", "test.checkout.dodopayments.com")}/buy/${productId}`
    );
    checkoutUrl.searchParams.set("coupon_code", "FLAT70");
  }

  checkoutUrl.searchParams.set("quantity", "1");
  checkoutUrl.searchParams.set("redirect_url", RETURN_URL);

  const email = searchParams.get("email");
  if (email) checkoutUrl.searchParams.set("email", email);

  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("metadata_")) {
      checkoutUrl.searchParams.set(key, value);
    }
  }

  return NextResponse.redirect(checkoutUrl.toString());
}
