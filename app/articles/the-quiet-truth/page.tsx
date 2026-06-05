import { ArticleShell, H2, P, ArticleImage } from "@/components/article/article-shell"
import { ContactCTA } from "@/components/article/contact-cta"
import config from "@/lib/config"

export const metadata = {
  title: "The Quiet Truth About Selling An Orange County Home You've O | OC Home Buyers",
  description: "The quiet truth about what selling an Orange County home actually pays you, and a different way to think about it.",
}

export default function Page() {
  return (
    <ArticleShell
      title="The Quiet Truth About Selling An Orange County Home You&apos;ve Owned For 20 Years"
      dek="The number on Zillow is not the number you walk away with. Here is the math nobody walks through at the kitchen table, and a different way to think about it."
      companyName={config.companyName}
    >
      <P>Most homeowners in Orange County already know their house is worth more than it was ten years ago.</P>
      <P>That part is obvious. The mortgage statement tells you. The neighbors who sold last spring tell you. Zillow tells you.</P>
      <P>But here is what nobody tells you.</P>
      <P>The number on Zillow is not the number you walk away with. Not even close.</P>
      <P>By the time the realtor&apos;s commission comes out, by the time the inspector&apos;s repair list comes out, by the time the buyer&apos;s lender drags closing past sixty days, the cash you actually pocket at closing can be eighty to a hundred thousand dollars less than the listing price.</P>
      <P>Sometimes more. And that is in the version where everything goes right.</P>
      <H2>How most kitchen tables actually look</H2>
      <P>We are Nate and Taylor Looney. We live in Orange County. We buy homes here.</P>
      <P>Last month we sat across the kitchen table from a couple in Fountain Valley.</P>
      <P>They had owned the house since 1994. Their three kids were grown. The roof was original. The bathrooms still had the cultured marble.</P>
      <P>They were tired. Not financially tired. Just tired of fighting a four-bedroom house with two people in it.</P>
      <ArticleImage
        src="/images/adv-numbers-table.jpg"
        alt="Side by side. Realtor route on the left. Cash route on the right."
        caption="The math on paper, not in a pitch."
      />
      <P>Their realtor told them to list at one point one nine, fix the bathrooms, paint everything, stage it, then see what happens.</P>
      <P>That meant three to five months of strangers walking through their living room. It meant somewhere around forty-eight thousand in repairs they did not have lying around. It meant a six percent commission on the back end, plus closing costs they would split with the buyer.</P>
      <P>Best case, after the math, they walk away with about eight hundred and ninety thousand. After almost half a year of waiting.</P>
      <H2>The version where nobody runs an open house</H2>
      <P>We wrote them a cash offer for one point one million flat. No commission. No repair credits.</P>
      <P>They picked their closing date, and we handled the paperwork.</P>
      <P>Three weeks later they had a wire deposit for one point one million dollars and the keys were no longer their problem.</P>
      <P>They did better than the realtor&apos;s best case. By more than two hundred thousand dollars.</P>
      <P>And they did it without a single open house.</P>
      <H2>This is not magic, it is just a different model</H2>
      <P>When we buy a home, the equation looks like this.</P>
      <P>We start with the after-repair value, the price that home would sell for once it is fixed and staged and listed.</P>
      <P>From there we subtract the actual cost of the repairs, the cost we will absorb to carry the house until we resell, and a fixed margin we need to keep the lights on.</P>
      <P>The number that is left is what we pay you.</P>
      <P>We show you that math on a one-page sheet at the kitchen table. There is no negotiation theater.</P>
      <P>If selling the way the world tells you to sell does not fit the life you actually have right now, you have another option.</P>
      <P>It does not require staging, repairs, showings, or strangers in your home.</P>
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
