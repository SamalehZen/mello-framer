import Marquee from '@/components/Marquee'

const ITEMS = [
  'Good coffee',
  'No coffee snobbery',
  'Cold matcha',
  'Oat milk, no drama',
  'Fresh bakes',
  'Pastries before problems',
  'Big smiles',
  'Your inbox can wait',
]

function Heart() {
  return <span className="ticker-heart" aria-hidden="true" />
}

export default function Ticker({ speed }: { speed: number }) {
  return (
    <section className="ticker">
      <Marquee speed={speed}>
        <ul className="ticker-list">
          {ITEMS.map((t) => (
            <li className="ticker-item" key={t}>
              <span>{t}</span>
              <Heart />
            </li>
          ))}
        </ul>
      </Marquee>
    </section>
  )
}
