import { NextResponse } from "next/server"

// Simple in-memory rate limiter (resets on deploy/restart)
const submissionLog = new Map<string, { count: number; firstSubmit: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const window = 60 * 60 * 1000 // 1 hour
  // Max 6 per IP per hour — one user fires both 'early' and 'complete' from the same IP
  const maxSubmissions = 6

  const entry = submissionLog.get(ip)
  if (!entry) {
    submissionLog.set(ip, { count: 1, firstSubmit: now })
    return false
  }

  if (now - entry.firstSubmit > window) {
    submissionLog.set(ip, { count: 1, firstSubmit: now })
    return false
  }

  entry.count++
  return entry.count > maxSubmissions
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      )
    }

    const data = await request.json()
    const stage = data.lead_stage || 'complete'

    // Both stages already carry name/email/phone/address (Stage 1 collects them)
    const phone = (data.phone || "").replace(/\D/g, "").replace(/^1/, "")
    if (phone.length !== 10) {
      return NextResponse.json({ success: false, error: "Invalid phone" }, { status: 400 })
    }

    const email = (data.email || "").trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 })
    }

    if (!(data.name || "").trim()) {
      return NextResponse.json({ success: false, error: "Name required" }, { status: 400 })
    }

    if (!(data.address || "").trim()) {
      return NextResponse.json({ success: false, error: "Address required" }, { status: 400 })
    }

    const payload = { ...data, server_ip: ip, lead_stage: stage }

    // Webhook routing: same URL for both stages by default; n8n branches on `lead_stage`.
    // Optional override via WEBHOOK_URL_EARLY / WEBHOOK_URL_COMPLETE.
    const earlyUrl = process.env.WEBHOOK_URL_EARLY || process.env.WEBHOOK_URL
    const completeUrl = process.env.WEBHOOK_URL_COMPLETE || process.env.WEBHOOK_URL
    const webhookUrl = stage === 'early' ? earlyUrl : completeUrl

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }

    return NextResponse.json({ success: true, stage })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
