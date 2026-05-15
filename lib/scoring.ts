// House Buyer Dan — two-stage lead scoring.
// Stage 1 (contact captured) fires `LeadEarly` (track-only).
// Stage 2 (deep qualification) fires `Lead` (Meta optimization event)
//   with weighted value, OR `LeadLowIntent` if score is too low / soft-fail.

export type Stage1Data = {
  address: string
  state?: string
  county?: string
  city?: string
  isLegalOwner: string  // yes-owner | yes-family | no
  listedOnMarket: string  // not-listed | listed-realtor | listed-fsbo
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type Stage2Data = {
  propertyType: string  // single-family | multi-family | condo-townhouse | mobile-home | land | other
  ownershipLength: string  // 1-3-years | 3-5-years | 5-10-years | 10-plus-years
  timeline: string  // asap | 2-weeks | 30-days | 60-days | flexible
  condition: string  // distressed | poor | fair | good | excellent
  reason: string  // foreclosure | behind-payments | inherited | divorce | relocation | downsizing | repairs | other
}

// --- Score weights (REI Transfer playbook v1) ---
const SCORE_TIMELINE: Record<string, number> = {
  'asap': 3, '2-weeks': 2, '30-days': 1, '60-days': 0, 'flexible': 0,
}

const SCORE_OWNERSHIP: Record<string, number> = {
  '10-plus-years': 3, '5-10-years': 1, '3-5-years': 0, '1-3-years': 0,
}

const SCORE_REASON: Record<string, number> = {
  'foreclosure': 3, 'behind-payments': 3,
  'inherited': 2, 'repairs': 2,
  'other': 1,
  'relocation': 0, 'divorce': 0, 'downsizing': 0,
}

const SCORE_CONDITION: Record<string, number> = {
  'poor': 1, 'distressed': 1,
  'fair': 0, 'good': 0, 'excellent': 0,
}

// --- Hard property filter (soft-fail = LeadLowIntent, no Meta optimization) ---
export function isPropertyTypeAccepted(propertyType: string): boolean {
  return propertyType === 'single-family' || propertyType === 'multi-family'
}

// --- Score calculator (0–10) ---
export function calculateLeadScore(d: Stage2Data): number {
  return (SCORE_TIMELINE[d.timeline] || 0)
       + (SCORE_OWNERSHIP[d.ownershipLength] || 0)
       + (SCORE_REASON[d.reason] || 0)
       + (SCORE_CONDITION[d.condition] || 0)
}

// --- Quality tier ---
export type LeadQuality = 'premium' | 'standard' | 'low' | 'soft-fail'

export function getLeadQuality(d: Stage2Data): LeadQuality {
  if (!isPropertyTypeAccepted(d.propertyType)) return 'soft-fail'
  const score = calculateLeadScore(d)
  if (score >= 6) return 'premium'
  if (score >= 3) return 'standard'
  return 'low'
}

// --- Meta event mapping. Keeps HBD's score × $25 model. ---
export function getMetaEventConfig(d: Stage2Data): {
  eventName: 'Lead' | 'LeadLowIntent'
  value: number
  quality: LeadQuality
  qualified: boolean
} {
  const quality = getLeadQuality(d)
  const score = calculateLeadScore(d)
  if (quality === 'soft-fail') {
    return { eventName: 'LeadLowIntent', value: 0, quality, qualified: false }
  }
  return { eventName: 'Lead', value: score * 25, quality, qualified: true }
}

// Helper: deterministic event_id for Meta dedup (Pixel + CAPI must match)
export function makeEventId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}
