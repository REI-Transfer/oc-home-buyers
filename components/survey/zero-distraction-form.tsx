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
  User,
  Users,
  Heart,
  Briefcase,
  Handshake,
  Sparkles,
  Smile,
  Wrench,
  HardHat,
  DollarSign,
  Phone,
  MessageSquare,
  Eye,
} from "lucide-react"
import { AddressAutocomplete, type AddressDetails, type ServiceArea } from "@/components/survey/address-autocomplete"

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
  serviceAreas: ServiceArea[]
  disqualifiedPropertyTypes: string[]
  phoneHref: string
  phoneDisplay: string
}

// DQ reasons surfaced to the user. Order matters — first match wins on the screen.
const DQ_REASONS = {
  notOwner: "We only work directly with property owners (or co-owners / family with rights to sell).",
  excellent: "Excellent-condition homes do best on the open market through a realtor. We focus on as-is.",
  recentlyBought: "We only buy homes that have been owned for 5+ years.",
  exploring: "Sounds like you're just gathering info right now. When you're ready to sell, we'll be here.",
} as const
type DqKey = keyof typeof DQ_REASONS

type FormState = {
  propertyType: string
  whoAreYou: string
  listedOnMarket: string
  timeline: string
  yearsOwned: string
  reason: string
  condition: string
  askingPrice: number
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

const WHO_ARE_YOU_OPTIONS: Choice[] = [
  { id: "owner",         label: "I'm the owner",                       icon: User },
  { id: "part-owner",    label: "I'm a part owner / co-owner",         icon: Users },
  { id: "family",        label: "Family member with rights to sell",   icon: Heart },
  { id: "agent",         label: "I'm an agent representing the seller", icon: Briefcase },
  { id: "wholesaler",    label: "I'm a wholesaler",                    icon: Handshake },
  { id: "other",         label: "Other",                               icon: HelpCircle },
]

const LISTED_OPTIONS: Choice[] = [
  { id: "no",  label: "No, it's not listed",  icon: ShieldCheck },
  { id: "yes", label: "Yes, it's listed",     icon: Tag },
]

const TIMELINE_OPTIONS: Choice[] = [
  { id: "asap",      label: "ASAP (within 30 days)",  icon: Zap },
  { id: "3-months",  label: "Within 3 months",        icon: CalendarClock },
  { id: "6-months",  label: "Within 6 months",        icon: CalendarDays },
  { id: "6-plus",    label: "6+ months",              icon: Hourglass },
  { id: "exploring", label: "Just exploring",         icon: Eye },
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

// Condition choices include a longer sub-line so users self-select honestly.
type ConditionChoice = { id: string; label: string; sub: string; icon: LucideIcon }
const CONDITION_OPTIONS: ConditionChoice[] = [
  {
    id: "excellent",
    label: "Excellent",
    sub: "2025+ build or recently renovated. Move-in ready.",
    icon: Sparkles,
  },
  {
    id: "good",
    label: "Good",
    sub: "Needs minor TLC. Paint, carpet, small cosmetic fixes.",
    icon: Smile,
  },
  {
    id: "fair",
    label: "Fair",
    sub: "Dated but solid. Needs work to hit current standards.",
    icon: Wrench,
  },
  {
    id: "poor",
    label: "Poor",
    sub: "Won't pass inspection. Major repairs needed.",
    icon: HardHat,
  },
]

// Asking-price slider config.
// Range covers most OC single-family transactions (~$300k inland → $3M coast+).
const PRICE_MIN = 300_000
const PRICE_MAX = 3_000_000
const PRICE_STEP = 25_000
const PRICE_DEFAULT = 800_000

const formatPrice = (n: number): string => {
  if (n >= 1_000_000) {
    const m = (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)
    return `$${m.replace(/\.?0+$/, "")}M`
  }
  return `$${Math.round(n / 1_000).toLocaleString()}k`
}

// Tier label shown next to the price as the slider moves.
const priceTier = (n: number): string => {
  if (n < 500_000)   return "Entry-level OC"
  if (n < 800_000)   return "Inland OC family home"
  if (n < 1_200_000) return "Mid-tier OC"
  if (n < 1_800_000) return "Premium OC"
  if (n < 2_500_000) return "Coastal / luxury"
  return "Ultra-luxury coastal"
}

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

export function ZeroDistractionForm({ accentColor, serviceAreas, disqualifiedPropertyTypes, phoneHref, phoneDisplay }: Props) {
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 10
  const [outsideAreaError, setOutsideAreaError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  // When non-null, the form short-circuits and shows the DQ screen with Call/Text.
  const [dq, setDq] = useState<DqKey | null>(null)

  // SMS body sent when user couldn't qualify but still wants help.
  const smsHref = `sms:${phoneHref}?body=${encodeURIComponent("I was unable to fill out the form but I would still like an offer.")}`

  // Check if a pick triggers a DQ. Returns the DqKey or null.
  const checkDq = (key: keyof FormState, value: FormState[keyof FormState]): DqKey | null => {
    if (key === "whoAreYou" && typeof value === "string") {
      const qualified = ["owner", "part-owner", "family"]
      if (!qualified.includes(value)) return "notOwner"
    }
    if (key === "timeline" && value === "exploring") return "exploring"
    if (key === "yearsOwned" && typeof value === "string") {
      if (value === "0-2" || value === "3-5") return "recentlyBought"
    }
    if (key === "condition" && value === "excellent") return "excellent"
    return null
  }

  const [form, setForm] = useState<FormState>({
    propertyType: "",
    whoAreYou: "",
    listedOnMarket: "",
    timeline: "",
    yearsOwned: "",
    reason: "",
    condition: "",
    askingPrice: PRICE_DEFAULT,
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
  // Short-circuits to the DQ screen if the pick triggers a disqualifier.
  const pickAndAdvance = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    const dqHit = checkDq(key, value)
    if (dqHit) {
      setTimeout(() => setDq(dqHit), 150)
      return
    }
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
        who_are_you: form.whoAreYou,
        listed_on_market: form.listedOnMarket,
        timeline: form.timeline,
        years_owned: form.yearsOwned,
        reason: form.reason,
        condition: form.condition,
        asking_price: form.askingPrice,
        asking_price_display: formatPrice(form.askingPrice),
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

  // ---- DQ screen render ----
  if (dq) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 md:p-8 text-center">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4"
          style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
        >
          <Phone className="h-7 w-7" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Let&apos;s talk directly.
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-2 max-w-md mx-auto">
          {DQ_REASONS[dq]}
        </p>
        <p className="text-sm md:text-base text-gray-700 font-medium mb-6 max-w-md mx-auto">
          That said, we&apos;d still like to hear from you. Call or text and we&apos;ll see what we can do.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <a
            href={`tel:${phoneHref}`}
            className="flex items-center justify-center gap-2 h-14 rounded-xl text-white font-semibold text-base shadow-sm active:scale-[0.98] transition-transform"
            style={{ backgroundColor: accentColor }}
          >
            <Phone className="h-5 w-5" />
            <span>Call Us</span>
          </a>
          <a
            href={smsHref}
            className="flex items-center justify-center gap-2 h-14 rounded-xl font-semibold text-base shadow-sm active:scale-[0.98] transition-transform border-2"
            style={{ borderColor: accentColor, color: accentColor, backgroundColor: "#ffffff" }}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Text Us</span>
          </a>
        </div>

        <p className="mt-4 text-sm font-medium text-gray-500">
          {phoneDisplay}
        </p>
      </div>
    )
  }

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

      {/* Step 2 — Who are you? */}
      {step === 2 && (
        <div>
          <StepHeader>And who are you in this transaction?</StepHeader>
          <div className="space-y-3">
            {WHO_ARE_YOU_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.whoAreYou === c.id} onClick={() => pickAndAdvance("whoAreYou", c.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Listed on Market */}
      {step === 3 && (
        <div>
          <StepHeader>Is your home currently listed with a realtor?</StepHeader>
          <div className="space-y-3">
            {LISTED_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.listedOnMarket === c.id} onClick={() => pickAndAdvance("listedOnMarket", c.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 4 — Timeline to sell */}
      {step === 4 && (
        <div>
          <StepHeader>How soon would you like to sell?</StepHeader>
          <div className="space-y-3">
            {TIMELINE_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.timeline === c.id} onClick={() => pickAndAdvance("timeline", c.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 5 — Years owned */}
      {step === 5 && (
        <div>
          <StepHeader>How long have you owned the property?</StepHeader>
          <div className="space-y-3">
            {YEARS_OWNED_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.yearsOwned === c.id} onClick={() => pickAndAdvance("yearsOwned", c.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 6 — Reason for selling */}
      {step === 6 && (
        <div>
          <StepHeader>What&apos;s the main reason for selling?</StepHeader>
          <div className="space-y-3">
            {REASON_OPTIONS.map(c => (
              <ChoiceButton key={c.id} accentColor={accentColor} choice={c} selected={form.reason === c.id} onClick={() => pickAndAdvance("reason", c.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 7 — Condition (two-line choice with sub-copy) */}
      {step === 7 && (
        <div>
          <StepHeader>How would you describe the condition?</StepHeader>
          <div className="space-y-3">
            {CONDITION_OPTIONS.map(c => {
              const Icon = c.icon
              const selected = form.condition === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pickAndAdvance("condition", c.id)}
                  className="group w-full rounded-xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98] flex items-start gap-3"
                  style={{
                    borderColor: selected ? accentColor : "#e5e7eb",
                    backgroundColor: selected ? `${accentColor}0D` : "#ffffff",
                  }}
                >
                  <span
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg mt-0.5"
                    style={{
                      backgroundColor: selected ? `${accentColor}1A` : "#f3f4f6",
                      color: selected ? accentColor : "#4b5563",
                    }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span className="flex-1">
                    <span
                      className="block text-base md:text-lg font-semibold leading-tight"
                      style={{ color: selected ? accentColor : "#111827" }}
                    >
                      {c.label}
                    </span>
                    <span className="block text-sm text-gray-500 mt-0.5 leading-snug">
                      {c.sub}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-300 mt-2 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 8 — Asking price (slider) */}
      {step === 8 && (
        <div>
          <StepHeader>
            If we waive all repairs and selling fees and close on YOUR timeline, what&apos;s the best price you can do for us?
          </StepHeader>

          {/* Big animated price display */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl"
              style={{ backgroundColor: `${accentColor}14` }}
            >
              <DollarSign className="h-7 w-7" style={{ color: accentColor }} />
              <span
                className="text-4xl md:text-5xl font-extrabold tabular-nums"
                style={{ color: accentColor }}
              >
                {formatPrice(form.askingPrice)}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-500">
              {priceTier(form.askingPrice)}
            </p>
          </div>

          {/* Custom-styled range slider */}
          <div className="px-1">
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={form.askingPrice}
              onChange={e => update("askingPrice", Number(e.target.value))}
              aria-label="Best asking price"
              className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-200 touch-pan-y"
              style={{
                background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${((form.askingPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%, #e5e7eb ${((form.askingPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
              <span>{formatPrice(PRICE_MIN)}</span>
              <span>{formatPrice(PRICE_MAX)}</span>
            </div>
          </div>

          {/* Helpful framing copy */}
          <p className="mt-5 text-sm text-gray-500 text-center leading-relaxed">
            Slide to your best number. We&apos;ll let you know within 24 hours if we can hit it.
          </p>

          <div className="mt-6">
            <NextButton
              accentColor={accentColor}
              onClick={() => setStep(s => s + 1)}
              label="Lock In My Price"
            />
          </div>
        </div>
      )}

      {/* Step 9 — Address */}
      {step === 9 && (
        <div>
          <StepHeader>What&apos;s the property address?</StepHeader>
          <div className="space-y-3">
            <AddressAutocomplete
              value={form.address}
              onChange={(v) => { update("address", v); setOutsideAreaError(false) }}
              onSelect={(addr, details) => {
                // Inline the service-area check (the autocomplete also runs it
                // when serviceAreas is passed; we keep our own here as a fence
                // so the local DQ message stays consistent).
                if (!isInServiceArea(details)) {
                  setOutsideAreaError(true)
                  return
                }
                setOutsideAreaError(false)
                setForm(prev => ({ ...prev, address: addr, addressDetails: details }))
                setStep(s => s + 1)
              }}
              onOutOfArea={() => setOutsideAreaError(true)}
              serviceAreas={serviceAreas}
              placeholder="Start typing your address..."
            />
            {outsideAreaError && (
              <p className="text-sm text-red-600 text-center">
                Sorry, that address is outside our buying area. Please enter a property in Orange County or surrounding Southern California.
              </p>
            )}
            <p className="text-xs text-gray-500 text-center">
              We buy in Orange County and surrounding Southern California areas.
            </p>
          </div>
        </div>
      )}

      {/* Step 10 — Contact info → submit */}
      {step === 10 && (
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

      {/* Back link — except on step 1 and the final submit step (10) */}
      {step > 1 && step < 10 && (
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
