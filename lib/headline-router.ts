/**
 * Dynamic headline router — server-side scent matching.
 *
 * Reads the `utm_content` (= ad.name per the locked URL params convention)
 * and returns a matched { h1, sub } from the override table — or null if no
 * match. Falls back to client default in app/v2/page.tsx.
 *
 * Contract: ~/.claude/projects/-Users-williamyu/memory/feedback_ad-name-scent-contract.md
 * Ad naming: {ConceptCode}-{ConceptName}-{CopyVariant}-{Geo}
 *
 * Safety guards:
 * - 100 char length cap before parsing
 * - Whitelist [A-Za-z0-9_-] only (XSS guard — h1 string never includes raw UTM)
 * - Case-insensitive match (lowercase normalization on input)
 * - Returns null on any malformed input (calling page falls back to default)
 * - Pure function, no network calls, no side effects
 */

import { HEADLINE_OVERRIDES, type HeadlineOverride } from "./headline-overrides"

const MAX_UTM_LENGTH = 100
const UTM_WHITELIST = /^[A-Za-z0-9_-]+$/

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

  // Match against each override entry in array order (most-specific patterns
  // belong first in the array; ConceptCode-only patterns belong last).
  for (const entry of HEADLINE_OVERRIDES) {
    if (entry.match.test(utmContent)) {
      return {
        h1: entry.h1,
        sub: entry.sub,
        matchedConceptCode: extractConceptCode(utmContent),
      }
    }
  }

  return null
}

/**
 * Parse the ConceptCode (first segment) out of an ad name. Returns null if the
 * name doesn't start with {Letter}{Digits}-.
 *
 * Useful for logging / analytics — NOT for rendering. Never put this string
 * into the page.
 */
export function extractConceptCode(utmContent: string): string | null {
  const m = utmContent.match(/^([A-Z]\d+)-/i)
  return m ? m[1].toUpperCase() : null
}

// Re-export the override type for callers that want to type-check tables
export type { HeadlineOverride }
