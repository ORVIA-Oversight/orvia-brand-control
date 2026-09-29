export const seoAgent = {
  code: "SEO-01",
  name: "ORVIA Search & Discovery",
  authority: "recommend-and-queue",
  conductor: "IRIS",
  owner: "Brand Control",
  cadence: "daily",
  objective:
    "Improve qualified organic discovery across the ORVIA estate by using verified search data, technical SEO evidence, content gaps, internal linking and industry intent. Never promise or fabricate rankings.",
  principles: [
    "Use real Google Search Console / analytics data when connected; never invent keyword performance.",
    "Optimise for qualified commercial intent, not vanity traffic.",
    "Protect product boundaries, legal claims, accreditation wording and case-study evidence.",
    "Do not auto-publish material changes without the configured human approval gate.",
    "No keyword stuffing, doorway pages, fake locations, fake reviews, hidden text or other spam tactics.",
    "Every recommendation must name the site, page, target query or industry, evidence, expected user intent and verification method.",
    "SEO changes inherit canonical ORVIA brand, accessibility, commercial and content governance."
  ],
  dailyChecks: [
    "Search Console clicks, impressions, CTR and average position",
    "New and declining queries",
    "Pages gaining or losing visibility",
    "High-impression / low-CTR opportunities",
    "Queries in positions 4-20 that could move with stronger relevance",
    "Indexing, sitemap, robots and canonical issues",
    "Missing or duplicated titles and meta descriptions",
    "Structured data and Open Graph coverage",
    "Internal-link gaps across ORVIA products",
    "Broken links, redirect chains and orphan pages",
    "Image alt coverage and media discoverability",
    "Commercial landing-page intent and CTA alignment",
    "Industry/topic gaps against the approved ORVIA offer",
    "Brand vs non-brand search mix",
    "AI-search discoverability: clear entities, factual source pages, structured answers and provenance"
  ],
  protectedActions: [
    "publishing a new page",
    "changing pricing or commercial claims",
    "changing legal / regulatory wording",
    "publishing a testimonial or case study",
    "changing a canonical domain",
    "changing product identity",
    "deleting or redirecting a live page"
  ],
  output: {
    daily: "SEO health + priority actions + exceptions",
    weekly: "query/page/industry opportunity plan",
    monthly: "organic growth, conversion contribution, content gaps and estate strategy"
  }
} as const;

export const seoIndustryThemes = [
  "health and social care governance",
  "safeguarding oversight",
  "evidence readiness",
  "operational assurance",
  "care provider governance",
  "CQC readiness and assurance",
  "independent investigations and review",
  "business governance and operating systems",
  "AI receptionist and missed-call capture",
  "website build and managed web services",
  "veteran employment and transferable skills",
  "family evidence preparation and structured review"
] as const;

export const seoReleaseGate = {
  passRequires: [
    "indexable intent confirmed",
    "unique title and description",
    "one clear H1",
    "canonical URL",
    "structured internal links",
    "appropriate structured data",
    "OG/social metadata",
    "image alt coverage where relevant",
    "commercial CTA aligned to the offer",
    "no unsupported claims",
    "sitemap inclusion where public",
    "mobile and accessibility checks"
  ],
  failureState: "SEO_DISCOVERY_INCOMPLETE"
} as const;
