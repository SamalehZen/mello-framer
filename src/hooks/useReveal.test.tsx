import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { prefersReducedMotion, useReveal } from './useReveal'

class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds: ReadonlyArray<number> = [0]
  visible = false

  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
  disconnect() {
    this.visible = false
  }

  trigger(isIntersecting: boolean) {
    this.visible = isIntersecting
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this)
  }
}

function stubMatchMedia(reduceMotion: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: reduceMotion && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })),
  )
}

function Probe() {
  const [ref, shown] = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} data-testid="probe">
      {String(shown)}
    </div>
  )
}

beforeEach(() => {
  MockIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

afterEach(() => vi.unstubAllGlobals())

describe('prefersReducedMotion', () => {
  it('reflects the media query', () => {
    stubMatchMedia(true)
    expect(prefersReducedMotion()).toBe(true)
    stubMatchMedia(false)
    expect(prefersReducedMotion()).toBe(false)
  })
})

describe('useReveal', () => {
  it('starts hidden and reveals once the element intersects', () => {
    stubMatchMedia(false)
    render(<Probe />)

    expect(screen.getByTestId('probe')).toHaveTextContent('false')
    const observer = MockIntersectionObserver.instances.at(-1)
    expect(observer).toBeDefined()

    act(() => observer!.trigger(true))

    expect(screen.getByTestId('probe')).toHaveTextContent('true')
  })

  it('stays hidden while the element is out of view', () => {
    stubMatchMedia(false)
    render(<Probe />)

    act(() => MockIntersectionObserver.instances.at(-1)!.trigger(false))

    expect(screen.getByTestId('probe')).toHaveTextContent('false')
  })

  it('skips the observer entirely when motion is reduced', () => {
    stubMatchMedia(true)
    render(<Probe />)

    expect(screen.getByTestId('probe')).toHaveTextContent('true')
    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })
})
