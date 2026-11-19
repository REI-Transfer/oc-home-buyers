// Lead scoring for the property-record form: this site's /v3 scoring, lib/lead-scoring.ts
// (scoreLead), used as is, so the new form and the submit route give the same lead_score /
// lead_quality / value as the /v3 form for the same answers. isLegalOwner holds the
// "who are you" answer and ownershipLength the years owned (lib/form-rules.ts "zdf").
import { scoreLead, type ScoreResult } from "@/lib/lead-scoring"

export interface ScoreInput {
  propertyType?: string
  isLegalOwner?: string
  listedOnMarket?: string
  timeline?: string
  ownershipLength?: string
  reason?: string
  condition?: string
}
export function scoreFor(d: ScoreInput): ScoreResult {
  return scoreLead({
    propertyType: d.propertyType ?? "",
    whoAreYou: d.isLegalOwner ?? "",
    listedOnMarket: d.listedOnMarket ?? "",
    timeline: d.timeline ?? "",
    yearsOwned: d.ownershipLength ?? "",
    reason: d.reason ?? "",
    condition: d.condition ?? "",
  })
}
export function calculateLeadScore(d: ScoreInput): number {
  return scoreFor(d).lead_score
}
// HOT / WARM / STANDARD / LOW, as the /v3 form sends it.
export function leadQuality(score: number): string {
  return score >= 85 ? "HOT" : score >= 60 ? "WARM" : score >= 35 ? "STANDARD" : "LOW"
}
// The /v3 form's Meta value for a score (lead_meta_value): 150 / 100 / 50 / 10.
export function leadValue(score: number): number {
  return score >= 85 ? 150 : score >= 60 ? 100 : score >= 35 ? 50 : 10
}
// Unused here (kept for components/v2/survey-card-shared.tsx).
export const SCORE_TIMELINE: Record<string, number> = {}
export const SCORE_OWNERSHIP: Record<string, number> = {}
export const SCORE_REASON: Record<string, number> = {}
export const SCORE_CONDITION: Record<string, number> = {}
