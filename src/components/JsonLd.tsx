/**
 * Reusable JSON-LD structured data component for SEO/GEO optimization.
 * Renders a <script type="application/ld+json"> tag with the given data.
 */

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ── Schema builder helpers ─────────────────────────────── */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://learnanything.pro";
const SITE_NAME = "PM Streak";

export function breadcrumbSchema(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqSchema(
  pairs: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((p) => ({
      "@type": "Question",
      name: p.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: p.answer,
      },
    })),
  };
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string; // ISO 8601 duration e.g. "PT2M"
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function courseSchema(opts: {
  name: string;
  description: string;
  provider: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
    provider: {
      "@type": "Organization",
      name: opts.provider,
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free",
    },
  };
}

export function speakableSchema(cssSelectors: string[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}

export { SITE_URL, SITE_NAME };

export function articleSchema(opts: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url: string };
  publisher: { name: string; url: string };
  url?: string;
  keywords?: string[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    image: {
      "@type": "ImageObject",
      url: opts.image,
      width: 1200,
      height: 630,
    },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: "en-US",
    ...(opts.url ? { url: opts.url, mainEntityOfPage: { "@type": "WebPage", "@id": opts.url } } : {}),
    ...(opts.keywords ? { keywords: opts.keywords.join(", ") } : {}),
    author: {
      "@type": "Person",
      name: opts.author.name,
      url: opts.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: opts.publisher.name,
      url: opts.publisher.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
        width: 512,
        height: 512,
      },
    },
  };
}

export function webPageSchema(opts: {
  url: string;
  name: string;
  description: string;
  dateModified?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`}#webpage`,
    url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
    name: opts.name,
    description: opts.description,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}
