import Image from "next/image"

const BULLETS = [
  "Family Owned & Operated",
  "Local Team, Not a Hedge Fund",
  "Offer Does Not Change at Closing",
  "Close in As Little as 7 Days",
]

interface WhyUsProps {
  companyName: string
  ownerName?: string
}

export default function WhyUs({ companyName, ownerName }: WhyUsProps) {
  const captionOwners = ownerName && ownerName !== "Our Team" ? ownerName : "The team behind " + companyName
  const altText = ownerName ? `${ownerName}, the husband-and-wife team behind ${companyName}` : `The ${companyName} team`

  return (
    <section
      className="py-14 px-4"
      style={{
        backgroundColor: "var(--hpg-cream)",
        borderBottom: "1px solid var(--hpg-border)",
      }}
    >
      <div className="hpg-container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Owner family photo */}
          <div className="order-2 md:order-1 max-w-sm mx-auto md:mx-0 w-full">
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl"
              style={{ border: "4px solid var(--hpg-gold)" }}
            >
              <Image
                src="/images/founders-looney.jpg"
                alt={altText}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
                unoptimized
              />
            </div>
            <p
              className="text-center mt-3 text-[13px] sm:text-[14px] font-semibold"
              style={{ color: "var(--hpg-charcoal)" }}
            >
              {captionOwners}, with the two best reasons we do this right.
            </p>
          </div>

          {/* Trust block */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <p
              className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] mb-2"
              style={{ color: "var(--hpg-gold-dark)" }}
            >
              Built on Trust
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-black uppercase leading-tight"
              style={{ color: "var(--hpg-black)" }}
            >
              The {companyName} Difference
            </h2>
            <p
              className="text-[16px] sm:text-[17px] leading-relaxed mt-4 mb-7"
              style={{ color: "var(--hpg-charcoal)" }}
            >
              We are a family-owned, locally operated cash home buyer trusted by homeowners across Orange County, CA. Every offer is underwritten personally. The number we quote you is the number that hits your account at closing. No re-trades, no chip jobs, no surprises.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-left bg-white rounded-xl px-4 py-3 shadow-sm"
                  style={{ border: "1px solid var(--hpg-border)" }}
                >
                  <span
                    className="font-black mt-0.5 shrink-0"
                    aria-hidden
                    style={{ color: "var(--hpg-green-dark)" }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-[14px] sm:text-[15px] font-bold leading-tight"
                    style={{ color: "var(--hpg-black)" }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
