import { ArticleShell, H2, P, ArticleImage } from "@/components/article/article-shell"
import { ContactCTA } from "@/components/article/contact-cta"
import config from "@/lib/config"

export const metadata = {
  title: "Why Your Orange County Property Tax Bill Keeps Quietly Growi | OC Home Buyers",
  description: "Why Orange County property tax bills keep growing under Prop 13. The hidden assessments and what they add up to over time.",
}

export default function Page() {
  return (
    <ArticleShell
      title="Why Your Orange County Property Tax Bill Keeps Quietly Growing, Even After The House Is Paid Off"
      dek="Prop 13 limits the rate. It does not limit everything. Here is where the rest of the bill is coming from and why it matters for owners on fixed income."
      companyName={config.companyName}
    >
      <P>If you have owned your Orange County home for more than ten years, you probably opened your tax bill last fall and felt something close to confusion.</P>
      <P>The house is paid off. The Prop 13 base is locked. So how is the number still going up every year.</P>
      <P>You are not wrong to ask. And the answer is not in the part of the bill anyone ever explains.</P>
      <H2>Prop 13 only covers part of the bill</H2>
      <P>Prop 13 caps your base property tax at one percent of your home&apos;s assessed value, with assessment growth limited to two percent per year.</P>
      <P>That part is real. That part is the famous part.</P>
      <P>But the line you are paying every year is not just the base. It is the base plus voter-approved bonds, plus special assessments, plus Mello-Roos in many newer OC subdivisions, plus parcel taxes that fund schools, parks, fire, water districts, and local infrastructure.</P>
      <P>Those are not capped by Prop 13. Some of them grow with inflation. Some of them are renewed by ballot every cycle, layering on top of the previous one.</P>
      <ArticleImage
        src="/images/adv-numbers-table.jpg"
        alt="Where the property tax bill actually comes from."
        caption="The part of the bill nobody explains in plain English."
      />
      <H2>Why the squeeze hits hardest at 65 plus</H2>
      <P>If you are retired or close to retired, your housing costs are quietly compounding while your fixed income is not.</P>
      <P>Insurance premiums in Orange County are up nineteen percent in eighteen months. HOA dues for senior-friendly communities are up double digits. Property tax bills for long-owned homes are up four to seven percent year over year, even though Prop 13 caps the base.</P>
      <P>On a one point three million dollar home in OC, the total annual cost of just owning the property, no mortgage, runs around eighteen to twenty-two thousand dollars per year in 2026.</P>
      <P>Across a five-year hold, that is roughly a hundred thousand dollars of equity quietly leaving the house through the side door.</P>
      <H2>The other option</H2>
      <P>Cashing out before the next assessment cycle is one of the cleanest ways to stop the meter.</P>
      <P>We are Nate and Taylor. We buy homes in Orange County. We close in twenty-one days on average, on a date you pick.</P>
      <P>If the rising-cost-of-holding question has been on your mind, send us the address.</P>
      <P>We will run the carrying number against a written cash offer, side by side, in twenty-four hours.</P>
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
