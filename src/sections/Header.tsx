const LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Place', href: '#place' },
  { label: 'Visit', href: '#visit' },
]

export default function Header() {
  return (
    <div className="site-header">
      <div className="header-inner">
        <a className="logo" href="#top" aria-label="Mello">
          Mello
        </a>
        <nav className="nav">
          {LINKS.map((l) => (
            <a className="nav-link" href={l.href} key={l.label}>
              <span className="nav-pill" aria-hidden="true" />
              <span className="nav-label">{l.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
