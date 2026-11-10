import { type CSSProperties } from 'react'
import strawberry from '@/assets/img/product-strawberry.jpg'
import cherry from '@/assets/img/product-cherry.jpg'
import cup from '@/assets/img/illus-cup.svg'
import cinnamon from '@/assets/img/illus-cinnamon.svg'
import { useReveal } from '@/hooks/useReveal'

type Card = {
  kind: 'photo' | 'accent' | 'black'
  photo?: string
  illo?: string
  note?: string
  badge?: string
  details: string[]
  title: string
  desc: string
  price: string
  volume: string
}

const TALL: Card = {
  kind: 'photo',
  photo: strawberry,
  badge: 'Favorite',
  details: ['Matcha', 'Strawberry'],
  title: 'Strawberry matcha',
  desc: 'Fresh, creamy, and layered over ice.',
  price: '$6.50',
  volume: '16 oz',
}
const WIDE: Card = {
  kind: 'photo',
  photo: cherry,
  details: ['Cocoa', 'Dark cherry'],
  title: 'Cherry cloud mocha',
  desc: 'Rich mocha with silky cherry cream.',
  price: '$6.00',
  volume: '16 oz',
}
const ACCENT: Card = {
  kind: 'accent',
  illo: cup,
  note: 'Your 8am personality',
  details: ['Espresso', 'Milk'],
  title: 'Mello flat white',
  desc: 'Smooth and perfectly silky.',
  price: '$4.50',
  volume: '8 oz',
}
const BLACK: Card = {
  kind: 'black',
  illo: cinnamon,
  note: 'Sticky fingers guaranteed',
  details: ['Cinnamon', 'Vanilla'],
  title: 'Big cinny bun',
  desc: 'Sticky and freshly baked.',
  price: '$5.50',
  volume: 'x1',
}

function Details({ items, small }: { items: string[]; small?: boolean }) {
  return (
    <span className={`card-details${small ? ' card-details-sm' : ''}`}>
      <span>{items[0]}</span>
      <span className="card-dot" aria-hidden="true" />
      <span>{items[1]}</span>
    </span>
  )
}

function CardBody({ card }: { card: Card }) {
  return (
    <div className="card-body">
      <Details items={card.details} small={card.kind !== 'photo'} />
      <h3 className="card-title">{card.title}</h3>
      <p className="card-desc">{card.desc}</p>
      <p className="card-price">
        {card.price}
        <span className="card-chip">{card.volume}</span>
      </p>
    </div>
  )
}

function Card({ card, index }: { card: Card; index: number }) {
  return (
    <article className={`pcard pcard-${card.kind}`} style={{ '--ci': index } as CSSProperties}>
      {card.photo ? <img className="pcard-img" src={card.photo} alt="" /> : null}
      {card.photo ? <span className="pcard-veil" aria-hidden="true" /> : null}
      {card.badge ? <span className="pcard-badge">{card.badge}</span> : null}
      {card.illo ? (
        <div className="pcard-top">
          <img className="pcard-illo" src={card.illo} alt="" />
          <span className="pcard-note">{card.note}</span>
        </div>
      ) : null}
      <CardBody card={card} />
    </article>
  )
}

export default function Products() {
  const [ref, revealed] = useReveal<HTMLElement>({ threshold: 0.2 })

  return (
    <section className={`products${revealed ? ' is-in' : ''}`} ref={ref}>
      <div className="products-content">
        <header className="products-head">
          <div className="products-heading">
            <p className="products-label">Coffee this way</p>
            <h2 className="products-title">
              <span className="line">
                <span className="w" style={{ '--i': 0 } as CSSProperties}>
                  Choose
                </span>
                <span className="w" style={{ '--i': 1 } as CSSProperties}>
                  your
                </span>
              </span>
              <span className="line">
                <span className="w" style={{ '--i': 2 } as CSSProperties}>
                  cup
                </span>
                <span className="w" style={{ '--i': 3 } as CSSProperties}>
                  of
                </span>
                <span className="w" style={{ '--i': 4 } as CSSProperties}>
                  happy
                </span>
              </span>
            </h2>
          </div>
          <p className="products-intro">Hot, iced, bold, or sweet – there’s a happy cup waiting.</p>
        </header>
        <div className="products-grid">
          <Card card={TALL} index={0} />
          <div className="products-col">
            <Card card={WIDE} index={1} />
            <div className="products-row">
              <Card card={ACCENT} index={2} />
              <Card card={BLACK} index={3} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
