/**
 * Dynamic headline router — server-side scent matching.
 *
 * Reads the `utm_content` (= ad.name per the locked URL params convention)
 * and returns a matched { h1, sub } from the override table — or null if no
 * match. Falls back to client default in the calling page.
 *
 * Contract: ~/.claude/projects/-Users-williamyu/memory/feedback_ad-name-scent-contract.md
 * Ad naming: {ConceptCode}-{ConceptName}-{CopyVariant}-{Geo}
 *
 * Real-world Meta ad names are human-readable and contain spaces and parens
 * (e.g. "OC Senior v2 A1 A1-CashRush-PASv1-OC (v3 LP)"). We split on
 * whitespace and test each token against each override regex, so a scent-key
 * token anywhere in the ad name still matches its entry.
 *
 * Safety guards:
 * - 120 char length cap before parsing
 * - Whitelist [A-Za-z0-9 _\-().+] only (XSS guard — h1 string never includes raw UTM)
 * - Case-insensitive match (each override regex carries the /i flag)
 * - Returns null on any malformed input (calling page falls back to default)
 * - Pure function, no network calls, no side effects
 */

import { HEADLINE_OVERRIDES, type HeadlineOverride } from "./headline-overrides"

const MAX_UTM_LENGTH = 120
// Allow letters, digits, spaces, hyphens, underscores, parens, periods, plus.
// Covers every realistic Meta ad name. Override H1/sub are static literals —
// the UTM string itself is never interpolated into the rendered HTML.
const UTM_WHITELIST = /^[A-Za-z0-9 _\-().+]+$/

export type MatchedHeadline = {
  h1: string
  sub: string
  matchedConceptCode: string | null
}

export function getHeadlineForUtm(utmContent?: string | null): MatchedHeadline | null {
  if (!utmContent) return null
  if (typeof utmContent !== "string") return null
  if (utmContent.length > MAX_UTM_LENGTH) return null
  if (!UTM_WHITELIST.test(utmContent)) return null

  // Token-based matching: each whitespace-delimited token is tested against
  // each override regex. Lets "OC Senior v2 A1 A1-CashRush-PASv1-OC" hit the
  // /^A1-CashRush-/ pattern via the embedded scent-key token.
  const tokens = utmContent.split(/\s+/).filter(Boolean)

  for (const entry of HEADLINE_OVERRIDES) {
    for (const tok of tokens) {
      if (entry.match.test(tok)) {
        return {
          h1: entry.h1,
          sub: entry.sub,
          matchedConceptCode: extractConceptCode(tok),
        }
      }
    }
  }

  return null
}

/**
 * Parse the ConceptCode (first segment) out of a token. Returns null if the
 * token doesn't start with {Letter}{Digits}-.
 *
 * Useful for logging / analytics — NOT for rendering. Never put this string
 * into the page.
 */
export function extractConceptCode(token: string): string | null {
  const m = token.match(/^([A-Z]\d+)-/i)
  return m ? m[1].toUpperCase() : null
}

// Re-export the override type for callers that want to type-check tables
export type { HeadlineOverride }
