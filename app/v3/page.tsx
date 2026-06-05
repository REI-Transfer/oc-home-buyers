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
import { ZeroDistractionForm } from "@/components/survey/zero-distraction-form"
import { Header } from "@/components/layout/header"
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
      <Header
        companyName={config.companyName}
        phoneDisplay={config.phoneDisplay}
        phoneHref={config.phoneHref}
        logoUrl={config.logoUrl}
        headerBgColor={config.headerBgColor}
      />

      <div className="mx-auto max-w-xl px-4 pt-6 pb-12 md:pt-10">
        {/* Headline + sub — copy verbatim from Pathway / safepathadvisors.com */}
        <h1 className="text-center text-2xl font-bold leading-tight text-gray-900 md:text-3xl mb-2">
          OC Home Buyers Trusted Cash Buyer
        </h1>
        <p className="text-center text-sm md:text-base text-gray-600 mb-6 md:mb-8">
          Please fill out the quick survey below to receive a no obligation cash offer on your home within 24 hours.
        </p>

        {/* THE FORM. The only thing that matters above the fold. */}
        <ZeroDistractionForm
          accentColor={config.accentColor}
          serviceAreas={parsedServiceAreas}
          disqualifiedPropertyTypes={disqualifiedPropertyTypes}
        />

        {/* Trust block BELOW the form — rectangular photo with bottom gradient overlay. */}
        <section className="mt-10 md:mt-12 overflow-hidden rounded-2xl shadow-md border border-gray-100 bg-white">
          <div className="relative w-full aspect-[4/3] md:aspect-[16/10]">
            <img
              src="/images/founders-looney.jpg"
              alt={`${config.ownerName || "Nate & Taylor"} — Orange County Home Buyers`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Transparent gradient overlay anchored to the bottom of the photo */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-5 pb-5 pt-12 md:px-6 md:pb-6 md:pt-16">
              <p className="text-white text-xl md:text-2xl font-semibold leading-tight">
                We&apos;re Nate &amp; Taylor.
              </p>
              <p className="mt-1 text-white/90 text-sm md:text-base leading-snug">
                Orange County local. We review every offer personally.
              </p>
            </div>
          </div>
          <div className="px-5 py-4 md:px-6 md:py-5 text-center border-t border-gray-100">
            <a
              href={`tel:${config.phoneHref}`}
              className="text-sm md:text-base font-medium underline"
              style={{ color: config.accentColor }}
            >
              Call us directly: {config.phoneDisplay}
            </a>
          </div>
        </section>
      </div>

      <Footer companyName={config.companyName} />
    </main>
  )
}
