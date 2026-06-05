/**
 * /v3 — Zero-distraction Pathway-style funnel.
 *
 * Built 2026-06-05 as an A/B test against /v2. Pathway's safepathadvisors.com
 * runs $41 blended CPL on a single-page minimal HighLevel funnel. /v2 (full
 * trust-architecture template) is at $445 CPL on OC. Hypothesis: stripping
 * everything except the form + asking qualifying questions FIRST is the leak.
 *
 * Structure:
 *   - Minimal header (logo + phone)
 *   - One-line headline
 *   - Multi-step qualifying form (Pathway pattern + ownership-timeline question)
 *   - Nate + Taylor trust photo BELOW the form
 *   - Minimal footer
 *
 * Submits via the existing /api/submit route — no n8n/GHL changes needed.
 */

import config from "@/lib/config"
import { ZeroDistractionForm } from "@/components/survey/zero-distraction-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata = {
  title: "Get Your Orange County Cash Offer in 24 Hours",
  description: "Fast cash offer on your Orange County home. No fees. No repairs. Close on your timeline.",
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
        {/* Minimal headline — Pathway pattern. One line. */}
        <h1 className="text-center text-2xl font-bold leading-tight text-gray-900 md:text-3xl mb-2">
          Get a Cash Offer on Your Orange County Home in 24 Hours
        </h1>
        <p className="text-center text-sm md:text-base text-gray-600 mb-6 md:mb-8">
          Please answer a few quick questions to receive your no-obligation offer.
        </p>

        {/* THE FORM. The only thing that matters above the fold. */}
        <ZeroDistractionForm
          accentColor={config.accentColor}
          serviceAreas={parsedServiceAreas}
          disqualifiedPropertyTypes={disqualifiedPropertyTypes}
        />

        {/* Trust block BELOW the form — Nate & Taylor only, no other distractions. */}
        <section className="mt-10 md:mt-12 rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center gap-4">
            <img
              src="/nate-taylor.jpg"
              alt={`${config.ownerName || "Nate & Taylor"} — Orange County Home Buyers`}
              className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover ring-4 ring-gray-100"
            />
            <div>
              <p className="text-lg md:text-xl font-semibold text-gray-900">
                We&apos;re Nate &amp; Taylor.
              </p>
              <p className="mt-1 text-sm md:text-base text-gray-600 max-w-md">
                Orange County local. We review every offer personally. No middlemen, no auctions, no out-of-state investors.
              </p>
              <a
                href={`tel:${config.phoneHref}`}
                className="mt-3 inline-block text-sm md:text-base font-medium underline"
                style={{ color: config.accentColor }}
              >
                Call us directly: {config.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer companyName={config.companyName} />
    </main>
  )
}
