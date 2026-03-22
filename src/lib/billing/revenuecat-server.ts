import { prisma } from "@/lib/prisma";
import {
  applyProEntitlementsForUpi,
  getActiveUpiSubscription,
} from "@/lib/billing/upi-india-server";

const RC_API = "https://api.revenuecat.com/v1";

const PRO_KEYS = [
  "unlimited_ai_lessons",
  "deep_dives",
  "interview_sprint",
  "role_roadmaps",
  "saved_notes",
  "premium_recaps",
] as const;

export function getRevenueCatEntitlementId(): string {
  return process.env.REVENUECAT_ENTITLEMENT_ID ?? "pro";
}

type RcEntitlement = {
  expires_date?: string | null;
  is_active?: boolean;
};

function isEntitlementActive(ent: RcEntitlement | undefined): boolean {
  if (!ent) return false;
  if (ent.is_active === true) return true;
  if (ent.expires_date) {
    const d = new Date(ent.expires_date);
    return !Number.isNaN(d.getTime()) && d > new Date();
  }
  return false;
}

async function demoteToFree(appUserId: string) {
  await prisma.user.update({
    where: { id: appUserId },
    data: {
      plan: "free",
      billingStatus: "none",
      billingProvider: null,
      renewsAt: null,
      cancelsAt: null,
    },
  });
  await prisma.entitlement.deleteMany({
    where: { userId: appUserId, source: "subscription" },
  });
  await prisma.entitlement.deleteMany({
    where: { userId: appUserId, source: "upi_india" },
  });
}

/** When RevenueCat has no active sub, keep Pro if India UPI period is still valid. */
async function restoreProFromUpiIfNeeded(appUserId: string): Promise<boolean> {
  const upi = await getActiveUpiSubscription(appUserId);
  if (!upi?.currentPeriodEnd) return false;

  await prisma.user.update({
    where: { id: appUserId },
    data: {
      plan: "pro",
      billingStatus: "active",
      billingProvider: "upi_india",
      renewsAt: upi.currentPeriodEnd,
      cancelsAt: null,
    },
  });
  await applyProEntitlementsForUpi(appUserId, upi.currentPeriodEnd);
  await prisma.entitlement.deleteMany({
    where: { userId: appUserId, source: "subscription" },
  });
  return true;
}

/**
 * Sync Prisma user + DB entitlements from RevenueCat REST API (source of truth for RC).
 * India UPI Pro is preserved when RC is inactive but the UPI subscription row is still in period.
 */
export async function syncSubscriberFromRevenueCat(appUserId: string): Promise<{
  active: boolean;
  managementUrl: string | null;
}> {
  const secret = process.env.REVENUECAT_SECRET_API_KEY;
  if (!secret) {
    throw new Error("REVENUECAT_SECRET_API_KEY is not configured");
  }

  const exists = await prisma.user.findUnique({
    where: { id: appUserId },
    select: { id: true },
  });
  if (!exists) {
    return { active: false, managementUrl: null };
  }

  const entitlementId = getRevenueCatEntitlementId();

  const res = await fetch(
    `${RC_API}/subscribers/${encodeURIComponent(appUserId)}`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    }
  );

  const text = await res.text();
  if (res.status === 404) {
    const restored = await restoreProFromUpiIfNeeded(appUserId);
    if (!restored) await demoteToFree(appUserId);
    return { active: false, managementUrl: null };
  }
  if (!res.ok) {
    throw new Error(`RevenueCat API ${res.status}: ${text}`);
  }

  const data = JSON.parse(text) as {
    subscriber?: {
      entitlements?: Record<string, RcEntitlement>;
      management_url?: string | null;
    };
  };

  const sub = data.subscriber;
  const ent = sub?.entitlements?.[entitlementId];
  const active = isEntitlementActive(ent);
  const managementUrl =
    typeof sub?.management_url === "string" ? sub.management_url : null;

  const expiresAt =
    ent?.expires_date && active ? new Date(ent.expires_date) : null;

  if (active) {
    await prisma.user.update({
      where: { id: appUserId },
      data: {
        plan: "pro",
        billingStatus: "active",
        billingProvider: "revenuecat",
        renewsAt: expiresAt,
      },
    });

    await prisma.entitlement.deleteMany({
      where: { userId: appUserId, source: "upi_india" },
    });

    for (const key of PRO_KEYS) {
      await prisma.entitlement.upsert({
        where: { userId_key: { userId: appUserId, key } },
        create: { userId: appUserId, key, source: "subscription" },
        update: { expiresAt: null, source: "subscription" },
      });
    }

    return { active, managementUrl };
  }

  const restored = await restoreProFromUpiIfNeeded(appUserId);
  if (restored) {
    return { active: false, managementUrl };
  }

  await demoteToFree(appUserId);
  return { active: false, managementUrl };
}

export async function fetchManagementUrlForUser(
  appUserId: string
): Promise<string | null> {
  const { managementUrl } = await syncSubscriberFromRevenueCat(appUserId);
  return managementUrl;
}

export function getAppUserIdFromWebhookEvent(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const ev = b.event as Record<string, unknown> | undefined;
  if (ev) {
    if (typeof ev.app_user_id === "string") return ev.app_user_id;
    if (typeof ev.original_app_user_id === "string") {
      return ev.original_app_user_id;
    }
  }
  return null;
}

export function getWebhookEventId(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const ev = b.event as Record<string, unknown> | undefined;
  if (ev && typeof ev.id === "string") return ev.id;
  return null;
}
