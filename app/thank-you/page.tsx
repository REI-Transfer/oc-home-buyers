import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Phone, MessageSquare, Star, ArrowRight } from "lucide-react"
import config from "@/lib/config"
import { ARTICLES } from "@/lib/articles"

// Google reviews verbatim from OC Home Buyers' public Google Business profile
// (Place ID ChIJl2lnM8cf3YARMbqnS2UTE9k — 5.0 rating). Same data the /v2
// Reviews component uses; surfaced here so the thank-you page carries the
// same social proof while the prospect waits for the offer.
const REVIEWS = [
  {
    quote: "OC Home Buyers made it incredibly easy for us to sell our house. They were very accommodating, helped and paid for our move. We felt like we got a very fair price and were treated respectfully.",
    name: "Miranda Wu",
    city: "Orange County, CA",
    avatar: "/images/adv-testimonial-1.jpg",
  },
  {
    quote: "Before I ever met anybody, we had a phone call. They asked me how much I wanted for the house. Fast forward a couple weeks, Jack came out with paperwork that had that number plus $25k.",
    name: "Brandon Hill",
    city: "Orange County, CA",
    avatar: "/images/adv-testimonial-2.jpg",
  },
  {
    quote: "William was professional and transparent from day one. They made a fair offer, kept things straightforward, and I didn't have to stress about repairs, cleaning, or showings.",
    name: "Colin Holley",
    city: "Orange County, CA",
    avatar: "/images/adv-testimonial-3.jpg",
  },
]

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Note: the Meta Lead event fires once in the SurveyCard on completion (with a
          dedup eventID). We intentionally do NOT fire a second Lead here. A second
          un-deduped fire on this page inflates reported leads ~2x. */}

      <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        {/* Confirmation icon */}
        <div className="flex justify-center mb-6">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: `${config.accentColor}20` }}
          >
            <CheckCircle2 className="h-8 w-8" style={{ color: config.accentColor }} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Thank You for Your Submission!
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-lg mx-auto">
            The {config.companyName} team has received your information and will be in touch within{" "}
            <strong>24 hours</strong> with your cash offer. In the meantime, here are answers to common questions.
          </p>
        </div>

        {/* Founders photo — full bleed, natural aspect, with gradient caption overlay at the bottom.
            Moved off the /v3 LP and onto /thank-you per William 2026-06-05. */}
        <section className="mb-8 overflow-hidden rounded-2xl shadow-sm">
          <div className="relative">
            <img
              src="/images/founders-looney.jpg"
              alt={`${config.ownerName || "Nate & Taylor"} — Orange County Home Buyers`}
              className="block w-full h-auto"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-5 pb-5 pt-16 md:px-6 md:pb-6 md:pt-20">
              <p className="text-white text-xl md:text-2xl font-semibold leading-tight drop-shadow">
                We&apos;re Nate &amp; Taylor.
              </p>
              <p className="mt-1 text-white/95 text-sm md:text-base leading-snug drop-shadow">
                Orange County local. We review every offer personally.
              </p>
            </div>
          </div>
        </section>

        {/* Video section */}
        {process.env.NEXT_PUBLIC_THANKYOU_VIDEO_URL && (
          <div className="mb-8">
            <h2 className="mb-3 text-center text-xl font-bold text-gray-900">
              Watch This While You Wait
            </h2>
            <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <video
                src={process.env.NEXT_PUBLIC_THANKYOU_VIDEO_URL}
                controls
                playsInline
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Personal note card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
            A Personal Note
          </p>
          {config.ownerName ? (
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              From {config.ownerName}
            </h2>
          ) : (
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              From Our Team
            </h2>
          )}

          {/* Owner headshot (if available) */}
          {config.headshotUrl && (
            <div className="flex items-center gap-3 mb-5">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2" style={{ borderColor: config.accentColor }}>
                <Image
                  src={config.headshotUrl}
                  alt={config.ownerName || config.companyName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{config.ownerName || config.companyName}</p>
                <p className="text-xs text-gray-500">{config.companyName}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              If you&apos;re reading this, you just took a step that most homeowners put off for months. Maybe years.
              So before anything else, we want you to know that was the right call.
            </p>
            <p>
              Selling a house is stressful. The uncertainty, the waiting, the feeling like you&apos;re at the mercy of a system
              that wasn&apos;t built for you. Realtors want you to fix everything up, stage the house, wait 90 days,
              and hope for the best. That works for some people. But not everyone.
            </p>
            <p>
              We started {config.companyName} because we kept meeting good people stuck in bad situations. Inherited properties
              they couldn&apos;t afford to keep. Houses that needed more work than they had time or money for. Divorces,
              job relocations, tax liens. Life happens. And when it does, the last thing you need is someone telling
              you to repaint your kitchen and &ldquo;list it in the spring.&rdquo;
            </p>
            <p>
              Here&apos;s what happens next: Our team is going to review the information you submitted. Within 24 hours,
              you&apos;ll hear from us with a fair, no-obligation cash offer. No pressure. No games. If the number works
              for you, great. If it doesn&apos;t, no hard feelings. We&apos;ll still answer any questions you have.
            </p>
          </div>
        </div>

        {/* What happens next */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What Happens Next</h3>
          <div className="space-y-4">
            {[
              { step: "1", title: "We review your property", desc: "Our team looks at your submission and researches the property." },
              { step: "2", title: "You get a cash offer", desc: "Within 24 hours, we\u2019ll reach out with a fair, no-obligation offer." },
              { step: "3", title: "You choose your closing date", desc: "If you accept, you pick the date. We handle the rest." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: config.accentColor }}
                >
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA — Text Us "GET OFFER" + Call Us, side by side */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 mb-8 text-center">
          <p className="text-gray-700 font-medium mb-1">
            Have questions in the meantime?
          </p>
          <p className="text-sm text-gray-500 mb-5">
            Text or call. Either reaches Nate &amp; Taylor directly.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <a
              href={`sms:${config.phoneHref}?body=${encodeURIComponent("Get offer — I just submitted my address.")}`}
              className="flex items-center justify-center gap-2 h-14 rounded-xl font-semibold text-base shadow-sm active:scale-[0.98] transition-transform border-2"
              style={{ borderColor: config.accentColor, color: config.accentColor, backgroundColor: "#ffffff" }}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Text Get Offer</span>
            </a>
            <a
              href={`tel:${config.phoneHref}`}
              className="flex items-center justify-center gap-2 h-14 rounded-xl text-white font-semibold text-base shadow-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: config.accentColor }}
            >
              <Phone className="h-5 w-5" />
              <span>Call Now</span>
            </a>
          </div>
          <p className="mt-3 text-sm font-medium text-gray-500">
            {config.phoneDisplay}
          </p>
        </div>

        {/* Google Reviews — public Google Business reviews, 5.0 star average. */}
        <section className="mb-8">
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5" style={{ color: "#fbbf24", fill: "#fbbf24" }} />
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              Real Google Reviews
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              What OC homeowners say about working with Nate &amp; Taylor
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ color: "#fbbf24", fill: "#fbbf24" }} />
                  ))}
                </div>
                <p className="text-sm md:text-[15px] italic text-gray-700 leading-relaxed mb-4">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 ring-2" style={{ borderColor: config.accentColor }}>
                    <Image src={r.avatar} alt={r.name} fill sizes="40px" unoptimized className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{r.name}</p>
                    <p className="text-xs text-gray-500 leading-tight">{r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advertorial reads — surfaces the article library so the prospect can
            keep consuming content while they wait. Pulls the first 3 from
            lib/articles.ts. */}
        <section className="mb-8">
          <div className="text-center mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              Honest Reads
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              While you wait, here&apos;s what other OC homeowners want answered
            </h2>
          </div>
          <div className="space-y-4">
            {ARTICLES.slice(0, 3).map((a) => (
              <Link
                key={a.slug}
                href={a.slug}
                className="block rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden shrink-0">
                    <Image src={a.image} alt={a.title} fill sizes="(min-width:768px) 112px, 96px" unoptimized className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 leading-snug line-clamp-3">
                      {a.title}
                    </p>
                    <p className="hidden md:block text-sm text-gray-500 mt-1 line-clamp-2">
                      {a.teaser}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium" style={{ color: config.accentColor }}>
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <p className="text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.
        </p>
      </div>
    </main>
  )
}
