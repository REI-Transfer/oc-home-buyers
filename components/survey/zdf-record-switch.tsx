"use client"

// /v3 (where this site's leads come from). NEXT_PUBLIC_RECORD_FORM=one-step|two-step swaps the
// zero-distraction form for the property-record form (components/v2/record-survey-card.tsx),
// with this site's own address gate, answer ids (lib/form-rules.ts "zdf") and scoring.
// Unset = the zero-distraction form, untouched (unset + redeploy = rollback). Other pages
// are not affected.
import type { ComponentProps } from "react"
import { ZeroDistractionForm } from "@/components/survey/zero-distraction-form"
import type { AddressDetails, ServiceArea } from "@/components/survey/address-autocomplete"
import { RecordSurveyCard } from "@/components/v2/record-survey-card"
import { RECORD_BRAND } from "@/lib/brand"

type Props = ComponentProps<typeof ZeroDistractionForm> & { companyName?: string }

// Same service-area check as the /v3 form (components/survey/zero-distraction-form.tsx).
function inServiceArea(details: AddressDetails, serviceAreas: ServiceArea[]): boolean {
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

export function ZeroDistractionFormWithRecordForm({ companyName, ...props }: Props) {
  if (!RECORD_BRAND.recordForm) return <ZeroDistractionForm {...props} />
  // This site's phone on the screen-out page (the /v3 form's screen-out page has Call / Text).
  const brand = { ...RECORD_BRAND, companyName: companyName || RECORD_BRAND.companyName, phoneDisplay: props.phoneDisplay, phoneHref: props.phoneHref }
  return (
    <RecordSurveyCard
      brand={brand}
      mode={RECORD_BRAND.recordMode}
      serviceAreas={props.serviceAreas}
      addressAllowed={(details: AddressDetails) => inServiceArea(details, props.serviceAreas)}
      outsideAreaText="Sorry, that address is outside our buying area. Please enter a property in Orange County or surrounding Southern California."
      areaNote="We buy in Orange County and surrounding Southern California areas."
    />
  )
}
