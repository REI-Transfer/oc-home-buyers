"use client"

import { useState } from "react"
import { AddressAutocomplete, type AddressDetails } from "@/components/survey/address-autocomplete"

/**
 * Zero-distraction multi-step form.
 * Pathway-pattern: qualifying questions FIRST, contact info LAST.
 *
 * Steps:
 *   1. Property type
 *   2. Listed on the market?
 *   3. Timeline to sell
 *   4. How long have you owned it?  (William directive 2026-06-05)
 *   5. Reason for selling
 *   6. Property address
 *   7. Contact info → submit
 *
 * Mobile-first. Every choice button is a full-width 56px tap target.
 * Submit posts to the existing /api/submit route (no GHL/n8n changes).
 */

type Props = {
  accentColor: string
  serviceAreas: Array<{ id: string; centerLat: number; centerLng: number; radiusMiles: number }>
  disqualifiedPropertyTypes: string[]
}

type FormState = {
  propertyType: string
  listedOnMarket: string
  timeline: string
  yearsOwned: string
  reason: string
  address: string
  addressDetails: AddressDetails | null
  firstName: string
  lastName: string
  email: string
  phone: string
}

const PROPERTY_TYPES = [
  { id: "single-family", label: "Single Family Home" },
  { id: "multi-family", label: "Multi-Family / Duplex" },
  { id: "condo", label: "Condo / Townhouse" },
  { id: "mobile-home", label: "Mobile / Manufactured Home" },
  { id: "land", label: "Vacant Land" },
  { id: "other", label: "Other" },
]

const TIMELINE_OPTIONS = [
  { id: "asap", label: "ASAP (within 30 days)" },
  { id: "3-months", label: "Within 3 months" },
  { id: "6-months", label: "Within 6 months" },
  { id: "later", label: "6+ months / Just exploring" },
]

const YEARS_OWNED_OPTIONS = [
  { id: "0-2", label: "Less than 2 years" },
  { id: "3-5", label: "3 to 5 years" },
  { id: "6-10", label: "6 to 10 years" },
  { id: "11-20", label: "11 to 20 years" },
  { id: "20+", label: "More than 20 years" },
]

const REASON_OPTIONS = [
  { id: "downsize", label: "Downsizing / Empty Nest" },
  { id: "relocation", label: "Relocating" },
  { id: "inheritance", label: "Inherited / Probate" },
  { id: "landlord", label: "Tired Landlord" },
  { id: "repairs", label: "Too Many Repairs" },
  { id: "foreclosure", label: "Behind on Payments" },
  { id: "divorce", label: "Divorce" },
  { id: "other", label: "Other" },
]

