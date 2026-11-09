import Header from '@/sections/Header'
import Hero from '@/sections/Hero'
import InfoBar from '@/sections/InfoBar'
import Ticker from '@/sections/Ticker'
import Products from '@/sections/Products'
import Menu from '@/sections/Menu'
import Mood from '@/sections/Mood'
import Time from '@/sections/Time'
import Philosophy from '@/sections/Philosophy'
import Atmosphere from '@/sections/Atmosphere'
import Testimonials from '@/sections/Testimonials'
import Visit from '@/sections/Visit'
import Footer from '@/sections/Footer'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function App() {
  const isMobile = useMediaQuery('(max-width: 767.98px)')
  return (
    <main>
      <div className="top-stack" id="top">
        <InfoBar marquee={isMobile} />
        <Header />
      </div>
      <Hero isMobile={isMobile} />
      <Ticker speed={50} />
      <Products />
      <Menu />
      <Ticker speed={50} />
      <Mood />
      <Time />
      <Philosophy />
      <Ticker speed={50} />
      <Atmosphere />
      <Testimonials />
      <Visit />
      <Footer />
    </main>
  )
}
