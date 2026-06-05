import { ArticleShell, H2, P, ArticleImage } from "@/components/article/article-shell"
import { ContactCTA } from "@/components/article/contact-cta"
import config from "@/lib/config"

export const metadata = {
  title: "What Pre-2014 Orange County Homes Are Sitting On, And Why It | OC Home Buyers",
  description: "What pre-2014 Orange County homes are sitting on in real equity terms, and how to actually see your number.",
}

export default function Page() {
  return (
    <ArticleShell
      title="What Pre-2014 Orange County Homes Are Sitting On, And Why It Does Not Show Up On Zillow"
      dek="Homes built or bought before 2014 in Orange County carry a different equity story than the rest of the market. Here is what that story looks like in real numbers."
      companyName={config.companyName}
    >
      <P>If your Orange County home was built before 2014, or you bought it before 2014, the equity sitting under your address is different from what Zillow shows.</P>
      <P>Different is not better or worse. It is just calculated differently. And almost nobody walks you through the difference.</P>
      <H2>The two equity stories in OC right now</H2>
      <P>Homes built after 2014 in Orange County are usually in newer master-planned communities. Newer construction. Lower deferred maintenance. Higher HOA dues.</P>
      <P>Homes built before 2014 are usually the established neighborhoods. Older roofs. Older systems. Lower HOA dues, often none.</P>
      <P>The Zillow estimate treats those two houses the same way. They are not the same.</P>
      <ArticleImage
        src="/images/adv-home-exterior.jpg"
        alt="A 1970s ranch in central OC."
        caption="Built in 1972. Owned since 1995. Real OC equity."
      />
      <H2>Where the hidden equity actually sits</H2>
      <P>On a pre-2014 OC home, the largest piece of your equity is not the cosmetic value of the kitchen or the bathrooms. It is the land.</P>
      <P>In most of OC, the land alone is now worth more than the original purchase price of the entire property. Sometimes twice as much.</P>
      <P>A buyer planning to renovate or rebuild is buying that land. A buyer wanting move-in ready is paying for it indirectly.</P>
      <P>When a fair cash offer is built, the offer is built off that land value plus what the structure adds back, minus the cost of bringing it up to current standards.</P>
      <P>Most owners have never seen those three numbers separated on a single page. They see a single Zillow estimate that does not.</P>
      <H2>What this means if you are thinking about selling</H2>
      <P>If you have lived in your Orange County home since before 2014 and you are starting to think about what selling looks like, the right move is not to guess the number.</P>
      <P>We are Nate and Taylor. We live here. We buy houses here.</P>
      <P>Send us your address. We will pull the recent comp data, the actual repair estimate for the home in its current state, and the land value sitting under it.</P>
      <P>You will have a written cash offer in twenty-four hours, with the math broken out on one page.</P>
      <P>If the number works, you pick the date. If it does not, no hard feelings. You will still know your real number.</P>
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
