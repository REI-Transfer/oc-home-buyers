// Single source of truth for the advertorial article library.
// Used by the /articles index and the "keep reading" loop at the bottom of every article.

export interface ArticleMeta {
  slug: string // full path, e.g. "/articles/whats-the-catch"
  title: string
  teaser: string
  image: string
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "/articles/what-happens-next",
    title:
      "What Really Happens After You Ask for a Cash Offer (Most Homeowners Are Surprised)",
    teaser:
      "A calm, step-by-step walk-through of the process, so there are no surprises and no pressure.",
    image: "/images/adv-keys-couple.jpg",
  },
  {
    slug: "/articles/the-truth-about-lowball-offers",
    title:
      "The Truth About 'Lowball' Cash Offers, From the People Who Actually Make Them",
    teaser:
      "How a fair cash offer is really calculated, and why the net you keep matters more than the sticker price.",
    image: "/images/adv-handshake.jpg",
  },
  {
    slug: "/articles/real-buyer-vs-tire-kicker",
    title:
      "How to Tell a Real Local Home Buyer From a Tire-Kicker in About 5 Minutes",
    teaser:
      "A simple five-point checklist to vet any cash buyer and protect yourself before you sign anything.",
    image: "/images/adv-local-team.jpg",
  },
  {
    slug: "/articles/cash-offer-vs-agent",
    title:
      "Cash Offer or List With an Agent? An Honest Look at What You Actually Walk Away With",
    teaser:
      "A fair side-by-side of both routes, so you choose the one that fits your home and your life.",
    image: "/images/adv-strangers-open-house.jpg",
  },
  {
    slug: "/articles/whats-the-catch",
    title:
      "What's The Catch With A Cash Offer? An Honest Look At Why It Sounds Too Good To Be True",
    teaser:
      "No repairs, no fees, no showings. Here is where the money actually comes from, and what the real trade-off is.",
    image: "/images/adv-couple-kitchen.jpg",
  },
  {
    slug: "/articles/fix-up-before-selling",
    title:
      "Should You Fix Up Your House Before You Sell It? The Math Most Homeowners Get Wrong",
    teaser:
      "The instinct is to renovate first. Here is why fixing up often costs more than it earns you back.",
    image: "/images/adv-homeowner-repair.jpg",
  },
  {
    slug: "/articles/real-cash-buyer-vs-scam",
    title:
      "How To Tell A Real Cash Buyer From A Scam: 5 Questions That Expose The Difference",
    teaser:
      "Five plain questions any legitimate buyer will answer without flinching, so you can protect yourself.",
    image: "/images/adv-phone-vetting.jpg",
  },
  {
    slug: "/articles/wait-for-better-market",
    title:
      "Is Now A Bad Time To Sell? Why Waiting For A Better Market Can Quietly Cost You",
    teaser:
      "Holding out for a higher price feels patient. Here is the price tag the waiting itself carries.",
    image: "/images/adv-couple-window.jpg",
  },
  {
    slug: "/articles/sell-it-yourself",
    title:
      "Why Not Just Sell It Yourself And Skip The Middleman? The Hidden Cost Of Going It Alone",
    teaser:
      "Selling on your own sounds like keeping every dollar. Here is what it actually takes, and where it goes sideways.",
    image: "/images/adv-paperwork-alone.jpg",
  },
  {
    slug: "/articles/the-quiet-truth",
    title:
      "The Quiet Truth About Selling An Orange County Home You\'ve Owned For 20 Years",
    teaser:
      "The number on Zillow is not the number you walk away with. Here is what the math actually looks like, and the other option most homeowners never hear about.",
    image: "/images/adv-keys-couple.jpg",
  },
  {
    slug: "/articles/oc-senior-equity-now",
    title:
      "What Your Orange County Home Is Actually Worth, If You Are 55 Or Older",
    teaser:
      "Orange County owners 55+ are sitting on record-level equity. Most have never seen the real number on one page. Here is how to see yours.",
    image: "/images/adv-couple-window.jpg",
  },
  {
    slug: "/articles/inheriting-an-oc-home",
    title:
      "Inheriting An Orange County Home In 2026: The Timeline You Wish Someone Had Explained",
    teaser:
      "The twelve-month calendar nobody hands you when you inherit an Orange County home, and how to keep the equity from quietly leaking away.",
    image: "/images/adv-paperwork-alone.jpg",
  },
  {
    slug: "/articles/oc-property-tax-creep",
    title:
      "Why Your Orange County Property Tax Bill Keeps Quietly Growing, Even After The House Is Paid Off",
    teaser:
      "Your property tax bill is still going up, even after Prop 13. Here is where the extra is coming from and what it costs over a decade.",
    image: "/images/adv-numbers-table.jpg",
  },
  {
    slug: "/articles/pre-2014-oc-equity",
    title:
      "What Pre-2014 Orange County Homes Are Sitting On, And Why It Does Not Show Up On Zillow",
    teaser:
      "Pre-2014 OC homes carry a different equity story than the rest of the market. Here is what that story looks like in real numbers.",
    image: "/images/adv-home-exterior.jpg",
  },
  {
    slug: "/articles/owned-twenty-years-oc",
    title:
      "What \"Owned The House For 20 Years\" Really Means In Orange County Equity Terms",
    teaser:
      "Twenty years of OC ownership is a financial position the rest of the market does not have. Here is what that math actually looks like on paper.",
    image: "/images/adv-couple-kitchen.jpg",
  },
  {
    slug: "/articles/closing-in-14-days-oc",
    title:
      "Closing In 14 Days On An Orange County House: How It Actually Works",
    teaser:
      "A fourteen-day close sounds aggressive until you see the actual calendar laid out. Here is what each day looks like, with no theater.",
    image: "/images/adv-handshake.jpg",
  },
]
