import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCouponData } from "@/lib/coupon";
import { getCurrentUserId } from "@/lib/auth";
import DodoPayments from "dodopayments";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "namangoyal21197@gmail.com";

function isAdmin(email: string | null): boolean {
  return email === ADMIN_EMAIL;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { email, discountPercent, expiresInMinutes = 5, isGlobal = false, maxUses = 1 } = body;

    let targetEmail = email;
    if (isGlobal) {
      targetEmail = "*";
    } else {
      if (!targetEmail || typeof targetEmail !== "string") {
        return NextResponse.json({ error: "Email required when not global" }, { status: 400 });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(targetEmail)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      targetEmail = targetEmail.toLowerCase();
    }

    const discount = typeof discountPercent === "number" 
      ? Math.max(1, Math.min(100, discountPercent)) 
      : 70;

    const expiryMinutes = typeof expiresInMinutes === "number"
      ? Math.max(1, expiresInMinutes) // Removed the 1-day cap
      : 5;

    const validMaxUses = typeof maxUses === "number" ? Math.max(1, maxUses) : 1;

    const { code, expiresAt, signature } = createCouponData(targetEmail, discount, expiryMinutes);

    // Sync to Dodo Payments
    try {
      const dodo = new DodoPayments({
        bearerToken: process.env.DODO_PAYMENTS_API_KEY,
        environment:
          process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
      });

      await dodo.discounts.create({
        amount: discount * 100, // Basis points (e.g. 70% -> 7000)
        type: "percentage",
        code: code,
        name: `PM Streak - Admin Coupon (${isGlobal ? "Global" : targetEmail})`,
        usage_limit: validMaxUses,
        expires_at: expiresAt.toISOString(),
      });
    } catch (dodoError) {
      console.error("Dodo API Error:", dodoError);
      return NextResponse.json(
        { error: "Failed to sync coupon with Dodo Payments" },
        { status: 500 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        email: targetEmail,
        discountPercent: discount,
        signature,
        expiresAt,
        maxUses: validMaxUses,
      },
    });

    return NextResponse.json({
      code: coupon.code,
      email: coupon.email,
      discountPercent: coupon.discountPercent,
      expiresAt: coupon.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Coupon creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
