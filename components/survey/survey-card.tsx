"use client"

import { useState, useRef, useEffect } from "react"
import { Home, ArrowRight, ArrowLeft, Check, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { captureTrackingData, getIPAddress } from "@/lib/tracking"
import { Input } from "@/components/ui/input"
import { AddressAutocomplete, type AddressDetails, type ServiceArea } from "./address-autocomplete"
import {
  calculateLeadScore,
  getLeadQuality,
  getMetaEventConfig,
  isPropertyTypeAccepted,
  makeEventId,
  type Stage2Data,
} from "@/lib/scoring"

interface Stage1State {
  address: string
  state: string
  county: string
  city: string
  isLegalOwner: string
  listedOnMarket: string
  firstName: string
  lastName: string
  email: string
  phone: string
  tcpaConsent: boolean
}

interface Stage2State {
  propertyType: string
  ownershipLength: string
  timeline: string
  condition: string
  reason: string
}

const INITIAL_STAGE1: Stage1State = {
  address: "", state: "", county: "", city: "",
  isLegalOwner: "", listedOnMarket: "",
  firstName: "", lastName: "", email: "", phone: "",
  tcpaConsent: false,
}
const INITIAL_STAGE2: Stage2State = {
  propertyType: "", ownershipLength: "", timeline: "", condition: "", reason: "",
}

const LEGAL_OWNER_OPTIONS = [
  { id: "yes-owner", label: "Yes, I am the legal homeowner" },
  { id: "yes-family", label: "Yes, I am a family member with the legal right to sell" },
  { id: "no", label: "No, I am not" },
]

const LISTED_OPTIONS = [
  { id: "not-listed", label: "No, it is not listed" },
  { id: "listed-realtor", label: "Yes, listed with a realtor" },
  { id: "listed-fsbo", label: "Yes, listed for sale by owner" },
]

const PROPERTY_TYPE_OPTIONS = [
  { id: "single-family", label: "Single Family Home" },
  { id: "multi-family", label: "Multi-Family (Duplex, Triplex, etc.)" },
  { id: "condo-townhouse", label: "Condo / Townhouse" },
  { id: "mobile-home", label: "Mobile / Manufactured Home" },
  { id: "land", label: "Vacant Land / Lot" },
  { id: "other", label: "Other" },
]

const OWNERSHIP_LENGTH_OPTIONS = [
  { id: "1-3-years", label: "Less than 3 years" },
  { id: "3-5-years", label: "3 to 5 years" },
  { id: "5-10-years", label: "5 to 10 years" },
  { id: "10-plus-years", label: "10+ years" },
]

const TIMELINE_OPTIONS = [
  { id: "asap", label: "ASAP (Within 7 days)" },
  { id: "2-weeks", label: "Within 2 weeks" },
  { id: "30-days", label: "Within 30 days" },
  { id: "60-days", label: "Within 60 days" },
  { id: "flexible", label: "I'm flexible" },
]

const CONDITION_OPTIONS = [
  { id: "excellent", label: "Excellent - Move-in ready" },
  { id: "good", label: "Good - Minor repairs needed" },
  { id: "fair", label: "Fair - Needs some work" },
  { id: "poor", label: "Poor - Major repairs needed" },
  { id: "distressed", label: "Distressed - Significant issues" },
]

const REASON_OPTIONS = [
  { id: "foreclosure", label: "Facing foreclosure" },
  { id: "behind-payments", label: "Behind on payments" },
  { id: "inherited", label: "Inherited property" },
  { id: "divorce", label: "Divorce or separation" },
  { id: "relocation", label: "Job relocation" },
  { id: "downsizing", label: "Downsizing" },
  { id: "repairs", label: "Can't afford repairs" },
  { id: "other", label: "Other" },
]

const DISPOSABLE_DOMAINS = new Set(["mailinator.com","guerrillamail.com","tempmail.com","throwaway.email","yopmail.com","sharklasers.com","guerrillamail.info","grr.la","guerrillamail.biz","guerrillamail.de","guerrillamail.net","guerrillamail.org","spam4.me","trashmail.com","trashmail.me","trashmail.net","mytemp.email","mohmal.com","tempail.com","dispostable.com","maildrop.cc","10minutemail.com","temp-mail.org","fakeinbox.com","mailnesia.com","getnada.com","emailondeck.com","33mail.com","harakirimail.com","jetable.org","meltmail.com","mailcatch.com","tempinbox.com","spamgourmet.com","mailexpire.com","incognitomail.org","getairmail.com","mailnull.com","safeemail.xyz","tempmailo.com","burnermail.io"])
const BLOCKED_WORDS = new Set(["fuck","shit","ass","damn","bitch","bastard","dick","cock","pussy","cunt","whore","slut","fag","nigger","nigga","retard","penis","vagina","anus","dildo","porn","xxx","viagra","cialis","casino","bitcoin","crypto","forex","mlm","scam","spam","test123","asdf","qwerty","aaaaaa","zzzzzz","abcdef","123456"])

function formatPhoneNumber(value: string): string {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("1")) digits = digits.slice(1)
  if (digits.length > 10) digits = digits.slice(0, 10)
  if (digits.length === 0) return ""
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

function validatePhone(phone: string): { valid: boolean; msg: string } {
  const digits = phone.replace(/\D/g, "").replace(/^1/, "")
  if (digits.length !== 10) return { valid: false, msg: "Please enter a valid 10-digit US phone number." }
  const area = digits.slice(0, 3)
  if (area[0] === "0" || area[0] === "1") return { valid: false, msg: `Area code (${area}) doesn't appear to be valid.` }
  if (/^(\d)\1{9}$/.test(digits)) return { valid: false, msg: "Please enter a real phone number." }
  if (["1234567890", "0123456789", "9876543210"].includes(digits)) return { valid: false, msg: "Please enter a real phone number." }
  const exchange = digits.slice(3, 6)
  if (exchange === "555") return { valid: false, msg: "Please enter a real phone number, not a 555 number." }
  if (exchange.startsWith("0") || exchange.startsWith("1")) return { valid: false, msg: "That doesn't look like a valid phone number." }
  return { valid: true, msg: "" }
}

function validateEmail(email: string): { valid: boolean; msg: string } {
  if (!email || email.trim() === "") return { valid: false, msg: "Email is required." }
  const e = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { valid: false, msg: "Please enter a valid email address." }
  const domain = e.split("@")[1]
  if (DISPOSABLE_DOMAINS.has(domain)) return { valid: false, msg: "Please use a real email address, not a temporary one." }
  const fakePatterns = ["test@test", "fake@fake", "asdf@asdf", "noemail@", "spam@", "junk@", "nobody@nobody", "aaa@aaa", "abc@abc", "example@example"]
  for (const pattern of fakePatterns) {
    if (e.startsWith(pattern)) return { valid: false, msg: "Please enter your real email address." }
  }
  const emailParts = e.replace("@", " ").replace(/\./g, " ").split(/\s+/)
  for (const part of emailParts) {
    if (BLOCKED_WORDS.has(part)) return { valid: false, msg: "Please enter a valid email address." }
  }
  return { valid: true, msg: "" }
}

function validateName(name: string): { valid: boolean; msg: string } {
  const trimmed = name.trim()
  if (!trimmed) return { valid: false, msg: "Name is required." }
  if (trimmed.length < 2) return { valid: false, msg: "Please enter your full name." }
  const words = trimmed.toLowerCase().split(/\s+/)
  for (const word of words) {
    if (BLOCKED_WORDS.has(word)) return { valid: false, msg: "Please enter your real name." }
  }
  if (/(.)\1{4,}/.test(trimmed)) return { valid: false, msg: "Please enter your real name." }
  if (/^\d+$/.test(trimmed)) return { valid: false, msg: "Please enter your real name, not a number." }
  return { valid: true, msg: "" }
}

function fireMetaEvent(eventName: 'Lead' | 'LeadLowIntent' | 'LeadEarly', params: Record<string, unknown>, eventId: string) {
  if (typeof window === "undefined") return
  const w = window as unknown as { fbq?: (...args: unknown[]) => void }
  if (typeof w.fbq !== "function") return
  if (eventName === 'Lead') {
    w.fbq('track', eventName, params, { eventID: eventId })
  } else {
    w.fbq('trackCustom', eventName, params, { eventID: eventId })
  }
}

interface SurveyCardProps {
  phoneDisplay?: string
  phoneHref?: string
  companyName?: string
  serviceAreas?: ServiceArea[]
  disqualifiedPropertyTypes?: string[]
  // Additive seed props: let the advertorial sticky address bar open the popup pre-filled
  // at question 2. Omitted everywhere else, so default behavior is unchanged.
  initialStage1Data?: Partial<Stage1State>
  initialStage1Step?: number
}

export function SurveyCard({
  phoneDisplay = "(800) 000-0000",
  phoneHref = "8000000000",
  companyName = "OC Home Buyers",
  serviceAreas = [],
  disqualifiedPropertyTypes = ["mobile-home", "land", "other"],
  initialStage1Data,
  initialStage1Step,
}: SurveyCardProps) {
  const [stage, setStage] = useState<1 | 2>(1)
  const [stage1Step, setStage1Step] = useState(initialStage1Step ?? 1)
  const [stage2Step, setStage2Step] = useState(1)
  const totalStage2Steps = 5

  const [stage1Data, setStage1Data] = useState<Stage1State>({ ...INITIAL_STAGE1, ...initialStage1Data })
  const [stage2Data, setStage2Data] = useState<Stage2State>(INITIAL_STAGE2)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDisqualified, setIsDisqualified] = useState(false)
  const [disqualifyReason, setDisqualifyReason] = useState("")
  const [, setAddressVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const formStartTime = useRef<number>(Date.now())
  const trackingRef = useRef(captureTrackingData())
  const stage1EventIdRef = useRef<string>("")
  useEffect(() => {
    getIPAddress().then((ip) => { trackingRef.current.ip = ip })
  }, [])
  const [honeypot, setHoneypot] = useState("")

  // ============================================================
  // STAGE 1 HANDLERS
  // ============================================================

  // Address selection — radius-based service area is enforced in AddressAutocomplete
  // via SERVICE_AREAS env var. handleOutOfArea below catches outside-radius selections.
  const handleAddressSelect = (address: string, details: AddressDetails) => {
    setStage1Data({
      ...stage1Data,
      address,
      state: details.state || "",
      county: details.county || "",
      city: details.city || "",
    })
    setAddressVerified(true)
    setTimeout(() => setStage1Step(2), 350)
  }

  const handleAddressOutOfArea = (address: string) => {
    setStage1Data({ ...stage1Data, address })
    setAddressVerified(false)
    setTimeout(() => { setDisqualifyReason("outOfMarket"); setIsDisqualified(true) }, 300)
  }

  const handleOwnerSelect = (value: string) => {
    setStage1Data({ ...stage1Data, isLegalOwner: value })
    if (value === "no") {
      setTimeout(() => { setDisqualifyReason("notOwner"); setIsDisqualified(true) }, 300)
      return
    }
    setTimeout(() => setStage1Step(3), 350)
  }

  const handleListedSelect = (value: string) => {
    setStage1Data({ ...stage1Data, listedOnMarket: value })
    if (value === "listed-realtor" || value === "listed-fsbo") {
      setTimeout(() => { setDisqualifyReason("listed"); setIsDisqualified(true) }, 300)
      return
    }
    setTimeout(() => setStage1Step(4), 350)
  }

  // Contact submit — fires LeadEarly + sends early-stage webhook + advances to Stage 2
  const handleContactSubmit = async () => {
    const errors: Record<string, string> = {}
    const fnCheck = validateName(stage1Data.firstName)
    if (!fnCheck.valid) errors.firstName = fnCheck.msg.replace(/full name/g, "first name")
    const lnCheck = validateName(stage1Data.lastName)
    if (!lnCheck.valid) errors.lastName = lnCheck.msg.replace(/full name/g, "last name")
    const eCheck = validateEmail(stage1Data.email)
    if (!eCheck.valid) errors.email = eCheck.msg
    const pCheck = validatePhone(stage1Data.phone)
    if (!pCheck.valid) errors.phone = pCheck.msg
    if (!stage1Data.tcpaConsent) errors.tcpaConsent = "Please confirm to continue."

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    setValidationErrors({})

    if (Date.now() - formStartTime.current < 3000) { setIsSubmitted(true); return }
    if (honeypot) { setIsSubmitted(true); return }

    setIsSubmitting(true)

    const earlyEventId = makeEventId('lead-early')
    stage1EventIdRef.current = earlyEventId
    fireMetaEvent('LeadEarly', {
      content_name: `${companyName} Stage 1`,
      content_category: 'partial-lead',
    }, earlyEventId)

    try {
      const fullName = `${stage1Data.firstName.trim()} ${stage1Data.lastName.trim()}`.trim()
      const payload = {
        lead_stage: 'early',
        firstName: stage1Data.firstName.trim(),
        lastName: stage1Data.lastName.trim(),
        name: fullName,
        email: stage1Data.email.trim().toLowerCase(),
        phone: stage1Data.phone,
        address: stage1Data.address,
        state: stage1Data.state,
        county: stage1Data.county,
        city: stage1Data.city,
        isLegalOwner: stage1Data.isLegalOwner,
        listedOnMarket: stage1Data.listedOnMarket,
        tcpa_consent: stage1Data.tcpaConsent,
        source: `${companyName} - Survey (Stage 1)`,
        submittedAt: new Date().toISOString(),
        meta_event_id: earlyEventId,
        meta_event_name: 'LeadEarly',
        meta_value: 0,
        ...trackingRef.current,
      }
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // partial fail shouldn't block user
    }

    setIsSubmitting(false)
    setStage(2)
    setStage2Step(1)
  }

  // ============================================================
  // STAGE 2 HANDLERS
  // ============================================================

  const handleStage2Back = () => {
    if (stage2Step > 1) setStage2Step(stage2Step - 1)
  }

  const handleStage1Back = () => {
    if (stage1Step > 1) setStage1Step(stage1Step - 1)
  }

  const submitComplete = async (finalStage2: Stage2State) => {
    setIsSubmitting(true)

    const eventCfg = getMetaEventConfig(finalStage2 as Stage2Data)
    const score = calculateLeadScore(finalStage2 as Stage2Data)
    const quality = getLeadQuality(finalStage2 as Stage2Data)
    const completeEventId = makeEventId('lead-complete')

    fireMetaEvent(eventCfg.eventName, {
      value: eventCfg.value,
      currency: 'USD',
      content_name: `${companyName} Survey`,
      content_category: 'qualified-lead',
      lead_score: score,
      lead_quality: quality,
    }, completeEventId)

    try {
      const fullName = `${stage1Data.firstName.trim()} ${stage1Data.lastName.trim()}`.trim()
      const payload = {
        lead_stage: 'complete',
        firstName: stage1Data.firstName.trim(),
        lastName: stage1Data.lastName.trim(),
        name: fullName,
        email: stage1Data.email.trim().toLowerCase(),
        phone: stage1Data.phone,
        address: stage1Data.address,
        state: stage1Data.state,
        county: stage1Data.county,
        city: stage1Data.city,
        isLegalOwner: stage1Data.isLegalOwner,
        listedOnMarket: stage1Data.listedOnMarket,
        tcpa_consent: stage1Data.tcpaConsent,
        propertyType: finalStage2.propertyType,
        ownershipLength: finalStage2.ownershipLength,
        timeline: finalStage2.timeline,
        condition: finalStage2.condition,
        reason: finalStage2.reason,
        qualified: eventCfg.qualified,
        lead_score: score,
        lead_quality: quality,
        disqualify_reason: eventCfg.qualified ? null : (
          isPropertyTypeAccepted(finalStage2.propertyType) ? 'low-score' : `propertyType-${finalStage2.propertyType}`
        ),
        meta_event_id: completeEventId,
        meta_event_name: eventCfg.eventName,
        meta_value: eventCfg.value,
        stage1_event_id: stage1EventIdRef.current,
        source: `${companyName} - Survey (Complete)`,
        submittedAt: new Date().toISOString(),
        ...trackingRef.current,
      }
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // continue to thank-you regardless
    }

    window.location.href = '/thank-you'
  }

  const handleStage2OptionSelect = (field: keyof Stage2State, value: string) => {
    const next = { ...stage2Data, [field]: value }
    setStage2Data(next)

    if (field === "propertyType" && disqualifiedPropertyTypes.includes(value)) {
      setTimeout(() => { setDisqualifyReason("propertyType"); setIsDisqualified(true) }, 300)
      return
    }

    setTimeout(() => {
      if (stage2Step < totalStage2Steps) {
        setStage2Step(stage2Step + 1)
      } else {
        void submitComplete(next)
      }
    }, 350)
  }

  const renderOptionButton = (
    option: { id: string; label: string },
    selectedValue: string,
    onClick: () => void,
  ) => (
    <button
      key={option.id}
      onClick={onClick}
      className={`w-full rounded-2xl border-2 px-6 py-5 text-left text-base font-semibold transition-all active:scale-[0.99] ${
        selectedValue === option.id
          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-gray-900 shadow-md"
          : "border-gray-200 bg-white text-gray-800 hover:border-[var(--accent)]/60 hover:bg-gray-50 hover:shadow-sm"
      }`}
    >
      {option.label}
    </button>
  )

  if (isDisqualified) {
    const disqualifyMessages: Record<string, { title: string; message: string; detail: string }> = {
      notOwner: {
        title: "We're Unable to Assist",
        message: "We can only work with individuals who have the legal right to sell the property.",
        detail: "If you have legal authority (power of attorney, executor, or court-appointed representative), please contact us directly.",
      },
      listed: {
        title: "We Can't Make an Offer Right Now",
        message: "We're unable to make an offer on properties currently listed on the market.",
        detail: "If your listing expires or you take it off the market, we'd love to help. Reach out to us at that time.",
      },
      propertyType: {
        title: "We're Unable to Assist",
        message: "Unfortunately, we're not able to make an offer on this type of property at this time.",
        detail: "We primarily purchase single-family and multi-family properties. If you have a different property you'd like to sell, feel free to call us.",
      },
      outOfMarket: {
        title: "Outside Our Service Area",
        message: "We currently purchase properties throughout Orange County, California.",
        detail: "If your property is in Orange County, please re-enter the address and select it from the dropdown.",
      },
    }
    const msg = disqualifyMessages[disqualifyReason] || disqualifyMessages.notOwner

    return (
      <div className="w-full max-w-2xl rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{msg.title}</h2>
            <p className="mt-3 text-base text-gray-600">{msg.message}</p>
            <p className="mt-4 text-sm text-gray-500">{msg.detail}</p>
          </div>
          <a
            href={`tel:${phoneHref}`}
            className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-8 py-4 text-lg font-bold text-white hover:opacity-90 transition-opacity shadow-md"
          >
            Call Us: {phoneDisplay}
          </a>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10">
            <Check className="h-8 w-8 text-[#22c55e]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
            <p className="mt-3 text-base text-gray-600">We've received your information and will be in touch shortly.</p>
          </div>
        </div>
      </div>
    )
  }

  // STAGE 1 — auto-advancing single-question-per-screen
  if (stage === 1) {
    return (
      <div className="w-full rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Home className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-base font-medium text-gray-700">Get your free cash offer</span>
          </div>

          {stage1Step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">What's your property address?</h2>
                <p className="mt-2 text-base text-gray-500">Start typing and select your address from the list.</p>
              </div>
              <AddressAutocomplete
                value={stage1Data.address}
                onChange={(address) => {
                  setStage1Data({ ...stage1Data, address })
                  setAddressVerified(false)
                }}
                onSelect={handleAddressSelect}
                onOutOfArea={handleAddressOutOfArea}
                serviceAreas={serviceAreas}
                placeholder="Start typing your address..."
              />
            </div>
          )}

          {stage1Step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">Are you the legal homeowner?</h2>
                <p className="mt-2 text-base text-gray-500">This helps us know we can put together an offer.</p>
              </div>
              <div className="flex flex-col gap-3">
                {LEGAL_OWNER_OPTIONS.map((o) =>
                  renderOptionButton(o, stage1Data.isLegalOwner, () => handleOwnerSelect(o.id))
                )}
              </div>
            </div>
          )}

          {stage1Step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">Is the property currently listed on the market?</h2>
                <p className="mt-2 text-base text-gray-500">We can only buy properties that aren't listed for sale.</p>
              </div>
              <div className="flex flex-col gap-3">
                {LISTED_OPTIONS.map((o) =>
                  renderOptionButton(o, stage1Data.listedOnMarket, () => handleListedSelect(o.id))
                )}
              </div>
            </div>
          )}

          {stage1Step === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">Where should we send your offer?</h2>
                <p className="mt-2 text-base text-gray-500">We'll text you a no-obligation cash offer within 24 hours.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="First name"
                      autoComplete="given-name"
                      value={stage1Data.firstName}
                      onChange={(e) => {
                        setStage1Data({ ...stage1Data, firstName: e.target.value })
                        setValidationErrors({ ...validationErrors, firstName: "" })
                      }}
                      className={`h-14 rounded-2xl border-2 border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:border-[var(--accent)] focus:ring-[var(--accent)]/20 px-4 ${validationErrors.firstName ? "border-red-500" : ""}`}
                    />
                    {validationErrors.firstName && <p className="mt-1.5 text-sm text-red-500">{validationErrors.firstName}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Last name"
                      autoComplete="family-name"
                      value={stage1Data.lastName}
                      onChange={(e) => {
                        setStage1Data({ ...stage1Data, lastName: e.target.value })
                        setValidationErrors({ ...validationErrors, lastName: "" })
                      }}
                      className={`h-14 rounded-2xl border-2 border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:border-[var(--accent)] focus:ring-[var(--accent)]/20 px-4 ${validationErrors.lastName ? "border-red-500" : ""}`}
                    />
                    {validationErrors.lastName && <p className="mt-1.5 text-sm text-red-500">{validationErrors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    value={stage1Data.email}
                    onChange={(e) => {
                      setStage1Data({ ...stage1Data, email: e.target.value })
                      setValidationErrors({ ...validationErrors, email: "" })
                    }}
                    className={`h-14 rounded-2xl border-2 border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:border-[var(--accent)] focus:ring-[var(--accent)]/20 px-4 ${validationErrors.email ? "border-red-500" : ""}`}
                  />
                  {validationErrors.email && <p className="mt-1.5 text-sm text-red-500">{validationErrors.email}</p>}
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="(949) 555-0000"
                    autoComplete="tel"
                    value={stage1Data.phone}
                    onChange={(e) => {
                      setStage1Data({ ...stage1Data, phone: formatPhoneNumber(e.target.value) })
                      setValidationErrors({ ...validationErrors, phone: "" })
                    }}
                    maxLength={14}
                    className={`h-14 rounded-2xl border-2 border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:border-[var(--accent)] focus:ring-[var(--accent)]/20 px-4 ${validationErrors.phone ? "border-red-500" : ""}`}
                  />
                  {validationErrors.phone && <p className="mt-1.5 text-sm text-red-500">{validationErrors.phone}</p>}
                </div>

                <label className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-4 cursor-pointer transition-colors ${
                  validationErrors.tcpaConsent ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input
                    type="checkbox"
                    checked={stage1Data.tcpaConsent}
                    onChange={(e) => {
                      setStage1Data({ ...stage1Data, tcpaConsent: e.target.checked })
                      if (e.target.checked) setValidationErrors({ ...validationErrors, tcpaConsent: "" })
                    }}
                    className="mt-1 h-5 w-5 rounded border-2 border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]/30"
                  />
                  <span className="text-sm text-gray-600 leading-snug">
                    By checking this box, I consent to receive calls and text messages (including autodialed) from {companyName} at the phone number provided. Consent is not a condition of any service. Standard message and data rates may apply. Reply STOP to opt out.
                  </span>
                </label>
                {validationErrors.tcpaConsent && <p className="-mt-2 text-sm text-red-500">{validationErrors.tcpaConsent}</p>}

                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px] opacity-0 pointer-events-none"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Button
                onClick={handleContactSubmit}
                disabled={isSubmitting}
                className="bg-[var(--accent)] text-white hover:opacity-95 disabled:opacity-50 h-16 rounded-2xl font-bold text-lg tracking-tight shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </span>
                ) : (
                  <>
                    Get My Cash Offer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          )}

          {stage1Step > 1 && (
            <button
              onClick={handleStage1Back}
              className="text-sm text-gray-500 hover:text-gray-900 self-start flex items-center gap-1 -mt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
        </div>
      </div>
    )
  }

  // STAGE 2 — quality questions with progress bar
  return (
    <div className="w-full rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-base font-medium text-gray-700">A few quick questions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">{stage2Step}/{totalStage2Steps}</span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalStage2Steps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-7 rounded-full transition-colors ${
                    i < stage2Step ? "bg-[var(--accent)]" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {stage2Step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">What type of property is it?</h2>
              <p className="mt-2 text-base text-gray-500">Select the option that best describes your property.</p>
            </div>
            <div className="flex flex-col gap-3">
              {PROPERTY_TYPE_OPTIONS.map((option) =>
                renderOptionButton(option, stage2Data.propertyType, () => handleStage2OptionSelect("propertyType", option.id))
              )}
            </div>
          </div>
        )}

        {stage2Step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">How long have you owned the home?</h2>
              <p className="mt-2 text-base text-gray-500">This helps us estimate your equity position.</p>
            </div>
            <div className="flex flex-col gap-3">
              {OWNERSHIP_LENGTH_OPTIONS.map((option) =>
                renderOptionButton(option, stage2Data.ownershipLength, () => handleStage2OptionSelect("ownershipLength", option.id))
              )}
            </div>
          </div>
        )}

        {stage2Step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">How fast are you looking to sell?</h2>
              <p className="mt-2 text-base text-gray-500">Select your ideal timeline for closing.</p>
            </div>
            <div className="flex flex-col gap-3">
              {TIMELINE_OPTIONS.map((option) =>
                renderOptionButton(option, stage2Data.timeline, () => handleStage2OptionSelect("timeline", option.id))
              )}
            </div>
          </div>
        )}

        {stage2Step === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">What condition is the property in?</h2>
              <p className="mt-2 text-base text-gray-500">Be honest — we buy houses in any condition.</p>
            </div>
            <div className="flex flex-col gap-3">
              {CONDITION_OPTIONS.map((option) =>
                renderOptionButton(option, stage2Data.condition, () => handleStage2OptionSelect("condition", option.id))
              )}
            </div>
          </div>
        )}

        {stage2Step === 5 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">What's your reason for selling?</h2>
              <p className="mt-2 text-base text-gray-500">This helps us tailor our offer to your situation.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {REASON_OPTIONS.map((option) =>
                renderOptionButton(option, stage2Data.reason, () => handleStage2OptionSelect("reason", option.id))
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleStage2Back}
            disabled={stage2Step === 1}
            className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-0 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          {isSubmitting && (
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--accent)]" />
              Submitting...
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
