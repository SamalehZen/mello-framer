import { Fragment, type CSSProperties } from 'react'
import { useReveal } from '@/hooks/useReveal'

const LOGO = ['M', 'e', 'l', 'l', 'o']
const HOURS = ['Open', 'daily', '7AM–6PM']

function HoursChars() {
  let i = 0
  return (
    <>
      {HOURS.map((word, wi) => (
        <Fragment key={word}>
          {wi > 0 ? ' ' : null}
          <span className="footer-hours-word">
            {word.split('').map((ch) => {
              const idx = i++
              return (
                <span className="footer-hours-ch" style={{ '--i': idx } as CSSProperties} key={idx}>
                  {ch}
                </span>
              )
            })}
          </span>
        </Fragment>
      ))}
    </>
  )
}

function LogoChars() {
  return (
    <span className="footer-logo-word">
      {LOGO.map((ch, i) => (
        <span className="footer-logo-ch" style={{ '--i': i } as CSSProperties} key={i}>
          {ch}
        </span>
      ))}
    </span>
  )
}

const EXPLORE_LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Place', href: '#place' },
  { label: 'Visit', href: '#visit' },
]
const FOLLOW_LINKS = [
  { label: 'TikTok', href: 'https://tiktok.com' },
  { label: 'Instagram', href: 'https://Instagram.com' },
  { label: 'Facebook', href: 'https://Facebook.com' },
]

export default function Footer() {
  const [ref, shown] = useReveal<HTMLElement>({ threshold: 0.5 })
  const on = shown ? ' is-in' : ''

  return (
    <footer className={'footer' + on} ref={ref}>
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-logo-text">
            <div className="footer-logo-wrap">
              <a className="footer-logo" href="#top" aria-label="Mello">
                <p>
                  <LogoChars />
                </p>
              </a>
            </div>

            <div className="footer-hours">
              <p>
                <HoursChars />
              </p>
            </div>

            <div className="footer-doodle" aria-hidden="true" />
          </div>

          <div className="footer-copy">
            <p>© 2026. All rights reserved</p>
          </div>
        </div>

        <div className="footer-menu">
          <div className="footer-menu-blocks">
            <div className="footer-block">
              <div className="footer-label">
                <p>Explore</p>
              </div>
              <div className="footer-links">
                {EXPLORE_LINKS.map((l) => (
                  <a className="footer-link" href={l.href} key={l.label}>
                    <p className="footer-link-text">{l.label}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-block">
              <div className="footer-label">
                <p>Follow</p>
              </div>
              <div className="footer-links">
                {FOLLOW_LINKS.map((l) => (
                  <a
                    className="footer-link"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    key={l.label}
                  >
                    <p className="footer-link-text">{l.label}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-block footer-block-contact">
            <div className="footer-label">
              <p>Contact</p>
            </div>
            <div className="footer-links">
              <a
                className="footer-link"
                href="https://google.com/maps"
                target="_blank"
                rel="noreferrer"
              >
                <span className="footer-icon-wrap">
                  <span className="footer-icon footer-icon-pin" aria-hidden="true" />
                </span>
                <p className="footer-link-text">{'28 Roastery Lane,\nBrooklyn, NY'}</p>
              </a>
              <a className="footer-link" href="mailto: hi@mello.com">
                <span className="footer-icon-wrap">
                  <span className="footer-icon footer-icon-mail" aria-hidden="true" />
                </span>
                <p className="footer-link-text">hi@mello.com</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
