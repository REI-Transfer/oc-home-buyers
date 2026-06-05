"use client"

import { useEffect } from "react"
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
  const month = MONTH_NAMES[new Date().getMonth()]

  // No intro/gate: SurveyCard mounts immediately so the address field is the
  // first thing the user sees (William directive 2026-05-31, after Steadfast hit
  // 91 LPV with 0 leads — the offer-card gate was killing conversion).
  // openQuiz() still works: handler just scrolls into view since the form is
  // already mounted.
  useEffect(() => {
    const handler = () => {
      requestAnimationFrame(() => {
        document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
    window.addEventListener(START_QUIZ_EVENT, handler)
    return () => window.removeEventListener(START_QUIZ_EVENT, handler)
  }, [])

  return (
    <div
      id="quiz"
      className="rounded-2xl shadow-2xl overflow-hidden hpg-fadein"
      style={{ backgroundColor: "white", border: "1px solid var(--hpg-border)" }}
    >
      {/* Urgency banner — text only, no timer */}
      <div
        className="text-white text-center py-2 sm:py-3 px-4"
        style={{
          backgroundColor: "var(--hpg-cta)",
          borderBottom: "4px solid var(--hpg-black)",
        }}
      >
        <p className="font-display font-black text-[13px] sm:text-[15px] uppercase tracking-wide">
          {month} Cash Offer Window <span aria-hidden>🏠</span>
        </p>
      </div>

      {/* SurveyCard mounted directly. Step 1.1 = "Enter your address to get started". */}
      <SurveyCard
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        serviceAreas={serviceAreas}
      />

      {/* Countdown BELOW the address fill, on a soft cream stripe. Stays visible
          through every form step as a steady urgency cue. */}
      <div
        className="text-center py-3 sm:py-4 px-4 border-t"
        style={{
          backgroundColor: "var(--hpg-cream)",
          borderTopColor: "var(--hpg-border)",
        }}
      >
        <p
          className="text-[10px] sm:text-[12px] font-bold uppercase tracking-wider mb-2"
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
    </div>
  )
}
