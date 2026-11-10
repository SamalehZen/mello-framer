import { type CSSProperties } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Category = {
  title: string[]
  desc: string
  vols: string[]
  items: string[][]
}

const CATEGORIES: Category[] = [
  {
    title: ['Espresso', 'bar'],
    desc: 'Fresh espresso classics.',
    vols: ['8 oz', '16 oz'],
    items: [
      ['Espresso', '$3.00', '$4.00'],
      ['Americano', '$3.50', '$4.50'],
      ['Cappuccino', '$4.25', '$5.50'],
      ['Mello flat white', '$4.50', '$5.75'],
      ['Café latte', '$4.75', '$6.00'],
    ],
  },
  {
    title: ['Coffee', 'favorites'],
    desc: 'Sweet, creamy coffee creations.',
    vols: ['8 oz', '16 oz'],
    items: [
      ['Classic mocha', '$5.00', '$6.25'],
      ['Cherry cloud mocha', '$5.00', '$6.00'],
      ['Vanilla latte', '$5.00', '$6.25'],
      ['Caramel latte', '$5.00', '$6.25'],
      ['Hot chocolate', '$4.50', '$5.75'],
    ],
  },
  {
    title: ['Matcha', '&', 'tea'],
    desc: 'Green, bright, and refreshing.',
    vols: ['8 oz', '16 oz'],
    items: [
      ['Cold matcha', '$5.25', '$6.00'],
      ['Strawberry matcha', '$5.50', '$6.50'],
      ['Classic matcha latte', '$5.00', '$6.25'],
      ['Chai latte', '$4.75', '$6.00'],
      ['English breakfast tea', '$3.50', '$4.50'],
    ],
  },
  {
    title: ['Cold', 'drinks'],
    desc: 'Cool drinks for brighter days.',
    vols: ['8 oz', '16 oz'],
    items: [
      ['Cold brew', '$4.50', '$5.75'],
      ['Iced latte', '$4.75', '$6.00'],
      ['Espresso tonic', '$5.00', '$6.25'],
      ['Sparkling citrus', '$4.00', '$5.25'],
    ],
  },
  {
    title: ['Blended', 'favorites'],
    desc: 'Cold, creamy, and smooth.',
    vols: ['8 oz', '16 oz'],
    items: [
      ['Matcha blend', '$5.25', '$6.50'],
      ['Mocha shake', '$5.50', '$6.75'],
      ['Strawberry cream', '$5.25', '$6.50'],
      ['Caramel coffee blend', '$5.50', '$6.75'],
      ['Banana oat smoothie', '$5.00', '$6.25'],
    ],
  },
  {
    title: ['Bakes', '&', 'bites'],
    desc: 'Freshly baked little treats.',
    vols: ['x1', 'x4'],
    items: [
      ['Big cinny bun', '$5.50', '$18.00'],
      ['Butter croissant', '$4.00', '$14.00'],
      ['Chocolate cookie', '$3.50', '$12.00'],
      ['Banana bread', '$4.50', '$16.00'],
      ['Blueberry muffin', '$4.25', '$15.00'],
    ],
  },
]

function CategoryBlock({ cat }: { cat: Category }) {
  return (
    <div className="menu-cat">
      <div className="menu-cat-head">
        <h3 className="menu-cat-title">
          {cat.title.map((w, i) => (
            <span className="w" key={i}>
              {w}
            </span>
          ))}
        </h3>
        <div className="menu-cat-meta">
          <p className="menu-cat-desc">{cat.desc}</p>
          <div className="menu-cat-vols">
            {cat.vols.map((v) => (
              <p className="menu-vol" key={v}>
                {v}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="menu-items">
        {cat.items.map((it) => (
          <div className="menu-item" key={it[0]}>
            <p className="menu-item-name">{it[0]}</p>
            <div className="menu-item-prices">
              <p className="menu-price">{it[1]}</p>
              <p className="menu-price">{it[2]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Menu() {
  const [ref, revealed] = useReveal<HTMLElement>({ threshold: 0.2 })

  return (
    <section className={`menu${revealed ? ' is-in' : ''}`} id="menu" ref={ref}>
      <div className="menu-content">
        <div className="menu-heading">
          <span className="menu-heart-rv" aria-hidden="true">
            <span className="menu-heart" />
          </span>
          <h2 className="menu-title">
            <span className="line">
              <span className="w" style={{ '--i': 0 } as CSSProperties}>
                The
              </span>
              <span className="w" style={{ '--i': 1 } as CSSProperties}>
                complete
              </span>
            </span>
            <span className="line">
              <span className="w" style={{ '--i': 2 } as CSSProperties}>
                Mello
              </span>
              <span className="w" style={{ '--i': 3 } as CSSProperties}>
                menu
              </span>
            </span>
          </h2>
        </div>
        <div className="menu-info">
          <div className="menu-cats">
            {CATEGORIES.map((cat) => (
              <CategoryBlock cat={cat} key={cat.title.join(' ')} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
