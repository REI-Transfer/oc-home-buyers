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
          {/* Hero — Elevate-style headline localized for Orange County */}
          <div className="mx-auto text-center">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-[3.25rem] lg:leading-tight text-balance">
              Get a fair cash offer for your <span style={{ color: config.accentColor }}>Orange County</span> home in <span style={{ color: config.accentColor }}>24 hours</span>.
            </h1>
            <p className="mt-2 md:mt-3 text-base md:text-lg text-gray-600">
              No fees. No repairs. Close in as few as 14 days. We handle the paperwork, the timeline, and the stress. You pick the closing date and walk away with a check.
            </p>

            {/* Trust badges — verified: BBB Accredited (A rating), 4.9 Google, local since 2018 */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                <span className="flex h-5 items-center justify-center rounded-sm bg-[#0a3d62] px-1 text-[10px] font-extrabold leading-none text-white">BBB</span>
                <span className="text-xs font-semibold text-gray-800 md:text-sm">Accredited<span className="hidden sm:inline"> Business</span> <span className="text-gray-300">|</span> A Rating</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                <span className="text-sm font-bold leading-none" aria-hidden="true"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></span>
                <span className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-900 md:text-sm">4.9</span>
                  <span className="flex">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <svg key={i} className="h-3 w-3 text-[#FBBC05]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.29 3.96a1 1 0 00.95.69h4.16c.97 0 1.37 1.24.59 1.81l-3.37 2.45a1 1 0 00-.36 1.11l1.28 3.96c.3.92-.75 1.69-1.54 1.12l-3.36-2.45a1 1 0 00-1.18 0l-3.37 2.45c-.78.57-1.83-.2-1.53-1.12l1.28-3.96a1 1 0 00-.36-1.11L2.5 9.4c-.78-.57-.38-1.81.59-1.81h4.16a1 1 0 00.95-.69L9.05 2.93z" />
                      </svg>
                    ))}
                  </span>
                  <span className="text-xs text-gray-500">(18)</span>
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                <svg className="h-4 w-4" style={{ color: config.accentColor }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-gray-800 md:text-sm">Orange County <span className="text-gray-300">|</span> Since 2018</span>
              </div>
            </div>

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

          {/* Meet the founders — real local trust (transparent couple cutout) */}
          <div className="mt-8 md:mt-12 mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: config.accentColor }}>
              Meet the Founders
            </p>
            <h2 className="mt-1 text-xl font-bold text-gray-900 md:text-2xl text-balance">
              Nate &amp; Taylor Looney
            </h2>
            <p className="mt-1 text-sm text-gray-600 md:text-base">
              A husband-and-wife team buying houses across Orange County, as-is, since 2018.
            </p>
            <Image
              src="/images/founders-looney-cutout.png"
              alt="Nate and Taylor Looney, founders of OC Home Buyers"
              width={580}
              height={574}
              sizes="(max-width: 768px) 80vw, 420px"
              className="mt-2 h-auto w-full max-w-xs md:max-w-sm mx-auto"
            />
          </div>

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
