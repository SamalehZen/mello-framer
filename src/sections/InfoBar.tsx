import { Fragment } from 'react'
import Marquee from '@/components/Marquee'

const ITEMS = ['28 Roastery Lane, Brooklyn', 'Open daily 7AM–6PM', 'Coffee, matcha & fresh bakes daily']

export default function InfoBar({ marquee = false }: { marquee?: boolean }) {
  const row = (
      <div className="info-bar-inner">
        {ITEMS.map((t, i) => (
          <Fragment key={t}>
            <p className="info-text">{t}</p>
            {i < ITEMS.length - 1 ? (
              <span className="info-heart" aria-hidden="true" />
            ) : null}
          </Fragment>
        ))}
      </div>
  )
  return (
    <div className="info-bar">
      {marquee ? <Marquee speed={6.9}>{row}</Marquee> : row}
    </div>
  )
}
