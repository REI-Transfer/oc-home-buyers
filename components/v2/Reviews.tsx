"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { openQuiz } from "./openQuiz"

// Reviews pulled verbatim from OC Home Buyers' public Google Business reviews
// (Place ID ChIJl2lnM8cf3YARMbqnS2UTE9k — 5.0 rating, 40 reviews as of 2026-06-03).
// Avatars are still AI-generated stand-ins from the original v2 template (GPT
// Image 2) because Google profile thumbnails are unusable (letter avatars,
// meme images). Replace with real reviewer photos when collected at signing.
const REVIEWS = [
  {
    quote:
      "OC Home Buyers made it incredibly easy for us to sell our house. They were very accommodating, helped and paid for our move. We felt like we got a very fair price and were treated respectfully.",
    name: "Miranda Wu",
    city: "Orange County, CA",
    avatar: "/images/adv-testimonial-1.jpg",
  },
  {
    quote:
      "Before I ever met anybody, we had a phone call. They asked me how much I wanted for the house. Fast forward a couple weeks, Jack came out with paperwork that had that number plus $25k.",
    name: "Brandon Hill",
    city: "Orange County, CA",
    avatar: "/images/adv-testimonial-2.jpg",
  },
  {
    quote:
      "William was professional and transparent from day one. They made a fair offer, kept things straightforward, and I didn't have to stress about repairs, cleaning, or showings. Closing was smooth and worked around my schedule.",
    name: "Colin Holley",
    city: "Orange County, CA",
    avatar: "/images/adv-testimonial-3.jpg",
  },
]

interface ReviewsProps {
  marketName: string
}

export default function Reviews({ marketName }: ReviewsProps) {
  // marketName like "Orange County, CA" — strip the state suffix for the headline.
  const shortMarket = marketName.split(",")[0].trim() || marketName

  return (
    <section
      className="py-14 px-4"
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid var(--hpg-border)",
      }}
    >
      <div className="hpg-container">
        <div className="text-center mb-8">
          <p
            className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.25em] mb-2"
            style={{ color: "var(--hpg-gold-dark)" }}
          >
            Real Reviews
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-black uppercase"
            style={{ color: "var(--hpg-black)" }}
          >
            What {shortMarket} Homeowners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {REVIEWS.map((r) => (
            <button
              key={r.name}
              type="button"
              onClick={openQuiz}
              aria-label={`Get my cash offer — review from ${r.name}`}
              className="text-left rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all bg-white"
              style={{ border: "1px solid var(--hpg-border)" }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    style={{ color: "var(--hpg-gold)", fill: "var(--hpg-gold)" }}
                  />
                ))}
              </div>
              <p
                className="italic leading-relaxed mb-5 text-[15px] sm:text-[16px]"
                style={{ color: "var(--hpg-charcoal)" }}
              >
                "{r.quote}"
              </p>
              <div className="flex items-center gap-3 mt-1">
                <div
                  className="relative h-12 w-12 rounded-full overflow-hidden shrink-0"
                  style={{ border: "2px solid var(--hpg-gold)" }}
                >
                  <Image
                    src={r.avatar}
                    alt={r.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p
                    className="font-display font-black text-[13px] uppercase tracking-wide leading-tight"
                    style={{ color: "var(--hpg-black)" }}
                  >
                    {r.name}
                  </p>
                  <p className="text-[12px] leading-tight" style={{ color: "var(--hpg-muted)" }}>
                    {r.city}
                  </p>
                </div>
              </div>
              <p
                className="text-[11px] font-bold uppercase tracking-wider mt-3"
                style={{ color: "var(--hpg-gold-dark)" }}
              >
                Get my cash offer →
              </p>
            </button>
          ))}
        </div>

        {/* TODO: link to the OC Home Buyers reviews page (or remove this block) */}
        <p
          className="text-center text-[12px] mt-7"
          style={{ color: "var(--hpg-muted)" }}
        >
          Verified reviews from local {shortMarket} homeowners.
        </p>
      </div>
    </section>
  )
}
