import { ArticleShell, H2, P, ArticleImage } from "@/components/article/article-shell"
import { ContactCTA } from "@/components/article/contact-cta"
import config from "@/lib/config"

export const metadata = {
  title: "Inheriting An Orange County Home In 2026: The Timeline You W | OC Home Buyers",
  description: "Inheriting an Orange County home: what the timeline actually looks like and how to protect the equity in the first 12 months.",
}

export default function Page() {
  return (
    <ArticleShell
      title="Inheriting An Orange County Home In 2026: The Timeline You Wish Someone Had Explained"
      dek="Inheriting a house in Orange County comes with a calendar nobody hands you. Here is what the next twelve months actually look like, and how to keep the equity intact."
      companyName={config.companyName}
    >
      <P>When you inherit a house in Orange County, the first thing you realize is that nobody hands you a calendar.</P>
      <P>There is no checklist. There is no welcome packet. There is a property tax bill addressed to a person who is no longer here, a roof that has been quietly failing for a decade, and a probate court timeline that nobody walked you through.</P>
      <P>And under all of it, there is a quiet meter running.</P>
      <H2>The first thirty days</H2>
      <P>If your loved one passed in California, you usually have one of three paths to clear title.</P>
      <P>Full probate. A small estate affidavit. Or a transfer-on-death deed if one was filed.</P>
      <P>Most Orange County estates we see go through full probate, because the home alone exceeds the small estate threshold.</P>
      <P>Probate in OC currently takes nine to fourteen months. During that window, the house cannot be officially sold. But the bills still arrive.</P>
      <ArticleImage
        src="/images/adv-paperwork-alone.jpg"
        alt="Estate paperwork on the kitchen table."
        caption="Estate paperwork on the kitchen table."
      />
      <H2>The quiet meter</H2>
      <P>Property tax does not pause for probate.</P>
      <P>Homeowners insurance does not pause for probate. In fact, most carriers cancel the policy within sixty to ninety days of the owner&apos;s death, leaving the heirs to buy a high-premium vacant home policy if the house is empty.</P>
      <P>Utilities, lawn maintenance, any HOA dues. They all keep arriving. To nobody.</P>
      <P>On an average Orange County estate home, the cost of carrying the property during a fourteen-month probate runs somewhere between twenty-two and thirty-eight thousand dollars.</P>
      <P>That money comes out of the eventual equity. Most heirs never see it because they pay it in pieces, month by month, out of estate accounts.</P>
      <H2>What changes if you can sell as-is</H2>
      <P>A serious cash buyer can begin the purchase the moment letters testamentary are issued, even if probate has not formally closed.</P>
      <P>We coordinate directly with the probate attorney. We work to your timeline, not to ours.</P>
      <P>No staging. No repair list. No realtor walking strangers through the house your loved one lived in.</P>
      <P>We have closed inherited Orange County homes in twenty-one to twenty-eight days from the date of contract.</P>
      <P>If you are an executor or trustee for an OC property and you want to understand what selling it as-is would look like, send us the address.</P>
      <P>We will run the math against the carrying cost of waiting, and you will know in twenty-four hours what the cleanest path forward looks like.</P>
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
