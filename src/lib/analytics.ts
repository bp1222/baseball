const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

const CONSENT_KEY = 'bs-analytics-consent'

export type AnalyticsConsent = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: IArguments[]
    // GA's stub must use `arguments` (not a rest array) — see initAnalytics.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void
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

  // Match Google's snippet exactly: queue via `arguments`, then load the script.
  // Pushing a rest-parameter array breaks processing — only js?id= loads, no g/collect.
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
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

export type AnalyticsEvent =
  | {
      name: 'select_season'
      season: string
      team_name?: string
    }
  | {
      name: 'select_team'
      season: string
      team_name: string
    }
  | {
      name: 'clear_team'
      season: string
      team_name?: string
    }
  | {
      name: 'view_season'
      season: string
    }
  | {
      name: 'view_team'
      season: string
      team_name: string
    }

/** Custom GA4 event (no-ops without consent). */
export function trackEvent(event: AnalyticsEvent): void {
  if (!MEASUREMENT_ID || !hasAnalyticsConsent() || !window.gtag) return

  const { name, ...params } = event
  const payload: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) payload[key] = value
  }

  window.gtag('event', name, payload)
}
