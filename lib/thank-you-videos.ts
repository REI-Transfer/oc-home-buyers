/**
 * lib/thank-you-videos.ts -- Static manifest for the /thank-you video gallery.
 *
 * Ported from becca-and-drew-buy-homes / jenkins-homebuyers, with one deliberate deviation:
 * `src` holds the FULL Vercel Blob URL exactly as delivered (percent-encoding included). The
 * references store a raw pathname and rebuild the URL from NEXT_PUBLIC_BLOB_BASE_URL; these
 * blobs carry a random suffix in their real URLs, so a rebuilt URL would be a dead link.
 * Do not "fix" %20 / %22 / %27 or anything that looks like a typo in a filename.
 *
 * Flat ordered list, no categories. VIDEOS[0] is the intro ("You're Confirmed"), shown above
 * the accordion; the rest are one collapsible card each, in this order.
 */

export interface VideoEntry {
  title: string
  /** Absolute Blob URL, verbatim. The gallery appends #t=0.1 at render time. */
  src: string
}

export const VIDEOS: VideoEntry[] = [
  {
    title: "You're Confirmed. Watch This Before Your Call.",
    src: "https://wpjtb1owrkxrkc6h.public.blob.vercel-storage.com/%22You%27re%20Confirmed.%20Watch%20This%20Before%20Your%20Call.%22.mp4",
  },
  {
    title: "Who Are We and Why Should You Trust Us?",
    src: "https://wpjtb1owrkxrkc6h.public.blob.vercel-storage.com/Video%201%20-%20Who%20Are%20We%20and%20Why%20Should%20You%20Trust%20Us%3F.mp4",
  },
  {
    title: "What Other Homeowners Are Saying",
    src: "https://wpjtb1owrkxrkc6h.public.blob.vercel-storage.com/Video%202%20-%20%22What%20Other%20Homeowners%20Are%20Saying.mp4",
  },
  {
    title: "How We Calculate Your Offer",
    src: "https://wpjtb1owrkxrkc6h.public.blob.vercel-storage.com/Video%203%20-%20How%20We%20Calculate%20Your%20Cash%20Offer%20%282nd%20take%29.mp4",
  },
  {
    title: "What If I Don't Like the Offer?",
    src: "https://wpjtb1owrkxrkc6h.public.blob.vercel-storage.com/Video%204%20-%20What%20If%20I%20Don%27t%20Like%20the%20Offer%3F.mp4",
  },
  {
    title: "What We WON'T Buy (And We'll Tell You Upfront)",
    src: "https://wpjtb1owrkxrkc6h.public.blob.vercel-storage.com/Video%205%20-%20What%20We%20WON%27T%20Buy%20%28And%20We%27ll%20Tell%20You%20Upfront%29.mp4",
  },
  {
    title: "Our Offer vs. Listing With a Realtor",
    src: "https://wpjtb1owrkxrkc6h.public.blob.vercel-storage.com/Video%207%20-%20Cash%20Offer%20vs.%20Listing%20With%20a%20Realtor.mp4",
  },
  {
    title: "3 Things to Have Ready Before Our Call",
    src: "https://wpjtb1owrkxrkc6h.public.blob.vercel-storage.com/Video%208%20-%203%20Things%20to%20Have%20Ready%20Before%20Our%20Call.mp4",
  },
]
