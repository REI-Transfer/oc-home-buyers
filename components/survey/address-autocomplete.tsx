"use client"

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

export interface AddressDetails {
  formattedAddress: string
  lat?: number
  lng?: number
  state?: string
  city?: string
  county?: string
}

export interface ServiceArea {
  id: string
  centerLat: number
  centerLng: number
  radiusMiles: number
}

/**
 * Handle a parent can hold to resolve TYPED text (no dropdown pick) into a real
 * address, e.g. from a "Continue" button. resolveTyped() runs the exact same
 * select path as tapping a suggestion and returns false when nothing was found.
 */
export interface AddressResolver {
  resolveTyped: () => Promise<boolean>
  focus: () => void
}

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  onSelect: (address: string, details: AddressDetails) => void
  onOutOfArea?: (address: string) => void
  /** Enter / "Go" pressed on typed text that Google could not match. */
  onNotFound?: () => void
  resolverRef?: Ref<AddressResolver>
  serviceAreas?: ServiceArea[]
  placeholder?: string
}

declare global {
  interface Window {
    google: typeof google
    initGooglePlaces: () => void
  }
}

function haversineDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function isInServiceArea(lat: number, lng: number, areas: ServiceArea[]): boolean {
  if (!areas || areas.length === 0) return true // no restriction if no areas configured
  // Defensive: ignore malformed entries (e.g. ["StateName"] from the onboarding tool)
  // that have no numeric center, so a bad SERVICE_AREAS value never blocks selection.
  const valid = areas.filter(a => typeof a?.centerLat === "number" && typeof a?.centerLng === "number" && typeof a?.radiusMiles === "number")
  if (valid.length === 0) return true
  return valid.some(area => haversineDistanceMiles(lat, lng, area.centerLat, area.centerLng) <= area.radiusMiles)
}

export interface BoundsLiteral {
  south: number
  west: number
  north: number
  east: number
}

function toNum(v: unknown): number | undefined {
  const n = typeof v === "string" ? Number(v) : (v as number)
  return typeof n === "number" && Number.isFinite(n) ? n : undefined
}

function circlesToBounds(circles: { lat: number; lng: number; radiusMiles: number }[]): BoundsLiteral | null {
  if (circles.length === 0) return null
  let south = 90, north = -90, west = 180, east = -180
  for (const c of circles) {
    const latPad = c.radiusMiles / 69 // ~69 miles per degree of latitude
    const cosLat = Math.cos((c.lat * Math.PI) / 180)
    const lngPad = c.radiusMiles / (69 * (Math.abs(cosLat) > 1e-6 ? cosLat : 1e-6))
    south = Math.min(south, c.lat - latPad)
    north = Math.max(north, c.lat + latPad)
    west = Math.min(west, c.lng - lngPad)
    east = Math.max(east, c.lng + lngPad)
  }
  return { south, west, north, east }
}

function parseCircles(list: unknown): { lat: number; lng: number; radiusMiles: number }[] {
  if (!Array.isArray(list)) return []
  const out: { lat: number; lng: number; radiusMiles: number }[] = []
  for (const c of list) {
    if (!c || typeof c !== "object") continue
    const o = c as Record<string, unknown>
    const lat = toNum(o.centerLat ?? o.lat ?? o.latitude)
    const lng = toNum(o.centerLng ?? o.lng ?? o.longitude)
    const radiusMiles = toNum(o.radiusMiles ?? o.radius_miles ?? o.radius)
    if (lat === undefined || lng === undefined || radiusMiles === undefined) continue
    out.push({ lat, lng, radiusMiles })
  }
  return out
}

/**
 * The box Google suggestions are kept inside. First match wins:
 *   1. NEXT_PUBLIC_ADDRESS_BOUNDS = "south,west,north,east"
 *   2. the service-area circles this form fences with (serviceAreas prop)
 *   3. NEXT_PUBLIC_SERVICE_AREAS circles
 *   4. null = no restriction (nationwide)
 */
export function getAddressBounds(serviceAreas: ServiceArea[] = []): BoundsLiteral | null {
  const raw = (process.env.NEXT_PUBLIC_ADDRESS_BOUNDS || "").trim()
  if (raw) {
    const [south, west, north, east] = raw.split(",").map(v => (v.trim() ? toNum(v.trim()) : undefined))
    if (
      south !== undefined && west !== undefined && north !== undefined && east !== undefined &&
      south < north && west < east
    ) {
      return { south, west, north, east }
    }
  }
  const fromProp = circlesToBounds(parseCircles(serviceAreas))
  if (fromProp) return fromProp
  try {
    return circlesToBounds(parseCircles(JSON.parse(process.env.NEXT_PUBLIC_SERVICE_AREAS || "[]")))
  } catch {
    return null
  }
}

