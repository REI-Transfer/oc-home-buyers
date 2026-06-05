"use client"

import Image from "next/image"
import { openQuiz } from "./openQuiz"

const OPTIONS = [
  { title: "Inherited a Home", img: "/images/v2/v2-inherited.jpg" },
  { title: "Tired Landlord", img: "/images/v2/v2-landlord.jpg" },
  { title: "House Needs Repairs", img: "/images/v2/v2-repairs.jpg" },
  { title: "Assisted Living Move", img: "/images/adv-senior-cautious.jpg" },
]

export default function ServiceOptions() {
  return (
    <section
      className="bg-white py-12 px-4"
      style={{ borderBottom: "1px solid var(--hpg-border)" }}
    >
      <div className="hpg-container">
        <div className="text-center mb-6">
          <h2
            className="font-display text-2xl sm:text-3xl font-black uppercase"
            style={{ color: "var(--hpg-black)" }}
          >
            What's the situation?
          </h2>
          <p
            className="text-[12px] sm:text-[13px] font-bold uppercase tracking-widest mt-2"
            style={{ color: "var(--hpg-muted)" }}
          >
            Tap your situation to start your cash offer
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {OPTIONS.map((o) => (
            <button
              key={o.title}
              type="button"
              onClick={openQuiz}
              aria-label={`Get my cash offer — ${o.title}`}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all text-left w-full"
              style={{ border: "1px solid var(--hpg-border)" }}
            >
              <Image
                src={o.img}
                alt={o.title}
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-display font-black text-[14px] sm:text-[15px] uppercase tracking-wide leading-tight">
                  {o.title}
                </p>
                <p
                  className="text-[11px] font-bold uppercase tracking-wider mt-1"
                  style={{ color: "var(--hpg-gold)" }}
                >
                  Get my cash offer →
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
