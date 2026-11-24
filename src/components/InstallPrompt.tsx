import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { SITE } from '@/config/site'

/**
 * The "add to home screen" offer.
 *
 * Reuses the site's own recipe for a floating surface — cream panel, ink frame,
 * 20px radius, the grass `.btn-primary` — so it reads as part of the page. It
 * renders nothing unless a real install path exists, and stays out of the way at
 * the bottom of the viewport.
 */
export default function InstallPrompt() {
  const { visible, mode, install, dismiss } = useInstallPrompt()
  if (!visible) return null

  const isIos = mode === 'ios'

  return (
    <div className="install-prompt" role="dialog" aria-labelledby="install-prompt-title">
      <img
        className="install-prompt-logo"
        src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
        alt=""
        width={44}
        height={44}
      />
      <div className="install-prompt-body">
        <p className="install-prompt-title" id="install-prompt-title">
          Install {SITE.name}
        </p>
        <p className="install-prompt-message">
          {isIos
            ? 'Tap Share, then “Add to Home Screen”.'
            : 'Menu, hours and directions in one tap — even offline.'}
        </p>
      </div>
      {isIos ? null : (
        <button
          type="button"
          className="btn btn-primary install-prompt-action"
          onClick={() => void install()}
        >
          Install
        </button>
      )}
      <button
        type="button"
        className="install-prompt-close"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
