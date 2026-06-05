"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Home,
  Building2,
  Building,
  Truck,
  Map as MapIcon,
  HelpCircle,
  ShieldCheck,
  Tag,
  Zap,
  CalendarClock,
  CalendarDays,
  Hourglass,
  Sprout,
  TreePine,
  Anchor,
  TrendingUp,
  Crown,
  Shrink,
  Plane,
  Gift,
  KeyRound,
  Hammer,
  AlertTriangle,
  Split,
  ChevronRight,
} from "lucide-react"
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
 * Every choice button carries a Lucide icon for visual hit-target reinforcement.
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

type Choice = { id: string; label: string; icon: LucideIcon }

const PROPERTY_TYPES: Choice[] = [
  { id: "single-family", label: "Single Family Home", icon: Home },
  { id: "multi-family",  label: "Multi-Family / Duplex", icon: Building2 },
  { id: "condo",         label: "Condo / Townhouse", icon: Building },
  { id: "mobile-home",   label: "Mobile / Manufactured Home", icon: Truck },
  { id: "land",          label: "Vacant Land", icon: MapIcon },
  { id: "other",         label: "Other", icon: HelpCircle },
]

const LISTED_OPTIONS: Choice[] = [
  { id: "no",  label: "No, it's not listed",  icon: ShieldCheck },
  { id: "yes", label: "Yes, it's listed",     icon: Tag },
]

const TIMELINE_OPTIONS: Choice[] = [
  { id: "asap",      label: "ASAP (within 30 days)",         icon: Zap },
  { id: "3-months",  label: "Within 3 months",               icon: CalendarClock },
  { id: "6-months",  label: "Within 6 months",               icon: CalendarDays },
  { id: "later",     label: "6+ months / Just exploring",    icon: Hourglass },
]

const YEARS_OWNED_OPTIONS: Choice[] = [
  { id: "0-2",   label: "Less than 2 years",      icon: Sprout },
  { id: "3-5",   label: "3 to 5 years",           icon: TreePine },
  { id: "6-10",  label: "6 to 10 years",          icon: Anchor },
  { id: "11-20", label: "11 to 20 years",         icon: TrendingUp },
  { id: "20+",   label: "More than 20 years",     icon: Crown },
]

const REASON_OPTIONS: Choice[] = [
  { id: "downsize",    label: "Downsizing / Empty Nest",   icon: Shrink },
  { id: "relocation",  label: "Relocating",                icon: Plane },
  { id: "inheritance", label: "Inherited / Probate",       icon: Gift },
  { id: "landlord",    label: "Tired Landlord",            icon: KeyRound },
  { id: "repairs",     label: "Too Many Repairs",          icon: Hammer },
  { id: "foreclosure", label: "Behind on Payments",        icon: AlertTriangle },
  { id: "divorce",     label: "Divorce",                   icon: Split },
  { id: "other",       label: "Other",                     icon: HelpCircle },
]

// -------- module-level UI primitives --------
// IMPORTANT: keep these OUTSIDE the form component. Defining them inside
// `ZeroDistractionForm` created a new component type on every render, which
// caused React 19 to unmount/remount every choice button on each state
// change and swallow tap events on mobile.

function ChoiceButton({
  choice, selected, accentColor, onClick,
}: { choice: Choice; selected?: boolean; accentColor: string; onClick: () => void }) {
  const Icon = choice.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full min-h-14 rounded-xl border-2 px-4 py-3 text-base md:text-lg font-medium text-left transition-all active:scale-[0.98] flex items-center gap-3"
      style={{
        borderColor: selected ? accentColor : "#e5e7eb",
        backgroundColor: selected ? `${accentColor}0D` : "#ffffff",
        color: selected ? accentColor : "#111827",
      }}
    >
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: selected ? `${accentColor}1A` : "#f3f4f6",
          color: selected ? accentColor : "#4b5563",
        }}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="flex-1">{choice.label}</span>
      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
    </button>
  )
}

function NextButton({
  disabled, onClick, accentColor, label = "Next",
}: { disabled?: boolean; onClick: () => void; accentColor: string; label?: string }) {
  return (
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
}

function StepHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center md:text-left">
      {children}
    </h2>
  )
}

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

  // Hard-DQ on property type — soft-flag for n8n routing.
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

  // -------- step renders (primitives defined at module level above) --------

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
            {PROPERTY_TYPES.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor}
                choice={c}
                selected={form.propertyType === c.id}
                onClick={() => {
                  if (isPropertyDisqualified(c.id)) {
                    update("propertyType", c.id)
                  }
                  pickAndAdvance("propertyType", c.id)
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
            {LISTED_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.listedOnMarket === c.id} onClick={() => pickAndAdvance("listedOnMarket", c.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Timeline to sell */}
      {step === 3 && (
        <div>
          <StepHeader>How soon would you like to sell?</StepHeader>
          <div className="space-y-3">
            {TIMELINE_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.timeline === c.id} onClick={() => pickAndAdvance("timeline", c.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 4 — Years owned */}
      {step === 4 && (
        <div>
          <StepHeader>How long have you owned the property?</StepHeader>
          <div className="space-y-3">
            {YEARS_OWNED_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.yearsOwned === c.id} onClick={() => pickAndAdvance("yearsOwned", c.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 5 — Reason for selling */}
      {step === 5 && (
        <div>
          <StepHeader>What&apos;s the main reason for selling?</StepHeader>
          <div className="space-y-3">
            {REASON_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.reason === c.id} onClick={() => pickAndAdvance("reason", c.id)} />
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
              accentColor={accentColor}
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

      {/* Back link — except on step 1 and step 7 */}
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
