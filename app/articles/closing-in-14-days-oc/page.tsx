import { ArticleShell, H2, P, ArticleImage } from "@/components/article/article-shell"
import { ContactCTA } from "@/components/article/contact-cta"
import config from "@/lib/config"

export const metadata = {
  title: "Closing In 14 Days On An Orange County House: How It Actuall | OC Home Buyers",
  description: "How a 14-day cash close on an Orange County house actually works, day by day, with no surprises.",
}

export default function Page() {
  return (
    <ArticleShell
      title="Closing In 14 Days On An Orange County House: How It Actually Works"
      dek="A fourteen-day cash close sounds aggressive until you see the actual calendar. Here is what each of those fourteen days looks like in real life."
      companyName={config.companyName}
    >
      <P>Most homeowners hear fourteen-day close and assume it means corners get cut.</P>
      <P>That is the fair instinct. The standard traditional close in California runs thirty to sixty days. A fourteen-day close that is not done well leaves problems behind that show up months later.</P>
      <P>But a fourteen-day close done correctly is not faster because it skips steps. It is faster because the buyer is paying cash, the contracts are simple, and the calendar is not waiting on anybody else.</P>
      <H2>What the calendar actually looks like</H2>
      <P>Day one. You and we agree to a number. We sign a one-page purchase agreement. You name the closing date you want.</P>
      <P>Day two to four. The title company opens escrow. Title runs the preliminary title report. Any liens or judgments against the property surface here.</P>
      <P>Day five to nine. We do a single walk-through if we have not done one already. The lender side does not exist because there is no lender. The appraisal does not exist because there is no appraisal.</P>
      <P>Day ten to twelve. Escrow drafts the closing statement. You and we review and sign final paperwork.</P>
      <P>Day thirteen. Funds are wired to escrow.</P>
      <P>Day fourteen. Recorded with the county. The wire hits your account.</P>
      <ArticleImage
        src="/images/adv-handshake.jpg"
        alt="Title officer reviewing the closing statement."
        caption="Title officer reviewing the closing statement."
      />
      <H2>What never happens in a fourteen-day close</H2>
      <P>No appraisal contingency, because there is no lender requiring one.</P>
      <P>No financing contingency, because there is no financing.</P>
      <P>No buyer asking for repair credits after the inspection, because the offer was already as-is.</P>
      <P>No staging, no listing photos, no showings, no open houses, no Sunday afternoons spent leaving the house so strangers can walk through it.</P>
      <H2>Why the date is always yours</H2>
      <P>We treat the closing date as yours, not ours.</P>
      <P>If fourteen days is too fast because you need to coordinate a move, we move the closing to thirty. Or sixty. Or ninety.</P>
      <P>If fourteen days is the right speed because you are ready to be done, we make fourteen days work.</P>
      <P>The model only works if the schedule fits your life.</P>
      <P>Send us your address. We will run the cash offer and tell you what a real fourteen-day close on your specific property would look like in twenty-four hours.</P>
      <P>If the number works and the date works, the keys leave your life on the day you choose.</P>
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
