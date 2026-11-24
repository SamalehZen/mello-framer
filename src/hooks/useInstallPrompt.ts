import { useCallback, useEffect, useState } from 'react'

/**
 * The event Chrome/Edge fire when the site satisfies the install criteria. It
 * is not in `lib.dom`, so it is declared here; `prompt()` is the only way to
 * open the native install dialog.
 */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const DISMISS_KEY = 'mello:install-dismissed'
/** After a dismissal the offer stays quiet for a month before returning. */
const DISMISS_TTL = 30 * 24 * 60 * 60 * 1000

/** True once the site runs from the home screen rather than a browser tab. */
function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const displayMode = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  return displayMode || iosStandalone
}

/**
 * iOS Safari cannot install from script, so the popup explains the Share sheet
 * instead. Every iOS browser is WebKit, but only Safari can add to the home
 * screen, hence the exclusion list. iPadOS reports itself as a Mac, recognised
 * by its touch points.
 */
function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const isIos =
    /iphone|ipad|ipod/i.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  const isOtherBrowser = /crios|fxios|edgios|opios|mercury/i.test(ua)
  return isIos && !isOtherBrowser
}

function wasRecentlyDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const at = Number.parseInt(raw, 10)
    return Number.isFinite(at) && Date.now() - at < DISMISS_TTL
  } catch {
    // Storage can throw in private mode; treat it as "never dismissed".
    return false
  }
}

function rememberDismissal(): void {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // Not being able to persist the choice only means the popup may return.
  }
}

export type InstallMode = 'native' | 'ios'

export type InstallPrompt = {
  /** Whether the install offer should be on screen. */
  visible: boolean
  /** `native` on Chrome/Edge, `ios` for the manual Share-sheet flow, else null. */
  mode: InstallMode | null
  /** Opens the native dialog; resolves with the user's answer. */
  install: () => Promise<'accepted' | 'dismissed' | 'unavailable'>
  /** Hides the offer and remembers the choice. */
  dismiss: () => void
}

/**
 * Drives the "install this site" offer.
 *
 * Chromium: keeps the deferred `beforeinstallprompt` event so the button can
 * call `prompt()` inside the user's click — browsers ignore it otherwise.
 * iOS: no such event exists, so the offer switches to instructions.
 * Installed or recently dismissed: nothing is offered at all.
 */
export function useInstallPrompt(): InstallPrompt {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(isStandalone)
  const [dismissed, setDismissed] = useState(wasRecentlyDismissed)
  const [isIos] = useState(isIosSafari)

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      // Without this the browser shows its own mini-infobar and the event is
      // lost for the custom button.
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    const displayMode = window.matchMedia('(display-mode: standalone)')
    const onDisplayMode = () => setInstalled(isStandalone())

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    displayMode.addEventListener('change', onDisplayMode)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      displayMode.removeEventListener('change', onDisplayMode)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return 'unavailable' as const
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    // The event can only be used once; a second click would do nothing.
    setDeferred(null)
    if (outcome === 'dismissed') {
      rememberDismissal()
      setDismissed(true)
    }
    return outcome
  }, [deferred])

  const dismiss = useCallback(() => {
    rememberDismissal()
    setDismissed(true)
  }, [])

  const mode: InstallMode | null = deferred ? 'native' : isIos ? 'ios' : null

  return { visible: mode !== null && !installed && !dismissed, mode, install, dismiss }
}
