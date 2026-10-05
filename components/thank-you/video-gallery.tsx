"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { VIDEOS, type VideoEntry } from "@/lib/thank-you-videos"

/**
 * Thank-you video gallery (client).
 *
 * File layout ported from becca-and-drew-buy-homes (lib/thank-you-videos.ts manifest +
 * this client component, mounted from app/thank-you/page.tsx). Layout ported from
 * joe-homebuyer-of-the-carolinas: the intro video sits ABOVE the accordion as its own
 * player; every other video is its own collapsible card (useState + rotating ChevronDown).
 *
 * - A collapsed card does NOT mount its <video>, so nothing downloads until it is opened.
 * - All files are 1920x1080, so every player box is 16:9 (aspect-video).
 * - #t=0.1 is appended at render time so a paused player shows the first frame instead of
 *   a black box; the manifest URLs stay verbatim.
 *
 * NOTE: do NOT import "@/lib/config" here -- this is a client component. Branding is
 * passed in as props from the server page.
 */

const withFirstFrame = (src: string) => `${src}#t=0.1`

function VideoAccordionCard({ video, index, accentColor }: { video: VideoEntry; index: number; accentColor: string }) {
  // The <video> is mounted ONLY while open, so an unexpanded card downloads nothing.
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="flex items-center gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {index + 1}
          </span>
          <span className="text-base font-medium text-gray-900">{video.title}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <video
              src={withFirstFrame(video.src)}
              controls
              preload="metadata"
              playsInline
              className="block h-full w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface VideoGalleryProps {
  accentColor: string
}

export function VideoGallery({ accentColor }: VideoGalleryProps) {
  const [intro, ...rest] = VIDEOS
  if (!intro) return null

  return (
    <div>
      {/* Intro: the one they must see, above the accordion. */}
      <h2 className="mb-3 text-center text-xl font-bold text-gray-900">{intro.title}</h2>
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
        <video
          src={withFirstFrame(intro.src)}
          controls
          preload="metadata"
          playsInline
          className="block h-full w-full object-contain"
        />
      </div>

      {/* Everything else: one collapsible card per video. */}
      {rest.length > 0 && (
        <div className="mt-6 space-y-3">
          {rest.map((video, idx) => (
            <VideoAccordionCard key={video.src} video={video} index={idx} accentColor={accentColor} />
          ))}
        </div>
      )}
    </div>
  )
}
