import { Fragment, useState, type CSSProperties } from 'react'
import { useReveal } from '@/hooks/useReveal'

type TimeTab = {
  time: string
  name: string
  num: string
  title: string
  icon: 'crown' | 'star' | 'heart' | 'plus'
  h3: string
  desc: string
}

const TABS: TimeTab[] = [
  {
    time: '07:03',
    name: 'First sip',
    num: '01',
    title: 'Morning glow',
    icon: 'crown',
    h3: 'First sip',
    desc: 'Doors open. Espresso machine sings. The day suddenly looks possible.',
  },
  {
    time: '10:12',
    name: 'Power up',
    num: '02',
    title: 'Power hour',
    icon: 'star',
    h3: 'Power up',
    desc: 'You came for coffee. You left with a cinnamon bun. Excellent decision.',
  },
  {
    time: '14:47',
    name: 'Iced o’clock',
    num: '03',
    title: 'Afternoon refresh',
    icon: 'heart',
    h3: 'Iced o’clock',
    desc: 'The inbox is winning. Matcha enters the chat and turns things around.',
  },
  {
    time: '17:31',
    name: 'One more?',
    num: '04',
    title: 'Treat time',
    icon: 'plus',
    h3: 'One more?',
    desc: 'One last espresso before home. Good days deserve a strong finish.',
  },
]

const TITLE = ['The', 'right', 'cup,', 'right', 'on', 'time']

function Chars({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span className="time-ch" style={{ '--i': i + offset } as CSSProperties} key={i}>
          {ch}
        </span>
      ))}
    </>
  )
}

export default function Time() {
  const [active, setActive] = useState(0)
  const [switched, setSwitched] = useState(false)
  const [ref, revealed] = useReveal<HTMLElement>({ threshold: 0.12 })
  const tab = TABS[active]
  const [hh, mm] = tab.time.split(':')

  return (
    <section className={`time${revealed ? ' is-in' : ''}`} id="time" ref={ref}>
      <div className="time-edge time-edge-top" aria-hidden="true" />
      <div className="time-edge time-edge-bottom" aria-hidden="true" />

      <div className="time-content">
        <div className="time-heading">
          <div className="time-heading-left">
            <div className="time-label">
              <span className="time-label-dot" aria-hidden="true" />
              <p className="time-label-text">
                <span className="time-word">
                  <Chars text="Coffee" />
                </span>{' '}
                <span className="time-word">
                  <Chars text="o’clock" offset={7} />
                </span>
              </p>
            </div>
            <h2 className="time-title">
              {TITLE.map((w, i) => (
                <Fragment key={w + i}>
                  {i > 0 ? ' ' : null}
                  <span className="time-word" style={{ '--i': i } as CSSProperties}>
                    {w}
                  </span>
                </Fragment>
              ))}
            </h2>
          </div>

          <div className="time-heading-right">
            <p className="time-sub">
              {'Start bright, slow down, or\u00A0treat yourself whenever.'}
            </p>
          </div>
        </div>

        <div className="time-info">
          <div className="time-card">
            <div className="time-card-body">
              <div className="time-card-name">
                <span className={`time-card-name-inner${switched ? ' is-pop' : ''}`} key={active}>
                  <span className="time-card-num">{tab.num}</span>
                  <span className="time-card-title">{tab.title}</span>
                </span>
              </div>

              <div className="time-card-grid">
                <div className="time-big">
                  <p className="time-big-h">{hh}</p>
                  <p className="time-big-colon">:</p>
                  <p className="time-big-m">{mm}</p>
                </div>

                <div className="time-illus">
                  <span className={`time-icon time-icon-${tab.icon}`} aria-hidden="true" />
                  <div className="time-illus-text">
                    <h3 className="time-h3">{tab.h3}</h3>
                    <p className="time-desc">{tab.desc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="time-tabs" role="tablist" aria-label="Coffee times">
              {TABS.map((t, i) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={`time-tab${i === active ? ' is-active' : ''}`}
                  onClick={() => {
                    setActive(i)
                    setSwitched(true)
                  }}
                  key={t.time}
                >
                  <span className="time-tab-text">
                    <span className="time-tab-time">{t.time}</span>
                    <span className="time-tab-name">{t.name}</span>
                  </span>
                  <span
                    className={`time-tab-icon time-icon time-icon-${t.icon}`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>

          <span className="time-arrow" aria-hidden="true">
            <span className="time-arrow-shape" />
          </span>

          <a className="time-cta" href="#menu">
            <span className="time-cta-bg" aria-hidden="true" />
            <span className="time-cta-text">Explore the menu</span>
          </a>
        </div>
      </div>
    </section>
  )
}
