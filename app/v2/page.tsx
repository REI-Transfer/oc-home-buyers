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

export default function V2Page() {
  let parsedServiceAreas: Array<{ id: string; centerLat: number; centerLng: number; radiusMiles: number }> = []
  try {
    parsedServiceAreas = JSON.parse(config.serviceAreas)
  } catch {}

  const marketName = config.marketName || "Orange County, CA"

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
        />
        <ServiceOptions />
        <WhyUs companyName={config.companyName} />
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
