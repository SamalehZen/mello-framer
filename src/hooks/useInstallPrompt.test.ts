import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInstallPrompt, type BeforeInstallPromptEvent } from './useInstallPrompt'

const CHROME_UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
const SAFARI_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
const CHROME_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120 Mobile/15E148 Safari/604.1'

function setUserAgent(userAgent: string) {
  Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true })
}

function installEvent(outcome: 'accepted' | 'dismissed' = 'accepted') {
  const event = new Event('beforeinstallprompt', {
    cancelable: true,
  }) as BeforeInstallPromptEvent
  event.prompt = vi.fn().mockResolvedValue(undefined)
  event.userChoice = Promise.resolve({ outcome, platform: 'web' })
  return event
}

function stubMatchMedia(standalone: boolean) {
  const listeners = new Set<() => void>()
  const mql = {
    matches: standalone,
    media: '(display-mode: standalone)',
    onchange: null,
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql as unknown as MediaQueryList),
  )
}

const fire = (type: string, event?: Event) =>
  act(() => {
    window.dispatchEvent(event ?? new Event(type))
  })

beforeEach(() => {
  window.localStorage.clear()
  setUserAgent(CHROME_UA)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useInstallPrompt', () => {
  it('offers nothing until the browser reports an install path', () => {
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.visible).toBe(false)
    expect(result.current.mode).toBeNull()
  })

  it('captures beforeinstallprompt and suppresses the default mini-infobar', () => {
    const { result } = renderHook(() => useInstallPrompt())
    const event = installEvent()

    fire('beforeinstallprompt', event)

    expect(event.defaultPrevented).toBe(true)
    expect(result.current.visible).toBe(true)
    expect(result.current.mode).toBe('native')
  })

  it('opens the native dialog and reports the user answer', async () => {
    const { result } = renderHook(() => useInstallPrompt())
    const event = installEvent('accepted')
    fire('beforeinstallprompt', event)

    let outcome = ''
    await act(async () => {
      outcome = await result.current.install()
    })

    expect(event.prompt).toHaveBeenCalledOnce()
    expect(outcome).toBe('accepted')
    // The event can only be used once, so the offer leaves the screen.
    expect(result.current.visible).toBe(false)
  })

  it('treats a cancelled native dialog as a dismissal', async () => {
    const { result } = renderHook(() => useInstallPrompt())
    const event = installEvent('dismissed')
    fire('beforeinstallprompt', event)

    await act(async () => {
      await result.current.install()
    })

    expect(result.current.visible).toBe(false)
    expect(window.localStorage.getItem('mello:install-dismissed')).toBeTruthy()
  })

  it('stays hidden once the app is installed', () => {
    const { result } = renderHook(() => useInstallPrompt())
    fire('beforeinstallprompt', installEvent())

    fire('appinstalled')

    expect(result.current.visible).toBe(false)
    expect(result.current.mode).toBeNull()
  })

  it('never offers to install an already installed app', () => {
    stubMatchMedia(true)
    const { result } = renderHook(() => useInstallPrompt())

    fire('beforeinstallprompt', installEvent())

    expect(result.current.visible).toBe(false)
  })

  it('falls back to Share-sheet instructions on iOS Safari', () => {
    setUserAgent(SAFARI_IOS_UA)
    const { result } = renderHook(() => useInstallPrompt())

    expect(result.current.visible).toBe(true)
    expect(result.current.mode).toBe('ios')
  })

  it('does not offer instructions in an iOS browser that cannot install', () => {
    setUserAgent(CHROME_IOS_UA)
    const { result } = renderHook(() => useInstallPrompt())

    expect(result.current.visible).toBe(false)
    expect(result.current.mode).toBeNull()
  })

  it('remembers a dismissal across visits', () => {
    const first = renderHook(() => useInstallPrompt())
    fire('beforeinstallprompt', installEvent())
    act(() => first.result.current.dismiss())
    expect(first.result.current.visible).toBe(false)
    first.unmount()

    const second = renderHook(() => useInstallPrompt())
    fire('beforeinstallprompt', installEvent())
    expect(second.result.current.visible).toBe(false)
  })

  it('returns unavailable when there is no deferred dialog', async () => {
    const { result } = renderHook(() => useInstallPrompt())

    let outcome = ''
    await act(async () => {
      outcome = await result.current.install()
    })

    expect(outcome).toBe('unavailable')
  })
})
