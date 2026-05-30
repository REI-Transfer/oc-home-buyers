"use client"

import { useEffect, useState } from "react"
import CountdownTimer from "./CountdownTimer"
import { SurveyCard } from "@/components/survey/survey-card"
import { START_QUIZ_EVENT } from "./openQuiz"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

interface QuizCardProps {
  marketName: string
  phoneDisplay: string
  phoneHref: string
  serviceAreas: Array<{ id: string; centerLat: number; centerLng: number; radiusMiles: number }>
}

export default function QuizCard({ marketName, phoneDisplay, phoneHref, serviceAreas }: QuizCardProps) {
  const [started, setStarted] = useState(false)
  const month = MONTH_NAMES[new Date().getMonth()]

  useEffect(() => {
    const handler = () => setStarted(true)
    window.addEventListener(START_QUIZ_EVENT, handler)
    return () => window.removeEventListener(START_QUIZ_EVENT, handler)
  }, [])

  if (started) {
    return (
      <div id="quiz" className="hpg-fadein">
        <SurveyCard
          phoneDisplay={phoneDisplay}
          phoneHref={phoneHref}
          serviceAreas={serviceAreas}
        />
      </div>
    )
  }

  return (
    <div
      id="quiz"
      className="rounded-2xl shadow-2xl overflow-hidden hpg-fadein"
      style={{ backgroundColor: "white", border: "1px solid var(--hpg-border)" }}
    >
      <div
        className="text-white text-center py-2 sm:py-3 px-4"
        style={{
          backgroundColor: "var(--hpg-cta)",
          borderBottom: "4px solid var(--hpg-black)",
        }}
      >
        <p className="font-display font-black text-[14px] sm:text-[16px] uppercase tracking-wide">
          {month} Cash Offer Window <span aria-hidden>🏠</span>
        </p>
      </div>
      <div className="px-5 sm:px-8 py-5 sm:py-7 text-center">
        <p
          className="text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.16em] mb-2 sm:mb-3"
          style={{ color: "var(--hpg-cta)" }}
        >
          Real Cash for Homes in {marketName}
        </p>
        <h2
          className="font-display text-[1.85rem] sm:text-[2.8rem] font-black uppercase leading-none mb-1"
          style={{ color: "var(--hpg-black)" }}
        >
          Cash Offer in 24 Hours
        </h2>
        <p className="hidden sm:block text-[15px] sm:text-[16px] font-semibold" style={{ color: "var(--hpg-charcoal)" }}>
          Close in as little as 7 days. You pick the date.
        </p>
        <p className="sm:hidden text-[13px] font-semibold mt-1" style={{ color: "var(--hpg-charcoal)" }}>
          Close in 7 days. You pick the date.
        </p>
        <div className="my-3 sm:my-5 h-px" style={{ backgroundColor: "var(--hpg-border)" }} />
        <p
          className="text-[11px] sm:text-[13px] font-bold uppercase tracking-wider mb-2 sm:mb-3"
          style={{ color: "var(--hpg-black)" }}
        >
          Get Your Number in 60 Seconds
        </p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="w-full inline-flex items-center justify-center gap-3 px-5 sm:px-7 py-3.5 sm:py-5 rounded-full text-white font-display font-black text-[16px] sm:text-[20px] uppercase tracking-wide shadow-xl hpg-pulse-cta active:translate-y-[2px] transition-transform"
          style={{
            backgroundColor: "var(--hpg-green)",
            borderBottom: "5px solid var(--hpg-green-dark)",
          }}
        >
          Get My Cash Offer
          <span className="text-base opacity-90" aria-hidden>›</span>
        </button>
        <div className="mt-4 sm:mt-7">
          <p
            className="text-[10px] sm:text-[12px] font-bold uppercase tracking-wider mb-2 sm:mb-3"
            style={{ color: "var(--hpg-muted)" }}
          >
            Offer Expires In:
          </p>
          <div className="flex justify-center sm:hidden">
            <CountdownTimer size="sm" />
          </div>
          <div className="hidden sm:flex justify-center">
            <CountdownTimer size="lg" />
          </div>
        </div>
        <p
          className="hidden sm:block mt-5 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider"
          style={{ color: "var(--hpg-black)" }}
        >
          Lock Your Cash Price Now
        </p>
      </div>
    </div>
  )
}