// Singleton loader: the Google Maps script must load EXACTLY ONCE per page.
// Multiple AddressAutocomplete instances (sticky bar + form + modal) each
// injecting their own <script> makes Places load multiple times -> "included
// multiple times" error -> autocomplete breaks page-wide. This shared promise
// guarantees a single load; every instance awaits it and binds when ready.
let googleMapsPromise: Promise<void> | null = null
function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (window.google?.maps?.places) return Promise.resolve()
  if (googleMapsPromise) return googleMapsPromise
  googleMapsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-google-maps]")
    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")))
      if (window.google?.maps?.places) resolve()
      return
    }
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.setAttribute("data-google-maps", "true")
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Google Maps failed to load"))
    document.head.appendChild(script)
  })
  return googleMapsPromise
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  onOutOfArea,
  onNotFound,
  resolverRef,
  serviceAreas = [],
  placeholder = "Start typing your address...",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  // Latest props, so the Google listener (bound once) never calls a stale handler.
  const latest = useRef({ onChange, onSelect, onOutOfArea, onNotFound, serviceAreas })
  latest.current = { onChange, onSelect, onOutOfArea, onNotFound, serviceAreas }
  // Guards: one typed-text lookup at a time, and never select the same place
  // twice in a row (a double select would skip the next form step).
  const inflightRef = useRef<Promise<boolean> | null>(null)
  const lastHandledRef = useRef({ address: "", at: 0 })

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then(() => {
        if (cancelled) return
        setIsLoaded(true)
        initAutocomplete()
      })
      .catch(() => {
        /* key/network failure — input still works as a plain text field */
      })

    return () => {
      cancelled = true
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  const googleBounds = (): google.maps.LatLngBounds | undefined => {
    const b = getAddressBounds(latest.current.serviceAreas)
    return b ? new google.maps.LatLngBounds({ lat: b.south, lng: b.west }, { lat: b.north, lng: b.east }) : undefined
  }

  // The one select path: dropdown tap, Enter/Go and the Continue button all end here.
  const handlePlace = (place: google.maps.places.PlaceResult) => {
    if (!place.formatted_address) return
    const { onChange, onSelect, onOutOfArea, serviceAreas } = latest.current

    const now = Date.now()
    if (lastHandledRef.current.address === place.formatted_address && now - lastHandledRef.current.at < 1500) return
    lastHandledRef.current = { address: place.formatted_address, at: now }

    let state = ""
    let city = ""
    let county = ""
    let lat: number | undefined
    let lng: number | undefined

    place.address_components?.forEach((component) => {
      if (component.types.includes("administrative_area_level_1")) state = component.short_name
      if (component.types.includes("locality")) city = component.long_name
      if (component.types.includes("administrative_area_level_2")) county = component.long_name
    })

    if (place.geometry?.location) {
      lat = place.geometry.location.lat()
      lng = place.geometry.location.lng()
    }

    const details: AddressDetails = { formattedAddress: place.formatted_address, lat, lng, state, city, county }

    // Service area validation
    if (serviceAreas.length > 0 && lat !== undefined && lng !== undefined) {
      if (!isInServiceArea(lat, lng, serviceAreas)) {
        onChange(place.formatted_address)
        onOutOfArea?.(place.formatted_address)
        return
      }
    }

    onChange(place.formatted_address)
    onSelect(place.formatted_address, details)
  }

  // Typed text with no dropdown pick: take Google's first prediction, fetch its
  // details, then run the same select path as a tap. False = nothing found.
  const resolveTyped = (text?: string): Promise<boolean> => {
    const input = (text ?? inputRef.current?.value ?? "").trim()
    if (!input) return Promise.resolve(false)
    if (inflightRef.current) return inflightRef.current
    inflightRef.current = lookupAndSelect(input).finally(() => { inflightRef.current = null })
    return inflightRef.current
  }

  const lookupAndSelect = async (input: string): Promise<boolean> => {
    try {
      await loadGoogleMaps()
      if (!window.google?.maps?.places) return false
      const bounds = googleBounds()
      const sessionToken = new google.maps.places.AutocompleteSessionToken()
      const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve) => {
        new google.maps.places.AutocompleteService().getPlacePredictions(
          {
            input,
            componentRestrictions: { country: "us" },
            types: ["address"],
            sessionToken,
            ...(bounds ? { bounds } : {}),
          },
          (results, status) => resolve(status === google.maps.places.PlacesServiceStatus.OK && results ? results : [])
        )
      })
      if (predictions.length === 0) return false
      const place = await new Promise<google.maps.places.PlaceResult | null>((resolve) => {
        new google.maps.places.PlacesService(document.createElement("div")).getDetails(
          {
            placeId: predictions[0].place_id,
            fields: ["formatted_address", "address_components", "geometry"],
            sessionToken,
          },
          (result, status) => resolve(status === google.maps.places.PlacesServiceStatus.OK ? result : null)
        )
      })
      if (!place?.formatted_address) return false
      inputRef.current?.blur() // close the phone keyboard
      handlePlace(place)
      return true
    } catch {
      return false
    }
  }

  useImperativeHandle(resolverRef, () => ({
    resolveTyped: () => resolveTyped(),
    focus: () => inputRef.current?.focus(),
  }))

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return

    // Keep suggestions inside the service area (see getAddressBounds).
    const bounds = googleBounds()

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "us" },
      types: ["address"],
      fields: ["formatted_address", "address_components", "geometry"],
      ...(bounds ? { bounds, strictBounds: true } : {}),
    })

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace()
      if (!place) return
      if (place.geometry && place.formatted_address) {
        handlePlace(place)
        return
      }
      // Enter / "Go" without picking a suggestion: Google hands back only the
      // typed text in place.name. Resolve it instead of silently doing nothing.
      const typed = (place.name || inputRef.current?.value || "").trim()
      if (!typed) return
      void resolveTyped(typed).then((found) => {
        if (!found) latest.current.onNotFound?.()
      })
    })
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <MapPin className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 pl-10 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
      />
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--accent)]" />
        </div>
      )}
    </div>
  )
}
