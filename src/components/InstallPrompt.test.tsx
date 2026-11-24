import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import InstallPrompt from './InstallPrompt'
import { resetDeferredInstallPrompt, watchInstallPrompt } from '@/lib/installPrompt'
import type { BeforeInstallPromptEvent } from '@/hooks/useInstallPrompt'

const CHROME_UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
const SAFARI_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

function setUserAgent(userAgent: string) {
  Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true })
}

function offerInstall(outcome: 'accepted' | 'dismissed' = 'accepted') {
  const event = new Event('beforeinstallprompt', {
    cancelable: true,
  }) as BeforeInstallPromptEvent
  event.prompt = vi.fn().mockResolvedValue(undefined)
  event.userChoice = Promise.resolve({ outcome, platform: 'web' })
  act(() => {
    window.dispatchEvent(event)
  })
  return event
}

beforeAll(() => watchInstallPrompt())

beforeEach(() => {
  resetDeferredInstallPrompt()
  window.localStorage.clear()
  setUserAgent(CHROME_UA)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('InstallPrompt', () => {
  it('renders nothing when no install path exists', () => {
    const { container } = render(<InstallPrompt />)
    expect(container).toBeEmptyDOMElement()
  })

  it('offers the native install once the browser allows it', () => {
    render(<InstallPrompt />)
    offerInstall()

    expect(screen.getByText('Installer Mello')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Installer' })).toBeInTheDocument()

    // French copy on an English page, so it is tagged for screen readers.
    const dialog = screen.getByRole('dialog', { name: 'Installer Mello' })
    expect(dialog).toHaveAttribute('lang', 'fr')
  })

  it('triggers the native dialog from the install button', async () => {
    render(<InstallPrompt />)
    const event = offerInstall()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Installer' }))
    })

    expect(event.prompt).toHaveBeenCalledOnce()
  })

  it('shows Share-sheet instructions instead of a button on iOS', () => {
    setUserAgent(SAFARI_IOS_UA)
    render(<InstallPrompt />)

    expect(screen.getByText(/Sur l.écran d.accueil/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Installer' })).not.toBeInTheDocument()
  })

  it('is dismissed and stays dismissed across a remount', () => {
    const first = render(<InstallPrompt />)
    offerInstall()

    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }))

    expect(first.container).toBeEmptyDOMElement()
    expect(window.localStorage.getItem('mello:install-dismissed')).toBeTruthy()
    first.unmount()

    const second = render(<InstallPrompt />)
    offerInstall()

    expect(second.container).toBeEmptyDOMElement()
  })
})
