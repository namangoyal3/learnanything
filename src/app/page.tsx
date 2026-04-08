import React from 'react';
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BrowserLink from "@/components/BrowserLink";
import SafariBar from "@/components/SafariBar";
import JsonLd, { breadcrumbSchema, howToSchema, faqSchema, speakableSchema, SITE_URL } from "@/components/JsonLd";
import HomeCTA from '../components/HomeCTA';

export const metadata: Metadata = {
  title: "PM Streak — Daily PM Lessons from Lenny's Podcast | Duolingo for Product Managers",
  description:
    "PM Streak is the fastest way to sharpen your product intuition. Daily 2-minute PM lessons from 300+ Lenny's Podcast episodes with streak tracking, XP, leaderboards, and AI-powered practice. Used by product managers at top tech companies.",
  keywords: [
    "product management", "PM lessons", "Lenny's Podcast", "product manager training",
    "PM interview prep", "product sense", "PM streak", "daily PM practice",
    "product management course", "PM frameworks", "duolingo for PMs",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PM Streak — Duolingo for Product Managers",
    description:
      "The fastest way to get sharper as a PM. Daily 2-minute lessons from 300+ Lenny's Podcast episodes with streaks, XP, and leaderboards.",
    url: "/",
    type: "website",
    images: [{ url: "/api/og?title=PM+Streak", width: 1200, height: 630, alt: "PM Streak — Daily PM Lessons" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Streak — Duolingo for Product Managers",
    description:
      "Daily 2-min PM lessons from Lenny's Podcast. Streaks, XP, leaderboards. The fastest way to get sharper as a PM.",
    images: ["/api/og?title=PM+Streak"],
  },
  other: {
    "article:modified_time": new Date().toISOString(),
  },
};

export default async function Home() {
  // Logged-in users skip the landing page entirely
  const userId = await getCurrentUserId();
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboarded: true },
    });
    redirect(user?.onboarded ? "/dashboard" : "/onboarding");
  }

  const siteUrl = SITE_URL;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PM Streak",
    alternateName: "Duolingo for Product Managers",
    url: siteUrl,
    description:
      "PM Streak is a daily product management learning platform that delivers 2-minute micro-lessons from 300+ Lenny's Podcast episodes with streak tracking, XP, leaderboards, and AI-powered content generation.",
    foundingDate: "2024",
    sameAs: [
      "https://www.producthunt.com/products/pm-streak",
    ],
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PM Streak",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free plan with 22 core lessons and 10 credits/month" },
      { "@type": "Offer", price: "9", priceCurrency: "USD", description: "Pro plan with 292+ lessons, unlimited AI, interview prep" },
    ],
    description:
      "Product management micro-lessons powered by 300+ Lenny's Podcast episodes. Features streak tracking, XP progression, AI lesson generation, PM interview prep, and a curated jobs board.",
  };

  return (
    <div>
      <HomeCTA />
    </div>
  );
}
