import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * Last-resort boundary: keeps a render crash from blanking the whole page and
 * offers a way back. In a production app `componentDidCatch` is also where a
 * reporting service (Sentry, etc.) would be wired in.
 */
export default class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info.componentStack)
  }

  override render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="error-fallback" role="alert">
        <p className="error-fallback-eyebrow">Mello</p>
        <h1 className="error-fallback-title">Something went wrong.</h1>
        <p className="error-fallback-text">
          Reloading the page usually fixes it. If it keeps happening, come back in a moment.
        </p>
        <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
          <span>Reload the page</span>
        </button>
        {import.meta.env.DEV ? <pre className="error-fallback-detail">{error.message}</pre> : null}
      </div>
    )
  }
}
