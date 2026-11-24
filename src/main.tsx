import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import ErrorBoundary from '@/app/ErrorBoundary'
import { installGlobalHandlers } from '@/lib/report'
import { watchInstallPrompt } from '@/lib/installPrompt'
import { registerServiceWorker } from '@/lib/serviceWorker'
import '@/styles/index.css'
import '@/styles/sections.css'
import '@/styles/install-prompt.css'

installGlobalHandlers()
// Before the first render: `beforeinstallprompt` fires at most once and is never
// replayed, so the listener has to be in place ahead of React's effects.
watchInstallPrompt()
registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
