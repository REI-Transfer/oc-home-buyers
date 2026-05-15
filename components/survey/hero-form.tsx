"use client"

import { useState } from "react"
import { ArrowRight, ArrowDown } from "lucide-react"
import { SurveyCard } from "./survey-card"
import { AddressAutocomplete, type AddressDetails, type ServiceArea } from "./address-autocomplete"

interface HeroFormProps {
  phoneDisplay?: string
  phoneHref?: string
  serviceAreas?: ServiceArea[]
  disqualifiedPropertyTypes?: string[]
  ctaLabel?: string
}

export function HeroForm({
  phoneDisplay = "(800) 000-0000",
  phoneHref = "8000000000",
  serviceAreas = [],
  disqualifiedPropertyTypes = ["mobile-home", "land", "other"],
  ctaLabel = "Get My Free Cash Offer",
}: HeroFormProps) {
  const [showSurvey, setShowSurvey] = useState(false)
  const [initialAddress, setInitialAddress] = useState("")
  const [outsideAreaError, setOutsideAreaError] = useState(false)

  const handleAddressSelect = (address: string, _details: AddressDetails) => {
    setInitialAddress(address)
    setOutsideAreaError(false)
    setShowSurvey(true)
  }

  const handleOutOfArea = (address: string) => {
    setInitialAddress(address)
    setOutsideAreaError(true)
  }

  if (showSurvey) {
    return (
      <SurveyCard
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        serviceAreas={serviceAreas}
        disqualifiedPropertyTypes={disqualifiedPropertyTypes}
        initialAddress={initialAddress}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-center gap-1">
        <span className="text-white text-base font-medium">Enter your address to start</span>
        <ArrowDown className="h-5 w-5 text-white animate-bounce" />
      </div>
      <div className="relative">
        <AddressAutocomplete
          value={initialAddress}
          onChange={(addr) => { setInitialAddress(addr); setOutsideAreaError(false) }}
          onSelect={handleAddressSelect}
          onOutOfArea={handleOutOfArea}
          serviceAreas={serviceAreas}
          placeholder="Start typing your address..."
        />
      </div>
      <button
        onClick={() => { if (initialAddress.trim() && !outsideAreaError) setShowSurvey(true) }}
        className="w-full h-14 bg-white hover:bg-white/95 text-gray-900 font-semibold text-lg md:text-xl rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
      >
        {ctaLabel}
        <ArrowRight className="h-6 w-6" />
      </button>
      {outsideAreaError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center">
          <p className="text-red-700 font-medium">Outside Our Service Area</p>
          <p className="text-red-600 text-sm mt-1">We currently buy homes in Orange County, California. Please try a different address or give us a call.</p>
        </div>
      )}
      <p className="text-center text-white/70 text-sm">
        Takes less than 2 minutes. No obligation.
      </p>
    </div>
  )
}
