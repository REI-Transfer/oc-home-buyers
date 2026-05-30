"use client"

import Image from "next/image"
import QuizCard from "./QuizCard"

const HERO_BULLETS = [
  "No fees taken out. No commissions. No surprises at closing.",
  "Family owned. Locally operated. Local team.",
  "The number we quote is the number that hits your account.",
]

interface HeroProps {
  marketName: string
  phoneDisplay: string
  phoneHref: string
  serviceAreas: Array<{ id: string; centerLat: number; centerLng: number; radiusMiles: number }>
}

export default function Hero({ marketName, phoneDisplay, phoneHref, serviceAreas }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src="/images/v2/v2-hero.jpg"
          alt={`Cash home buyer serving ${marketName}`}
          fill
          className="object-cover opacity-50"
          priority
          unoptimized
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" aria-hidden />
      <div className="absolute inset-y-0 left-0 w-full lg:w-7/12 bg-gradient-to-r from-black/55 to-transparent pointer-events-none" aria-hidden />

      <div className="relative z-10 hpg-container px-4 sm:px-6 pt-32 pb-6 sm:pt-32 sm:pb-14 lg:pt-36 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8 items-start">
          <div className="lg:col-span-7 hpg-fadein text-center lg:text-left">
            <h1 className="font-display text-[1.5rem] sm:text-[2.6rem] lg:text-[3.4rem] font-black leading-[1.05] uppercase text-white mb-2 sm:mb-4">
              Stop Waiting.
              <br />
              <span style={{ color: "#FFF6DD" }}>Sell Your House for Cash.</span>
            </h1>
            <p className="text-[14px] sm:text-[18px] text-white leading-snug mb-3 sm:mb-5 font-medium">
              Fair cash offers in 24 hours for{" "}
              <span
                className="font-black underline underline-offset-4"
                style={{ color: "#FFF6DD", textDecorationColor: "rgba(255,246,221,0.4)" }}
              >
                {marketName} homeowners.
              </span>
            </p>
            <ul className="space-y-1 sm:space-y-2.5 inline-block lg:block text-left">
              {HERO_BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2 text-white text-[13px] sm:text-[16px] leading-tight font-medium"
                >
                  <span aria-hidden className="shrink-0 font-black text-sm sm:text-base" style={{ color: "var(--hpg-gold)" }}>
                    ✓
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <QuizCard
              marketName={marketName}
              phoneDisplay={phoneDisplay}
              phoneHref={phoneHref}
              serviceAreas={serviceAreas}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
