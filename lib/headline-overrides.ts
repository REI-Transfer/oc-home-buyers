/**
 * OC HomeBuyers — Orange County, CA
 * Dynamic-headline override table for /v2 landing page.
 *
 * Each entry's `match` regex is tested against the sanitized `utm_content`
 * (= ad.name per locked URL params convention). First match wins, so put
 * MORE SPECIFIC patterns first (e.g., ConceptCode + Geo before ConceptCode-only).
 *
 * Naming contract: {ConceptCode}-{ConceptName}-{CopyVariant}-{Geo}
 * Full rules: ~/.claude/projects/-Users-williamyu/memory/feedback_ad-name-scent-contract.md
 *
 * B (Mailroom) was retired 2026-05-31, then RE-ACTIVATED 2026-06-06 for the
 * OC senior DNA /v3 test. New B entries are OK again — see the Mailroom
 * section below.
 *
 * When a new ConceptCode ships in this client's Meta account:
 *   1. Add the override row here FIRST
 *   2. Deploy + verify on Vercel preview
 *   3. THEN activate the Meta ad
 *
 * To test a row manually:
 *   curl -sL "https://offer.ochomebuyers.com/v2?utm_content=A1-CashRush-PASv1-OC" | grep "<h1"
 */

export type HeadlineOverride = {
  match: RegExp
  h1: string
  sub: string
}

export const HEADLINE_OVERRIDES: HeadlineOverride[] = [
  // ====================================================================
  // TabHook family (Template A) — was "Editorial" before 2026-05-31 rename
  // 6 angles: CashRush, Pre2000Inspect, RepairCost10K, 55EquityRecord,
  // SalesFallApart, VacantHouse
  // ====================================================================

  // A1 — CashRush
  {
    match: /^A1-CashRush-/i,
    h1: "Lock In Your Cash Offer Before The California Market Cools",
    sub: "Orange County homeowners 55+ are getting cash in 24 hours. Same price at closing.",
  },

  // A2 — Pre2000Inspect
  {
    match: /^A2-Pre2000Inspect-/i,
    h1: "Skip The Inspection. We Buy Pre-2000 Houses As-Is.",
    sub: "Built before 2000? Doesn't have to pass anything. Cash offer in 24 hours.",
  },

  // A3 — RepairCost10K
  {
    match: /^A3-RepairCost10K-/i,
    h1: "Don't Pay The $10,400 Repair Bill. Walk Away With Cash.",
    sub: "Average repair cost just hit $10,400. We buy as-is. You pick the date.",
  },

  // A4 — 55EquityRecord
  {
    match: /^A4-55EquityRecord-/i,
    h1: "Sitting On Record Equity? See What Your Orange County Home Is Actually Worth.",
    sub: "Most OC owners 55+ don't know their real number. Free cash offer in 24 hours.",
  },

  // A5 — SalesFallApart
  {
    match: /^A5-SalesFallApart-/i,
    h1: "1 In 4 California Home Sales Fall Apart. Ours Don't.",
    sub: "Orange County sellers 55+ are skipping the listing process. 14-day cash close.",
  },

  // A6 — VacantHouse
  {
    match: /^A6-VacantHouse-/i,
    h1: "Vacant House In Orange County? We'll Buy It In 14 Days.",
    sub: "Long-term OC owners 45+ are getting cash without lifting a finger.",
  },

  // ====================================================================
  // Mailroom family (Template B) — RE-ACTIVATED 2026-06-06 for OC senior DNA
  // v3 test. Was retired 2026-05-31, brought back for the B4 PropertyTaxBill
  // angle running on /v3 (Pathway-style LP) targeting 55+ homeowners.
  // ====================================================================

  // B4 — PropertyTaxBill (OC Senior v2 / v3 LP)
  // Trailing dash is OPTIONAL — current Meta ad ships token "B4-Mailroom-PropertyTaxBill"
  // with no Geo suffix. Matches both that token and the full canonical form.
  {
    match: /^B4-Mailroom-PropertyTaxBill(?:-|$)/i,
    h1: "Worried About Your Next Orange County Property Tax Bill?",
    sub: "Orange County homeowners are getting cash in 24 hours and locking in their number before the next bill hits. As-is, 14-day close.",
  },

  // ====================================================================
  // Tap-Range family (Template C) — interactive year-built / years-owned
  // qualifiers. Pulls long-built, long-owned Orange County homes into cash close.
  // ====================================================================

  // C1 — YearBuilt (Pre-2014 OC homes qualifier)
  {
    match: /^C1-YearBuilt-/i,
    h1: "Pre-2014 OC Home? See What It's Actually Worth.",
    sub: "Long-built Orange County homes are sitting on record equity. 14-day cash close, no repairs.",
  },

  // C2 — YearsOwned (long-term ownership qualifier)
  {
    match: /^C2-YearsOwned-/i,
    h1: "Owned Your Orange County Home 10+ Years? See Your Number Today.",
    sub: "Long-term OC owners are sitting on the strongest equity in years. As-is, 14-day cash close.",
  },

  // C3 — TBD when concept is finalized

  // ====================================================================
  // Poll Card family (Template D) — Yes/No commitment, listing vs cash
  // ====================================================================

  // D1 — TBD when concept is finalized

  // D2 — AgentVsCash (60-day listing vs 14-day cash poll)
  {
    match: /^D2-AgentVsCash-/i,
    h1: "Would You Rather Wait 60 Days Or Get Cash In 14?",
    sub: "Most Orange County owners 45+ are skipping the listing. Same price at closing, no commissions.",
  },
]

/**
 * Default H1/sub for visitors who arrive WITHOUT a matching utm_content
 * (organic traffic, FB Messenger strip, link forwarders, bookmarks,
 * brand-new ConceptCodes that haven't been mapped yet).
 *
 * This is the floor for ~30% of paid traffic. Keep it strong.
 */
export const DEFAULT_HEADLINE = {
  h1: "Sell Your Orange County House For Cash. In 24 Hours.",
  sub: "Fair cash offers, no fees, no commissions. Family owned, locally operated.",
}
