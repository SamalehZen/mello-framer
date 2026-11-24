import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { SITE } from '@/config/site'

/**
 * The "add to home screen" offer.
 *
 * Reuses the site's own recipe for a floating surface — cream panel, ink frame,
 * 20px radius, the grass `.btn-primary` — so it reads as part of the page. It
 * renders nothing unless a real install path exists, and stays out of the way at
 * the bottom of the viewport.
 *
 * The copy is French, so the subtree carries `lang="fr"`: the document is
 * English and a screen reader would otherwise pronounce it wrong.
 */
export default function InstallPrompt() {
  const { visible, mode, install, dismiss } = useInstallPrompt()
  if (!visible) return null

  const isIos = mode === 'ios'

  return (
    <div className="install-prompt" role="dialog" lang="fr" aria-labelledby="install-prompt-title">
      <img
        className="install-prompt-logo"
        src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
        alt=""
        width={44}
        height={44}
      />
      <div className="install-prompt-body">
        <p className="install-prompt-title" id="install-prompt-title">
          Installer {SITE.name}
        </p>
        <p className="install-prompt-message">
          {isIos
            ? 'Appuyez sur Partager, puis « Sur l’écran d’accueil ».'
            : 'Menu, horaires et itinéraire en un tap — même hors ligne.'}
        </p>
      </div>
      {isIos ? null : (
        <button
          type="button"
          className="btn btn-primary install-prompt-action"
          onClick={() => void install()}
        >
          Installer
        </button>
      )}
      <button type="button" className="install-prompt-close" onClick={dismiss} aria-label="Fermer">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
