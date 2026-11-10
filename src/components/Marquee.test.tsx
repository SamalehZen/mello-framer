import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import Marquee from './Marquee'

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get: () => 1000,
  })
})

describe('Marquee', () => {
  it('derives the loop duration from the track width and speed', () => {
    const { container } = render(<Marquee speed={50}>hi</Marquee>)
    const track = container.querySelector('.marquee-track') as HTMLElement

    // Half the 1000px track at 50 px/s -> 10 seconds.
    expect(track.style.getPropertyValue('--marquee-duration')).toBe('10.000s')
  })

  it('renders its children twice so the loop is seamless', () => {
    const { container } = render(
      <Marquee speed={10}>
        <span>item</span>
      </Marquee>,
    )

    expect(container.querySelectorAll('.marquee-track span')).toHaveLength(2)
    // The duplicate copy is hidden from assistive tech.
    const clone = container.querySelector('.marquee-clone')
    expect(clone).toHaveAttribute('aria-hidden', 'true')
    expect(clone!.querySelectorAll('span')).toHaveLength(1)
  })

  it('merges an optional class name', () => {
    const { container } = render(
      <Marquee speed={10} className="extra">
        x
      </Marquee>,
    )

    expect(container.firstElementChild).toHaveClass('marquee', 'extra')
  })
})
