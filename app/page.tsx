import Image from "next/image"
import { SurveyCard } from "@/components/survey/survey-card"
import { VSLSection } from "@/components/survey/vsl-section"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import config from "@/lib/config"

export default function HomePage() {
  const stats = [
    { value: config.stat1Value, label: config.stat1Label },
    { value: config.stat2Value, label: config.stat2Label },
    { value: config.stat3Value, label: config.stat3Label },
  ]

  let parsedServiceAreas: Array<{ id: string; centerLat: number; centerLng: number; radiusMiles: number }> = []
  try { parsedServiceAreas = JSON.parse(config.serviceAreas) } catch {}

  const disqualifiedPropertyTypes = config.disqualifiedPropertyTypes.split(",").map(s => s.trim()).filter(Boolean)

  return (
    <main className="relative min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Header
          companyName={config.companyName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          logoUrl={config.logoUrl}
          headerBgColor={config.headerBgColor}
        />

        <div className="mx-auto max-w-7xl px-4 py-4 md:py-6 lg:px-8">
          {/* Hero — matches Next Stage Homes structure with two accent spans */}
          <div className="mx-auto text-center">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-[3.25rem] lg:leading-tight text-balance">
              Need to Sell Your <span style={{ color: config.accentColor }}>Orange County</span> Home Fast? We&apos;ll Beat Any Serious Written <span style={{ color: config.accentColor }}>Cash Offer</span> on Your Home. No Games. No Surprises. <span className="text-[#c5993a]">Close on Your Timeline.</span>
            </h1>
            <p className="mt-2 md:mt-3 text-base md:text-lg text-gray-600">
              We handle the paperwork, the timeline, and the stress. You pick the closing date and walk away with a check. Serving all of Orange County, California.
            </p>

            {/* Trust indicators — accent-colored checkmarks on light bg */}
            <div className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:gap-5">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-1.5">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${config.accentColor}1A` }}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      style={{ color: config.accentColor }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base font-medium text-gray-700">
                    <strong>{stat.value}</strong> {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two-stage survey (Stage 1 fires partial-lead webhook; Stage 2 fires full payload) */}
          <div className="mt-4 md:mt-6 mx-auto max-w-3xl">
            <SurveyCard
              phoneDisplay={config.phoneDisplay}
              phoneHref={config.phoneHref}
              companyName={config.companyName}
              serviceAreas={parsedServiceAreas}
              disqualifiedPropertyTypes={disqualifiedPropertyTypes}
            />
          </div>

          {/* Owner / Founder section */}
          {(config.ownerName || config.headshotUrl) && (
            <div className="mt-8 md:mt-12 mx-auto flex flex-col items-center gap-3">
              {config.headshotUrl && (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200">
                  <Image
                    src={config.headshotUrl}
                    alt={config.ownerName || config.companyName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              {config.ownerName && (
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-900">{config.ownerName}</p>
                  <p className="text-sm text-gray-500">{config.companyName}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 md:mt-8 mx-auto max-w-4xl">
            <VSLSection />
          </div>
        </div>

        <Footer
          companyName={config.companyName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          privacyPolicyUrl={config.privacyPolicyUrl}
          termsUrl={config.termsUrl}
        />
      </div>
    </main>
  )
}
