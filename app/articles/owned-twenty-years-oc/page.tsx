import { ArticleShell, H2, P, ArticleImage } from "@/components/article/article-shell"
import { ContactCTA } from "@/components/article/contact-cta"
import config from "@/lib/config"

export const metadata = {
  title: "What \"Owned The House For 20 Years\" Really Means In Orange | OC Home Buyers",
  description: "What 20 years of Orange County home ownership means in real equity terms, and how to see your actual number.",
}

export default function Page() {
  return (
    <ArticleShell
      title="What \"Owned The House For 20 Years\" Really Means In Orange County Equity Terms"
      dek="Owning a home for two decades in Orange County is a different financial position than owning one for two years. Here is what nobody explains about that gap."
      companyName={config.companyName}
    >
      <P>There is a quiet thing that happens to people who have lived in the same Orange County home for twenty years.</P>
      <P>They stop seeing the house as a financial position. They start seeing it as a place. As a routine. As the chairs by the window where the grandkids sit.</P>
      <P>That is the right way to see it. But every once in a while, somebody should remind you what that house has quietly become in the other column of the ledger.</P>
      <H2>What the numbers actually look like at year twenty</H2>
      <P>Orange County home values are up roughly four times what they were in 2005.</P>
      <P>If you bought your home for two hundred and fifty thousand in 2005, it is likely worth somewhere in the nine hundred thousand to one point two million range today.</P>
      <P>If you bought for four hundred thousand around then, you are probably between one point three and one point six.</P>
      <P>If you bought for six hundred thousand, you are very likely sitting on more than two million dollars of equity, even after accounting for the original mortgage.</P>
      <P>And almost none of that equity is in your checking account. It is on paper. It is in your address.</P>
      <ArticleImage
        src="/images/adv-couple-kitchen.jpg"
        alt="The kitchen of a home owned for twenty-plus years."
        caption="Same chairs. Same window. A very different ledger."
      />
      <H2>Why the equity is harder to see at twenty years</H2>
      <P>When you have owned a home for two decades, the original purchase price stops feeling real.</P>
      <P>Property tax bills under Prop 13 stay relatively close to where they started. The mortgage is paid off or close to it. The monthly cost of ownership goes down even as the value goes up.</P>
      <P>Most owners adjust their mental sense of the home&apos;s worth to the comfortable monthly cost, not the current market value. They stop tracking the gap.</P>
      <P>Which means most twenty-year owners do not actually know their number until something forces them to find out.</P>
      <H2>How to know your number without listing</H2>
      <P>We are Nate and Taylor. We buy Orange County homes.</P>
      <P>When a long-tenured owner sends us their address, we run three pieces of math. The current market value with recent comparable sales. The cost of bringing the home to listing condition. And what a fair cash offer looks like off both.</P>
      <P>All three on one page. No pitch. No pressure.</P>
      <P>You will have your real number in twenty-four hours.</P>
      <P>If the number works for the life you want next, you pick the closing date. If it does not, you will still know what you are sitting on.</P>
      <ContactCTA
        phoneDisplay={config.phoneDisplay}
        phoneHref={config.phoneHref}
        smsKeyword="GET OFFER"
        heading="Ready to see your number?"
        subheading="Text or call. Either reaches Nate and Taylor directly."
      />
    </ArticleShell>
  )
}