export function ZeroDistractionForm({ accentColor, serviceAreas, disqualifiedPropertyTypes }: Props) {
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 7
  const [outsideAreaError, setOutsideAreaError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [form, setForm] = useState<FormState>({
    propertyType: "",
    listedOnMarket: "",
    timeline: "",
    yearsOwned: "",
    reason: "",
    address: "",
    addressDetails: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Auto-advance after a choice picked — keeps the page feeling fast on mobile.
  const pickAndAdvance = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setTimeout(() => setStep(s => Math.min(s + 1, TOTAL_STEPS)), 150)
  }

  // Hard-DQ on property type — stop them before they fill anything else.
  const isPropertyDisqualified = (typeId: string) => disqualifiedPropertyTypes.includes(typeId)

  // Address-level service area check — same logic as /v2.
  const isInServiceArea = (details: AddressDetails): boolean => {
    if (serviceAreas.length === 0) return true
    if (!details.lat || !details.lng) return true
    return serviceAreas.some(area => {
      const dLat = (details.lat! - area.centerLat) * Math.PI / 180
      const dLng = (details.lng! - area.centerLng) * Math.PI / 180
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(area.centerLat * Math.PI / 180) *
        Math.cos(details.lat! * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return 3959 * c <= area.radiusMiles  // miles
    })
  }

  const handleAddressSelect = (address: string, details: AddressDetails) => {
    if (!isInServiceArea(details)) {
      setOutsideAreaError(true)
      return
    }
    setOutsideAreaError(false)
    setForm(prev => ({ ...prev, address, addressDetails: details }))
    setStep(s => s + 1)
  }

  const submit = async () => {
    setSubmitting(true)
    setSubmitError("")
    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        property_type: form.propertyType,
        listed_on_market: form.listedOnMarket,
        timeline: form.timeline,
        years_owned: form.yearsOwned,
        reason: form.reason,
        lead_stage: 'complete',
        funnel_variant: 'v3-zero-distraction',
      }
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Submission failed")
      }
      window.location.href = "/thank-you"
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  // -------- shared UI primitives --------

  const ChoiceButton = ({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-14 rounded-xl border-2 px-4 py-3 text-base md:text-lg font-medium text-left transition-all active:scale-[0.98]"
      style={{
        borderColor: selected ? accentColor : "#e5e7eb",
        backgroundColor: selected ? `${accentColor}0D` : "#ffffff",
        color: selected ? accentColor : "#111827",
      }}
    >
      {label}
    </button>
  )

  const NextButton = ({ disabled, onClick, label = "Next" }: { disabled?: boolean; onClick: () => void; label?: string }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full h-14 md:h-16 rounded-xl text-white font-semibold text-lg md:text-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ backgroundColor: accentColor }}
    >
      {label}
    </button>
  )

  const StepHeader = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center md:text-left">
      {children}
    </h2>
  )

  // -------- step renders --------

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 md:p-8">
      {/* Progress strip */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">Step {step} of {TOTAL_STEPS}</span>
          <span className="text-xs font-medium" style={{ color: accentColor }}>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Step 1 — Property Type */}
      {step === 1 && (
        <div>
          <StepHeader>What type of property is it?</StepHeader>
          <div className="space-y-3">
            {PROPERTY_TYPES.map(opt => (
              <ChoiceButton
                key={opt.id}
                label={opt.label}
                selected={form.propertyType === opt.id}
                onClick={() => {
                  if (isPropertyDisqualified(opt.id)) {
                    update("propertyType", opt.id)
                    // Soft-DQ: still let them through but tagged for n8n routing
                  }
                  pickAndAdvance("propertyType", opt.id)
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Listed on Market */}
      {step === 2 && (
        <div>
          <StepHeader>Is your home currently listed with a realtor?</StepHeader>
          <div className="space-y-3">
            <ChoiceButton label="No, it's not listed" selected={form.listedOnMarket === "no"} onClick={() => pickAndAdvance("listedOnMarket", "no")} />
            <ChoiceButton label="Yes, it's listed" selected={form.listedOnMarket === "yes"} onClick={() => pickAndAdvance("listedOnMarket", "yes")} />
          </div>
        </div>
      )}

      {/* Step 3 — Timeline to sell */}
      {step === 3 && (
        <div>
          <StepHeader>How soon would you like to sell?</StepHeader>
          <div className="space-y-3">
            {TIMELINE_OPTIONS.map(opt => (
              <ChoiceButton key={opt.id} label={opt.label} selected={form.timeline === opt.id} onClick={() => pickAndAdvance("timeline", opt.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 4 — Years owned (William's addition) */}
      {step === 4 && (
        <div>
          <StepHeader>How long have you owned the property?</StepHeader>
          <div className="space-y-3">
            {YEARS_OWNED_OPTIONS.map(opt => (
              <ChoiceButton key={opt.id} label={opt.label} selected={form.yearsOwned === opt.id} onClick={() => pickAndAdvance("yearsOwned", opt.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 5 — Reason for selling */}
      {step === 5 && (
        <div>
          <StepHeader>What&apos;s the main reason for selling?</StepHeader>
          <div className="space-y-3">
            {REASON_OPTIONS.map(opt => (
              <ChoiceButton key={opt.id} label={opt.label} selected={form.reason === opt.id} onClick={() => pickAndAdvance("reason", opt.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 6 — Address */}
      {step === 6 && (
        <div>
          <StepHeader>What&apos;s the property address?</StepHeader>
          <div className="space-y-3">
            <AddressAutocomplete
              value={form.address}
              onChange={(v) => { update("address", v); setOutsideAreaError(false) }}
              onSelect={handleAddressSelect}
              placeholder="Start typing your address..."
              className="[&_input]:h-14 [&_input]:text-base [&_input]:rounded-xl [&_input]:border-2 [&_input]:border-gray-200"
            />
            {outsideAreaError && (
              <p className="text-sm text-red-600 text-center">
                We only buy homes in Orange County, California. Please enter a local address.
              </p>
            )}
            <p className="text-xs text-gray-500 text-center">
              We serve all of Orange County, California.
            </p>
          </div>
        </div>
      )}

      {/* Step 7 — Contact info → submit */}
      {step === 7 && (
        <div>
          <StepHeader>Who should we send the offer to?</StepHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                inputMode="text"
                autoComplete="given-name"
                placeholder="First name"
                value={form.firstName}
                onChange={e => update("firstName", e.target.value)}
                className="h-14 px-4 rounded-xl border-2 border-gray-200 text-base focus:outline-none focus:ring-2"
                style={{ ['--tw-ring-color' as string]: accentColor }}
              />
              <input
                type="text"
                inputMode="text"
                autoComplete="family-name"
                placeholder="Last name"
                value={form.lastName}
                onChange={e => update("lastName", e.target.value)}
                className="h-14 px-4 rounded-xl border-2 border-gray-200 text-base focus:outline-none focus:ring-2"
              />
            </div>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => update("email", e.target.value)}
              className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 text-base focus:outline-none focus:ring-2"
            />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={e => update("phone", e.target.value)}
              className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 text-base focus:outline-none focus:ring-2"
            />
            {submitError && (
              <p className="text-sm text-red-600 text-center">{submitError}</p>
            )}
            <NextButton
              label={submitting ? "Sending..." : "Get My Cash Offer"}
              disabled={
                submitting ||
                !form.firstName.trim() ||
                !form.lastName.trim() ||
                !form.email.trim() ||
                form.phone.replace(/\D/g, "").length < 10
              }
              onClick={submit}
            />
            <p className="text-xs text-gray-500 text-center px-2">
              By tapping above you agree to be contacted about your offer. No spam. No obligation.
            </p>
          </div>
        </div>
      )}

      {/* Back link — except on step 1 */}
      {step > 1 && step < 7 && (
        <button
          type="button"
          onClick={() => setStep(s => Math.max(s - 1, 1))}
          className="mt-5 w-full text-sm text-gray-500 hover:text-gray-700 text-center"
        >
          ← Back
        </button>
      )}
    </div>
  )
}
