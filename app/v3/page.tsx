/**
 * /v3 — Zero-distraction Pathway-style funnel.
 *
 * Built 2026-06-05 as an A/B test against /v2. Pathway's safepathadvisors.com
 * runs $41 blended CPL on a single-page minimal HighLevel funnel. /v2 (full
 * trust-architecture template) is at $445 CPL on OC. Hypothesis: stripping
 * everything except the form + asking qualifying questions FIRST is the leak.
 *
 * Copy mirrors Pathway's verbatim — only the brand name swaps.
 * Trust block is a rectangular photo with a transparent gradient overlay
 * at the bottom carrying the founder caption.
 *
 * Submits via the existing /api/submit route — no n8n/GHL changes needed.
 */

import config from "@/lib/config"
import Image from "next/image"
import { ZeroDistractionForm } from "@/components/survey/zero-distraction-form"
import { Footer } from "@/components/layout/footer"

export const metadata = {
  title: "OC Home Buyers Trusted Cash Buyer",
  description: "Fill out the quick survey to receive a no obligation cash offer on your home within 24 hours.",
}

export default function V3Page() {
  let parsedServiceAreas: Array<{ id: string; centerLat: number; centerLng: number; radiusMiles: number }> = []
  try { parsedServiceAreas = JSON.parse(config.serviceAreas) } catch {}

  const disqualifiedPropertyTypes = config.disqualifiedPropertyTypes
    .split(",").map(s => s.trim()).filter(Boolean)

  return (
    <main className="relative min-h-screen bg-gray-50">
      {/* Minimal white header — logo only, no duplicate text, no call button. */}
      <header className="w-full bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3 lg:px-8">
          {config.logoUrl && (
            <Image
              src={config.logoUrl}
              alt={config.companyName}
              width={72}
              height={72}
              className="h-14 w-14 md:h-16 md:w-16 flex-shrink-0 object-contain"
              unoptimized
              priority
            />
          )}
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 pt-6 pb-12 md:pt-10">
        {/* Headline + sub — copy verbatim from Pathway / safepathadvisors.com */}
        <h1 className="text-center text-2xl font-bold leading-tight text-gray-900 md:text-3xl mb-2">
          OC Home Buyers Trusted Cash Buyer
        </h1>
        <p className="text-center text-sm md:text-base text-gray-600 mb-6 md:mb-8">
          Please fill out the quick survey below to receive a no obligation cash offer on your home within 24 hours.
        </p>

        {/* THE FORM. The ONLY thing on this page. Trust photo lives on /thank-you.
            Call + Text CTAs ONLY appear inside the form on DQ — never as a
            persistent distraction bar (William 2026-06-05). */}
        <ZeroDistractionForm
          accentColor={config.accentColor}
          serviceAreas={parsedServiceAreas}
          disqualifiedPropertyTypes={disqualifiedPropertyTypes}
          phoneHref={config.phoneHref}
          phoneDisplay={config.phoneDisplay}
        />
      </div>

      <Footer companyName={config.companyName} />
    </main>
  )
}
