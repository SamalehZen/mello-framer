import { Fragment, type CSSProperties } from 'react'
import tallImg from '@/assets/img/visit/visit-tall.jpg'
import tall768Img from '@/assets/img/visit/visit-tall-768.jpg'
import tallAvif from '@/assets/img/visit/visit-tall.avif'
import tall768Avif from '@/assets/img/visit/visit-tall-768.avif'
import tallWebp from '@/assets/img/visit/visit-tall.webp'
import tall768Webp from '@/assets/img/visit/visit-tall-768.webp'
import sweetImg from '@/assets/img/visit/visit-sweet.jpg'
import sweet512Img from '@/assets/img/visit/visit-sweet-512.jpg'
import sweet1024Img from '@/assets/img/visit/visit-sweet-1024.jpg'
import sweetAvif from '@/assets/img/visit/visit-sweet.avif'
import sweet512Avif from '@/assets/img/visit/visit-sweet-512.avif'
import sweet1024Avif from '@/assets/img/visit/visit-sweet-1024.avif'
import sweetWebp from '@/assets/img/visit/visit-sweet.webp'
import sweet512Webp from '@/assets/img/visit/visit-sweet-512.webp'
import sweet1024Webp from '@/assets/img/visit/visit-sweet-1024.webp'
import trioImg from '@/assets/img/visit/visit-trio.jpg'
import trio768Img from '@/assets/img/visit/visit-trio-768.jpg'
import trioAvif from '@/assets/img/visit/visit-trio.avif'
import trio768Avif from '@/assets/img/visit/visit-trio-768.avif'
import trioWebp from '@/assets/img/visit/visit-trio.webp'
import trio768Webp from '@/assets/img/visit/visit-trio-768.webp'
import { useReveal } from '@/hooks/useReveal'

const LABEL_WORDS = ['See', 'you', 'soon']
const TITLE_WORDS = ['Take', 'a', 'peek.', 'Come', 'on', 'over']

// Match the source's responsive `sizes` so the browser selects the same candidate.
const SIZES_SPAN4 =
  '(min-width: 1200px) calc(calc(max((min(100vw - 128px, 1200px) - 176px) / 12, 1px) * 4 + 48px) - 24px), (min-width: 768px) and (max-width: 1199.98px) calc(max((min(100vw - 128px, 1200px) - 16px) / 2, 1px) - 24px), (max-width: 767.98px) calc(min(100vw - 64px, 1200px) - 16px)'
const SIZES_SPAN5 =
  '(min-width: 1200px) calc(calc(max((min(100vw - 128px, 1200px) - 176px) / 12, 1px) * 5 + 64px) - 24px), (min-width: 768px) and (max-width: 1199.98px) calc(max((max((min(100vw - 128px, 1200px) - 16px) / 2, 1px) * 2 - 0px) / 2, 1px) - 24px), (max-width: 767.98px) calc(min(100vw - 64px, 1200px) - 16px)'
const SIZES_SPAN3 =
  '(min-width: 1200px) calc(calc(max((min(100vw - 128px, 1200px) - 176px) / 12, 1px) * 3 + 32px) - 24px), (min-width: 768px) and (max-width: 1199.98px) calc(max((min(100vw - 128px, 1200px) - 16px) / 2, 1px) - 24px), (max-width: 767.98px) calc(min(100vw - 64px, 1200px) - 16px)'

