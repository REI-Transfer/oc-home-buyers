"use client"

import { useState } from "react"
import { Play } from "lucide-react"

/**
 * Thank-you YouTube testimonials (client).
 *
 * Seller testimonials from the client's channel (youtube.com/@oc-home-buyers), rendered as
 * click-to-load facades: only the thumbnail loads until a card is clicked, then that card
 * mounts a youtube-nocookie iframe with autoplay. One player at a time (activeId).
 *
 * Shorts are 9:16 (1080x1920), long-form videos are 16:9, so each group gets its own grid.
 * Names come from the video titles. Brand and explainer videos on the channel are left out.
 *
 * NOTE: do NOT import "@/lib/config" here -- this is a client component. Branding is
 * passed in as props from the server page.
 */

interface Testimonial {
  videoId: string
  name: string
}

// Newest first.
const SHORTS: Testimonial[] = [
  { videoId: "r8r0SA2WvDA", name: "Paul" },
  { videoId: "UrS2ozLX3as", name: "Virginia & Steven" },
]

const VIDEOS: Testimonial[] = [
  { videoId: "M0waeNH8z1A", name: "Larry" },
  { videoId: "lidLz-VQJxc", name: "Mark" },
  { videoId: "6Eb6MJqnfgU", name: "Chris" },
  { videoId: "m3atVqGl-dQ", name: "Jill" },
  { videoId: "hoO656I0O7s", name: "Stefanie" },
]

function Thumb({ videoId }: { videoId: string }) {
  // maxresdefault exists for every video above; hqdefault is the fallback if one is removed.
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)
  return (
    <img
      src={src}
      onError={() => setSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

function TestimonialCard({
  t,
  aspect,
  active,
  onPlay,
  accentColor,
}: {
  t: Testimonial
  aspect: string
  active: boolean
  onPlay: () => void
  accentColor: string
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className={`relative w-full overflow-hidden bg-black ${aspect}`}>
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${t.videoId}?autoplay=1&rel=0&playsinline=1`}
            title={`${t.name} testimonial`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={onPlay}
            aria-label={`Play ${t.name}'s testimonial`}
            className="group absolute inset-0 h-full w-full"
          >
            <Thumb videoId={t.videoId} />
            <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
            <span
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-transform group-hover:scale-105"
              style={{ backgroundColor: accentColor }}
            >
              <Play className="ml-0.5 h-6 w-6" style={{ fill: "currentColor" }} />
            </span>
          </button>
        )}
      </div>
      <figcaption className="px-4 py-3 text-sm font-semibold text-gray-900">{t.name}</figcaption>
    </figure>
  )
}

interface YouTubeTestimonialsProps {
  companyName: string
  accentColor: string
}

export function YouTubeTestimonials({ companyName, accentColor }: YouTubeTestimonialsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div>
      <div className="text-center mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
          Video Testimonials
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Hear it from homeowners who sold to {companyName}
        </h2>
      </div>

      <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
        {SHORTS.map((t) => (
          <TestimonialCard
            key={t.videoId}
            t={t}
            aspect="aspect-[9/16]"
            active={activeId === t.videoId}
            onPlay={() => setActiveId(t.videoId)}
            accentColor={accentColor}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VIDEOS.map((t) => (
          <TestimonialCard
            key={t.videoId}
            t={t}
            aspect="aspect-video"
            active={activeId === t.videoId}
            onPlay={() => setActiveId(t.videoId)}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  )
}
