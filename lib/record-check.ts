// Server only. Property-record check for posts from the new form
// (components/v2/record-survey-card.tsx, on only when NEXT_PUBLIC_RECORD_FORM is set).
// Same logic as the template's submit route (reit-landing-themes app/api/submit), kept in
// its own file so this site's submit route stays as it was: a post without
// record_check: true comes back untouched and is forwarded exactly as before.
import { scoreFor } from "@/lib/lead-score"
import { lookupProperty, withPriority, applyConditionRule, legacyAnswers, recordUsable, questionsToAsk, parseUsAddress, type LookupInput, type LookupResult } from "@/lib/dealmachine"
import { sellerAnswerRule } from "@/lib/form-rules"

export interface RecordStep {
  /** What the route forwards (n8n payload and GoFunnel), record fields added. */
  data: Record<string, unknown>
  /** One-step version: a seller screened out at the end is not sent anywhere (as today). */
  skipWebhook: boolean
  /** Screened out (by an answer or the record): never forwarded to GoFunnel. */
  skipGoFunnel: boolean
  /** Extra fields the new form reads from the response. */
  response: Record<string, unknown>
}

// Low equity (20-29%) fires LeadLowIntent (William 2026-11-17).
const META_EVENT_FOR: Record<string, string> = { lead: "Lead", low_equity: "LeadLowIntent", low_intent: "LeadLowIntent" }

// "123 Main St, Austin, TX 78701, USA" → "123 Main St"
const streetOf = (address: string) => (address || "").split(",")[0].trim()

// Property record fields for n8n. Neutral names: a client webhook that receives the
// whole payload must not learn the data vendor.
function dmFields(dm: LookupResult, priority: string, reasonDetails: string) {
  return {
    record_found: dm.matched,
    record_equity_pct: dm.equity_pct ?? "",
    record_equity_band: dm.equity_band,
    record_value: dm.value ?? "",
    record_owed: dm.owed ?? "",
    record_verdict: dm.verdict,
    record_dq_reason: dm.dq_reason ?? "",
    record_listed_now: dm.listed_now,
    record_owner_match: dm.owner_match ?? "",
    record_distress: dm.distress.join("; "),
    record_excellent_bypass: dm.excellent_bypass === true,
    property_summary: withPriority(dm.summary, priority, reasonDetails),
    lookup_credits: dm.credits_used,
  }
}

const text = (v: unknown) => (typeof v === "string" ? v : "")

