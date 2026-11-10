import coldbrew from '@/assets/img/mood/coldbrew-512.avif'
import coldbrew2x from '@/assets/img/mood/coldbrew-1024.avif'
import espresso from '@/assets/img/mood/vanilla-512.avif'
import espresso2x from '@/assets/img/mood/vanilla-1024.avif'
import mocha from '@/assets/img/mood/mocha-512.avif'
import mocha2x from '@/assets/img/mood/mocha-1024.avif'
import citrus from '@/assets/img/mood/citrus-512.avif'
import citrus2x from '@/assets/img/mood/citrus-1024.avif'
import { Fragment, useState, type CSSProperties } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Mood = {
  key: string
  label: string
  title: string
  details: [string, string]
  name: string
  desc: string
  price: string
  volume: string
  img: string
  img2x: string
  angle: number
  pos: 'tl' | 'tr' | 'bl' | 'br'
}

const MOODS: Mood[] = [
  {
    key: 'energized',
    label: 'Energized',
    title: 'Need a boost',
    details: ['Coffee', 'Ice'],
    name: 'Cold brew',
    desc: 'Bold and refreshingly cold.',
    price: '$4.50',
    volume: '8 oz',
    img: coldbrew,
    img2x: coldbrew2x,
    angle: -135,
    pos: 'tl',
  },
  {
    key: 'cozy',
    label: 'Cozy',
    title: 'Take it slow',
    details: ['Espresso', 'Vanilla'],
    name: 'Vanilla latte',
    desc: 'Creamy and softly balanced.',
    price: '$6.25',
    volume: '16 oz',
    img: espresso,
    img2x: espresso2x,
    angle: -45,
    pos: 'tr',
  },
  {
    key: 'refreshed',
    label: 'Refreshed',
    title: 'Keep it fresh',
    details: ['Mocha', 'Cream'],
    name: 'Mocha shake',
    desc: 'Rich, creamy, and chocolatey.',
    price: '$6.75',
    volume: '16 oz',
    img: mocha,
    img2x: mocha2x,
    angle: -225,
    pos: 'bl',
  },
  {
    key: 'indulgent',
    label: 'Indulgent',
    title: 'Treat myself',
    details: ['Citrus', 'Soda'],
    name: 'Sparkling citrus',
    desc: 'Bright, bubbly, and refreshing.',
    price: '$5.25',
    volume: '16 oz',
    img: citrus,
    img2x: citrus2x,
    angle: 45,
    pos: 'br',
  },
]

const TITLE = ['What', 'are', 'you', 'in', 'the', 'mood', 'for?']

function Chars({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span className="mood-ch" style={{ '--i': i + offset } as CSSProperties} key={i}>
          {ch}
        </span>
      ))}
    </>
  )
}

export default function Mood() {
  const [active, setActive] = useState(0)
  const [headingRef, revealed] = useReveal<HTMLDivElement>({ rootMargin: '0px 0px -20% 0px' })
  const mood = MOODS[active]

  return (
    <section className={`mood${revealed ? ' is-in' : ''}`}>
      <div className="mood-content">
        <div className="mood-heading" ref={headingRef}>
          <div className="mood-label">
            <span className="mood-label-dot" aria-hidden="true" />
            <p className="mood-label-text">
              <span className="mood-word">
                <Chars text="Mood" />
              </span>{' '}
              <span className="mood-word">
                <Chars text="matcher" offset={5} />
              </span>
            </p>
          </div>
          <h2 className="mood-title">
            {TITLE.map((w, i) => (
              <Fragment key={w}>
                {i > 0 ? ' ' : null}
                <span className="w" style={{ '--i': i } as CSSProperties}>
                  {w}
                </span>
              </Fragment>
            ))}
          </h2>
          <span className="mood-cupid" aria-hidden="true">
            <span className="mood-cupid-shape" />
          </span>
        </div>

        <div className="mood-main">
          <div className="mood-stage">
            <p className="mood-vtext">
              Choose your mood.
              <br />
              We’ll do the rest.
            </p>

            <div className="mood-wheel">
              {MOODS.map((m, i) => (
                <button
                  key={m.key}
                  type="button"
                  className={`mood-quad mood-quad-${m.pos}${i === active ? ' is-active' : ''}`}
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                >
                  <span className="mood-quad-text">
                    <span className="mood-quad-label">{m.label}</span>
                    <span className="mood-quad-title">{m.title}</span>
                  </span>
                </button>
              ))}

              <div className="mood-wheel-center">
                <span
                  className={`mood-pointer mood-pointer-${mood.pos}`}
                  style={{ transform: `rotate(${mood.angle}deg)` }}
                  aria-hidden="true"
                />
                <span className="mood-wheel-circle">
                  <span className="mood-heart" aria-hidden="true" />
                </span>
              </div>
            </div>

            <span className="mood-cream-arrow" aria-hidden="true" />
            <span className="mood-curve" aria-hidden="true" />
            <span className="mood-sparkle" aria-hidden="true" />
          </div>

          <div className="mood-spacer" />

          <div className="mood-card-wrap">
            <article className="mood-card" key={mood.key}>
              <div className="mood-card-img">
                <img
                  src={mood.img}
                  srcSet={`${mood.img} 512w, ${mood.img2x} 1024w`}
                  sizes="(min-width: 1200px) 323px, (min-width: 768px) 376px, 310px"
                  alt={mood.name}
                  width={512}
                  height={384}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </div>
              <div className="mood-card-info">
                <div className="mood-card-text">
                  <div className="mood-card-head">
                    <div className="mood-card-tags">
                      <p>{mood.details[0]}</p>
                      <span className="mood-tag-div" aria-hidden="true" />
                      <p>{mood.details[1]}</p>
                    </div>
                    <h3 className="mood-card-name">{mood.name}</h3>
                  </div>
                  <p className="mood-card-desc">{mood.desc}</p>
                </div>
                <div className="mood-card-price">
                  <p className="mood-price">{mood.price}</p>
                  <span className="mood-vol">{mood.volume}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
