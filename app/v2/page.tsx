import { Figtree, Inter } from "next/font/google"
import SiteHeader from "@/components/v2/SiteHeader"
import Hero from "@/components/v2/Hero"
import ServiceOptions from "@/components/v2/ServiceOptions"
import WhyUs from "@/components/v2/WhyUs"
import Reviews from "@/components/v2/Reviews"
import SiteFooter from "@/components/v2/SiteFooter"
import StickyTopBar from "@/components/v2/StickyTopBar"
import { HPG_STYLE_BLOCK } from "@/components/v2/hpg-tokens"
import config from "@/lib/config"
import { getHeadlineForUtm } from "@/lib/headline-router"
import { DEFAULT_HEADLINE } from "@/lib/headline-overrides"

// Force dynamic rendering so searchParams is read on every request and Vercel
// never serves a stale cached variant with the wrong headline. Server-rendered,
// no flash, no client hydration cost.
export const dynamic = "force-dynamic"

// Match HPG: Figtree for display, Inter for body. Loaded only on /v2.
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-hpg-display",
  display: "swap",
})
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hpg-sans",
  display: "swap",
})

// Next.js 16 made searchParams ASYNC (a Promise). Server components must
// await it before accessing properties — synchronous access returns undefined.
export default async function V2Page({
  searchParams,
}: {
  searchParams: Promise<{ utm_content?: string }>
}) {
  const params = await searchParams

  let parsedServiceAreas: Array<{ id: string; centerLat: number; centerLng: number; radiusMiles: number }> = []
  try {
    parsedServiceAreas = JSON.parse(config.serviceAreas)
  } catch {}

  const marketName = config.marketName || "Orange County, CA"

  // Dynamic-headline scent match. If utm_content matches a row in
  // lib/headline-overrides.ts, swap H1 + sub. Otherwise fall back to DEFAULT.
  // Naming contract: ~/.claude/projects/-Users-williamyu/memory/feedback_ad-name-scent-contract.md
  const matched = getHeadlineForUtm(params?.utm_content)
  const heroH1 = matched?.h1 ?? DEFAULT_HEADLINE.h1
  const heroSub = matched?.sub ?? DEFAULT_HEADLINE.sub

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HPG_STYLE_BLOCK }} />
      <main
        data-hpg-page
        className={`${figtree.variable} ${inter.variable}`}
        style={{ backgroundColor: "var(--hpg-cream)" }}
      >
        <StickyTopBar phoneDisplay={config.phoneDisplay} phoneHref={config.phoneHref} />
        <SiteHeader
          companyName={config.companyName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          logoUrl={config.logoUrl}
        />
        <Hero
          marketName={marketName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          serviceAreas={parsedServiceAreas}
          h1={heroH1}
          sub={heroSub}
        />
        <ServiceOptions />
        <WhyUs companyName={config.companyName} ownerName={config.ownerName} />
        <Reviews marketName={marketName} />
        <SiteFooter
          companyName={config.companyName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          marketName={marketName}
        />
      </main>
    </>
  )
}
