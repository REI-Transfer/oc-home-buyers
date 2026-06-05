import { ArticleShell, H2, P, ArticleImage } from "@/components/article/article-shell"
import { ContactCTA } from "@/components/article/contact-cta"
import config from "@/lib/config"

export const metadata = {
  title: "What Your Orange County Home Is Actually Worth, If You Are 5 | OC Home Buyers",
  description: "Orange County homeowners 55 and older are sitting on more equity than they realize. Here is how the real number is calculated.",
}

export default function Page() {
  return (
    <ArticleShell
      title="What Your Orange County Home Is Actually Worth, If You Are 55 Or Older"
      dek="Most owners over 55 in Orange County are sitting on more equity than they think, and almost none of them have ever seen the real number written on one page."
      companyName={config.companyName}
    >
      <P>If you are over 55 and you have owned your Orange County home for more than ten years, you are sitting on more equity than you probably believe.</P>
      <P>Not because we are flattering you. Because that is what the data actually says.</P>
      <P>Orange County home values are at the highest level they have ever been. Property values have moved more in the last five years than they did in the prior fifteen combined.</P>
      <P>And the homeowners who have owned the longest, the ones now in their late fifties, sixties, seventies, are the ones holding the most of that gain.</P>
      <H2>Why the number never feels real</H2>
      <P>Most of the equity in a long-owned Orange County home sits on paper.</P>
      <P>Zillow gives you a guess. The county tax assessor gives you a different guess. The neighbor who sold last spring gives you the only number that feels real, except their house was nothing like yours.</P>
      <P>So most owners never actually see their number written on one page. They guess, they wait, and they hope they get a chance to find out one day.</P>
      <ArticleImage
        src="/images/adv-senior-cautious.jpg"
        alt="Quiet morning. Same kitchen. A different decade."
        caption="Same kitchen. A different decade."
      />
      <H2>How a real cash buyer arrives at your number</H2>
      <P>We are Nate and Taylor. We live in Orange County. We buy homes here.</P>
      <P>When a senior homeowner asks us what their home is worth, we do not start with a Zillow screenshot. We start with three numbers.</P>
      <P>First, the after-repair value. What the home would sell for once it is fixed up and listed traditionally.</P>
      <P>Second, the cost of the repairs. The roof, the bathrooms, the HVAC, the kitchen. Real estimates, not guesses.</P>
      <P>Third, the cost we will eat while we carry the house until we resell. Insurance, property tax, utilities, financing.</P>
      <P>We subtract those from the after-repair value, take a fixed margin to keep the lights on, and the number that is left is what we pay you.</P>
      <P>Cash. In your account. On a date you pick.</P>
      <H2>Why this matters more now than later</H2>
      <P>Insurance premiums in Orange County have moved up nineteen percent in eighteen months. Property taxes on long-owned homes are climbing every year even with Prop 13 protection.</P>
      <P>The cost of holding a house you are no longer using is not flat. It is compounding.</P>
      <P>If you have wondered what your home is actually worth in cash today, the only way to know is to see the number on a page.</P>
      <P>Send us your address. You will have a written cash offer in twenty-four hours.</P>
      <P>If the number works for the life you want next, you pick the closing date. If it does not, no hard feelings.</P>
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