function LabelChars() {
  let i = 0
  return (
    <>
      {LABEL_WORDS.map((word, wi) => (
        <Fragment key={word}>
          {wi > 0 ? ' ' : null}
          <span className="visit-label-word">
            {word.split('').map((ch) => {
              const idx = i++
              return (
                <span className="visit-label-ch" style={{ '--i': idx } as CSSProperties} key={idx}>
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

export default function Visit() {
  const [sectionRef, inView] = useReveal<HTMLElement>()
  const on = inView ? ' is-in' : ''

  return (
    <section className="visit" id="visit" ref={sectionRef}>
      <div className="visit-edge visit-edge-top" aria-hidden="true" />
      <div className="visit-edge visit-edge-bottom" aria-hidden="true" />

      <div className="visit-content">
        <div className={'visit-heading' + on}>
          <div className="visit-heading-inner">
            <div className="visit-label-rv">
              <div className="visit-label">
                <span className="visit-label-dot" aria-hidden="true" />
                <p className="visit-label-text">
                  <LabelChars />
                </p>
              </div>
            </div>
            <div className="visit-accent1" aria-hidden="true" />
            <h2 className="visit-title">
              {TITLE_WORDS.map((word, i) => (
                <Fragment key={word + i}>
                  {i > 0 ? ' ' : null}
                  <span className="visit-word" style={{ '--i': i } as CSSProperties}>
                    {word}
                  </span>
                </Fragment>
              ))}
            </h2>
          </div>
          <div className="visit-accent2" aria-hidden="true" />
        </div>

        <div className="visit-info">
          <div className={'visit-pane visit-pane-a' + on} style={{ '--i': 0 } as CSSProperties}>
            <div className="visit-card visit-card-photo">
              <div className="visit-img-wrap">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`${tall768Avif} 768w, ${tallAvif} 1200w`}
                    sizes={SIZES_SPAN4}
                  />
                  <source
                    type="image/webp"
                    srcSet={`${tall768Webp} 768w, ${tallWebp} 1200w`}
                    sizes={SIZES_SPAN4}
                  />
                  <img
                    className="visit-img"
                    src={tallImg}
                    srcSet={`${tall768Img} 768w, ${tallImg} 1200w`}
                    sizes={SIZES_SPAN4}
                    alt=""
                    width={1200}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <div className="visit-card-text">
                <p className="visit-card-label">Cherry on top</p>
              </div>
            </div>
          </div>

          <div className="visit-pane visit-pane-b">
            <div className={'visit-rv visit-rv-sweet' + on} style={{ '--i': 1 } as CSSProperties}>
              <div className="visit-card visit-card-photo">
                <div className="visit-img-wrap">
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={`${sweet512Avif} 512w, ${sweet1024Avif} 1024w, ${sweetAvif} 1200w`}
                      sizes={SIZES_SPAN5}
                    />
                    <source
                      type="image/webp"
                      srcSet={`${sweet512Webp} 512w, ${sweet1024Webp} 1024w, ${sweetWebp} 1200w`}
                      sizes={SIZES_SPAN5}
                    />
                    <img
                      className="visit-img"
                      src={sweetImg}
                      srcSet={`${sweet512Img} 512w, ${sweet1024Img} 1024w, ${sweetImg} 1200w`}
                      sizes={SIZES_SPAN5}
                      alt="A couple enjoying coffee at a sunlit cafe table, with a barista working in the background."
                      width={1200}
                      height={900}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
                <div className="visit-card-text">
                  <p className="visit-card-label">Sweet little moment</p>
                </div>
              </div>
            </div>

            <div className="visit-contact-items">
              <div
                className={'visit-rv visit-rv-contact' + on}
                style={{ '--i': 3 } as CSSProperties}
              >
                <a
                  className="visit-contact visit-contact-address"
                  href="https://google.com/maps"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="visit-contact-info">
                    <div className="visit-contact-label">
                      <p>Mello’s here</p>
                    </div>
                    <div className="visit-address">
                      <h3>28 Roastery Lane, Brooklyn, NY</h3>
                    </div>
                  </div>
                  <div className="visit-mark visit-mark-pin" aria-hidden="true" />
                </a>
              </div>

              <div className={'visit-rv visit-rv-hello' + on} style={{ '--i': 4 } as CSSProperties}>
                <a className="visit-contact visit-contact-hello" href="mailto: hi@mello.com">
                  <h3 className="visit-hello-text">Say hello!</h3>
                  <div className="visit-mark visit-mark-flower" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="visit-pane visit-pane-c">
            <div className={'visit-rv visit-rv-hours' + on} style={{ '--i': 2 } as CSSProperties}>
              <div className="visit-hours">
                <div className="visit-hours-info">
                  <div className="visit-hours-label">
                    <p>See you soon</p>
                  </div>
                  <h3 className="visit-hours-text">
                    <span>Open daily,</span>
                    <br />
                    <span>7AM–6PM.</span>
                  </h3>
                </div>
                <div className="visit-mark visit-mark-burst" aria-hidden="true" />
              </div>
            </div>

            <div className={'visit-rv visit-rv-trio' + on} style={{ '--i': 5 } as CSSProperties}>
              <div className="visit-card visit-card-photo">
                <div className="visit-img-wrap">
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={`${trio768Avif} 768w, ${trioAvif} 1200w`}
                      sizes={SIZES_SPAN3}
                    />
                    <source
                      type="image/webp"
                      srcSet={`${trio768Webp} 768w, ${trioWebp} 1200w`}
                      sizes={SIZES_SPAN3}
                    />
                    <img
                      className="visit-img"
                      src={trioImg}
                      srcSet={`${trio768Img} 768w, ${trioImg} 1200w`}
                      sizes={SIZES_SPAN3}
                      alt=""
                      width={1200}
                      height={1600}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
                <div className="visit-card-text">
                  <p className="visit-card-label">The Mello trio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
