const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

const CONSENT_KEY = 'bs-analytics-consent'

export type AnalyticsConsent = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let initialized = false

export function isAnalyticsConfigured(): boolean {
  return Boolean(MEASUREMENT_ID)
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY)
    if (value === 'granted' || value === 'denied') return value
  } catch {
    // private mode / blocked storage
  }
  return null
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === 'granted'
}

export function setAnalyticsConsent(consent: AnalyticsConsent): void {
  try {
    localStorage.setItem(CONSENT_KEY, consent)
  } catch {
    // ignore
  }
}

/** Load gtag.js and configure GA4 (no automatic page_view). Call only after consent. */
export function initAnalytics(): void {
  if (initialized || !MEASUREMENT_ID || !hasAnalyticsConsent()) return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
  })
}

/** SPA page view — call on every resolved route change when consented. */
export function trackPageView(path: string): void {
  if (!MEASUREMENT_ID || !hasAnalyticsConsent() || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  })
}