export async function recordStep(data: Record<string, unknown>): Promise<RecordStep> {
  if (data.record_check !== true) return { data, skipWebhook: false, skipGoFunnel: false, response: {} }

  // Two-step version: lead_stage early (contact details), complete, disqualified (an
  // answer screened the seller out after the early post). One-step: one post at the end.
  const stage: "early" | "complete" | "disqualified" =
    data.lead_stage === "early" ? "early" : data.lead_stage === "disqualified" ? "disqualified" : "complete"
  const oneStep = data.record_mode === "one-step"
  const payload: Record<string, unknown> = { ...data }
  delete payload.record_check
  delete payload.record_mode
  delete payload.dm_scenario
  if (data.lead_stage !== undefined) payload.lead_stage = stage

  if (stage === "disqualified") {
    return { data: clientFields(payload), skipWebhook: oneStep, skipGoFunnel: true, response: {} }
  }

  // City / state / ZIP come from the address picker; when blank, read them from the address text.
  const parsed = parseUsAddress(text(data.address))
  const input: LookupInput = {
    street: streetOf(text(data.address)), city: text(data.city) || parsed.city, state: text(data.state) || parsed.state,
    zip: text(data.zip) || parsed.zip, lastName: text(data.lastName),
  }
  for (const k of ["city", "state", "zip"] as const) {
    if (!text(data[k]).trim() && parsed[k]) payload[k] = parsed[k]
  }
  const landOwned = text(data.landOwned)
  let dm = await lookupProperty(input, { landOwned })
  dm = applyConditionRule(dm, text(data.condition))
  // The seller's own answers, by this client's rules (lib/form-rules.ts).
  if (stage === "complete" && (dm.verdict === "lead" || dm.verdict === "low_equity")) {
    const own = sellerAnswerRule(data, recordUsable(dm))
    if (own.rule === "low_intent") dm = { ...dm, verdict: "low_intent" }
    else if (own.rule === "dq") dm = { ...dm, verdict: "dq", dq_reason: null }
  }
  const excellentOut = dm.dq_reason === "excellentCondition"
  Object.assign(payload, dmFields(dm, text(data.priority), text(data.reasonDetails)))
  // Same fields, same format: fill the old answer fields the seller wasn't asked, from the record.
  if (dm.matched) {
    for (const [k, v] of Object.entries(legacyAnswers(dm))) {
      if (v && !text(data[k]).trim()) payload[k] = v
    }
  }

  if (stage === "early" && (excellentOut || dm.verdict === "dq")) {
    // Screened out right after the contact screen (Excellent with nothing on record) or by the
    // record already (listed, property type, equity): tracker only, never the client CRM.
    Object.assign(payload, {
      lead_stage: "disqualified", qualified: false, disqualify_reason: excellentOut ? "excellent_condition" : dm.dq_reason,
      meta_event_name: "", meta_value: 0, stage1_event_id: data.meta_event_id,
    })
  } else if (stage === "complete" && dm.verdict === "dq") {
    Object.assign(payload, {
      lead_stage: "disqualified", qualified: false, disqualify_reason: dm.dq_reason,
      meta_event_name: "", meta_value: 0,
    })
  } else if (stage === "complete" && META_EVENT_FOR[dm.verdict]) {
    Object.assign(payload, {
      qualified: dm.verdict === "lead",
      meta_event_name: META_EVENT_FOR[dm.verdict],
      meta_value: dm.verdict === "lead" ? payload.meta_value : 0,
    })
  }

  // Re-score after the record filled the answers the seller was not asked: this site's /v3
  // scoring (lib/lead-scoring.ts), with the same fields the /v3 form sends.
  const sc = scoreFor({
    propertyType: text(payload.propertyType), isLegalOwner: text(payload.isLegalOwner), listedOnMarket: text(payload.listedOnMarket),
    timeline: text(payload.timeline), ownershipLength: text(payload.ownershipLength), reason: text(payload.reason), condition: text(payload.condition),
  })
  payload.lead_score = sc.lead_score
  payload.lead_quality = sc.lead_quality
  if (stage === "complete") {
    payload.lead_meta_value = sc.meta_value
    payload.lead_score_breakdown = sc.breakdown
    // The /v3 form sends meta_value = its lead value on every finished lead.
    payload.meta_value = payload.lead_stage === "disqualified" ? 0 : sc.meta_value
  }

  const dmDq = dm.verdict === "dq"
  const response = stage === "early"
    ? { matched: recordUsable(dm), is_mobile: dm.is_mobile, ask: questionsToAsk(dm), screened_out: excellentOut, excellent_bypass: dm.excellent_bypass === true }
    : { verdict: dm.verdict, dq_reason: dm.dq_reason, lead_score: payload.lead_score }
  return {
    data: clientFields(payload),
    skipWebhook: oneStep && (dmDq || payload.lead_stage === "disqualified"),
    skipGoFunnel: dmDq,
    response,
  }
}

// The /v3 zero-distraction form's own field names (components/survey/zero-distraction-form.tsx),
// filled from the final answers (the record may have filled some), so n8n and the CRM get
// exactly the fields they get today. Early posts carry only what the /v3 early post carries.
const OWNER_OK = ["owner", "part-owner", "family"]
function clientFields(p: Record<string, unknown>): Record<string, unknown> {
  const s = (k: string) => text(p[k])
  p.name = s("name").trim() || `${s("firstName").trim()} ${s("lastName").trim()}`.trim()
  p.first_name = s("firstName")
  p.last_name = s("lastName")
  // The /v3 form sends no "source".
  delete p.source
  if (p.lead_stage === "early") return p
  const who = s("isLegalOwner")
  Object.assign(p, {
    property_type: s("propertyType"),
    who_are_you: who,
    listed_on_market: s("listedOnMarket"),
    timeline: s("timeline"),
    years_owned: s("ownershipLength"),
    event_id: p.meta_event_id ?? "",
  })
  // The /v3 form sends isLegalOwner as yes / no (owner, part owner or family = yes).
  if (who) p.isLegalOwner = OWNER_OK.includes(who) ? "yes" : "no"
  return p
}
