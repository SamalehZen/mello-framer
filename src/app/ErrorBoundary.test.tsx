import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

function Boom(): never {
  throw new Error('kaboom')
}

beforeEach(() => {
  // React re-throws caught render errors to the console; keep the output quiet.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('all good')).toBeInTheDocument()
  })

  it('shows a recovery message when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.')
    expect(screen.getByRole('button', { name: /reload the page/i })).toBeInTheDocument()
  })

  it('reloads the page from the fallback action', async () => {
    const reload = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    })

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    await userEvent.click(screen.getByRole('button', { name: /reload the page/i }))

    expect(reload).toHaveBeenCalledOnce()
  })
})
