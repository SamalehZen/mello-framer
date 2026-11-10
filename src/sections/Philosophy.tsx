import { Fragment, useRef, type CSSProperties } from 'react'
import { useReveal } from '@/hooks/useReveal'
import barcode from '@/assets/img/philosophy/philo-barcode.svg'
import boltSvg from '@/assets/img/philosophy/philo-bolt.svg?raw'
import heartSvg from '@/assets/img/philosophy/philo-heart.svg?raw'
import sparkSvg from '@/assets/img/philosophy/philo-spark.svg?raw'

const dataMask = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

const MASK_VARS = {
  '--philo-bolt': dataMask(boltSvg),
  '--philo-heart': dataMask(heartSvg),
  '--philo-spark': dataMask(sparkSvg),
} as CSSProperties

const TITLE: { w: string; green?: boolean }[] = [
  { w: 'Things' },
  { w: 'that' },
  { w: 'make' },
  { w: 'mornings' },
  { w: 'feel', green: true },
  { w: 'better.', green: true },
]

const RECEIPT_ROWS: [string, string][] = [
  ['Kind humans', 'Always'],
  ['Great beans', 'Daily'],
  ['Coffee snobbery', '$0.00'],
  ['Warm pastries', 'Yes pls'],
]

const DOTS = Array.from({ length: 16 })

function Chars({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span className="philosophy-ch" style={{ '--i': i + offset } as CSSProperties} key={i}>
          {ch}
        </span>
      ))}
    </>
  )
}

function Perforation() {
  return (
    <div className="philosophy-perf-row" aria-hidden="true">
      {DOTS.map((_, i) => (
        <span className="philosophy-perf-dot" key={i} />
      ))}
    </div>
  )
}

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [headingRef, revealed] = useReveal<HTMLDivElement>()

  return (
    <section
      className={`philosophy${revealed ? ' is-in' : ''}`}
      id="philosophy"
      ref={sectionRef}
      style={MASK_VARS}
    >
      <div className="philosophy-content">
        <div className="philosophy-info">
          <div className="philosophy-h2text">
            <div className="philosophy-labelh2">
              <div className="philosophy-label" ref={headingRef}>
                <span className="philosophy-dot" aria-hidden="true" />
                <p className="philosophy-label-text">
                  <span className="philosophy-word">
                    <Chars text="What" />
                  </span>{' '}
                  <span className="philosophy-word">
                    <Chars text="matters" offset={5} />
                  </span>
                </p>
              </div>
              <div className="philosophy-titlewrap">
                <h2 className="philosophy-title">
                  {TITLE.map((t, i) => (
                    <Fragment key={t.w}>
                      {i > 0 ? ' ' : null}
                      <span
                        className={`w${t.green ? ' is-green' : ''}`}
                        style={{ '--i': i } as CSSProperties}
                      >
                        {t.w}
                      </span>
                    </Fragment>
                  ))}
                </h2>
              </div>
            </div>
            <div className="philosophy-para-wrap">
              <p className="philosophy-para">
                We started Mello to make specialty coffee feel less serious and a lot more human.
              </p>
            </div>
          </div>

          <div className="philosophy-buttons">
            <a className="philosophy-btn philosophy-btn-primary" href="./#reviews">
              <span className="philosophy-btn-bg" aria-hidden="true" />
              <span className="philosophy-btn-text">Read reviews</span>
            </a>
            <a
              className="philosophy-btn philosophy-btn-secondary"
              href="https://google.com/maps"
              target="_blank"
              rel="noreferrer"
            >
              <span className="philosophy-btn-bg" aria-hidden="true" />
              <span className="philosophy-btn-text">Get directions</span>
            </a>
          </div>
        </div>

        <div className="philosophy-receipt-wrap">
          <div className="philosophy-receipt">
            <div className="philosophy-receipt-info">
              <div className="philosophy-receipt-head">
                <div className="philosophy-logo">
                  <span className="philosophy-logo-text">Mello</span>
                  <span className="philosophy-logo-sub">Morning mood office</span>
                </div>
                <span className="philosophy-bolt" aria-hidden="true" />
              </div>

              <div className="philosophy-rule" aria-hidden="true" />

              <div className="philosophy-items">
                {RECEIPT_ROWS.map(([label, value]) => (
                  <div className="philosophy-item" key={label}>
                    <span className="philosophy-item-label">{label}</span>
                    <span className="philosophy-item-value">{value}</span>
                  </div>
                ))}
              </div>

              <div className="philosophy-rule" aria-hidden="true" />

              <div className="philosophy-total">
                <span className="philosophy-total-label">Total</span>
                <span className="philosophy-total-value">One good day</span>
              </div>

              <div className="philosophy-rule" aria-hidden="true" />
            </div>

            <div className="philosophy-barcode">
              <img src={barcode} width={200} height={48} alt="Mello barcode" draggable={false} />
              <div className="philosophy-thanks">
                <span className="philosophy-thanks-heart" aria-hidden="true" />
                <span className="philosophy-thanks-text">Thank you!</span>
              </div>
            </div>
          </div>

          <div className="philosophy-perf philosophy-perf-top" aria-hidden="true">
            <Perforation />
          </div>
          <div className="philosophy-perf philosophy-perf-bottom" aria-hidden="true">
            <Perforation />
          </div>

          <span className="philosophy-heart philosophy-heart-1" aria-hidden="true" />
          <span className="philosophy-heart philosophy-heart-2" aria-hidden="true" />
          <span className="philosophy-heart philosophy-heart-3" aria-hidden="true" />
          <span className="philosophy-spark" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
