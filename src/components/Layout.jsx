import { useEffect, useRef, useState } from 'react'
import { Header } from './Header'
import { MenuOverlay } from './MenuOverlay'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { selectCartCount, useCartStore } from '../store/cart'
import { useSmoothScroll } from './SmoothScroll'

export function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const cartRef = useRef(null)
  const cartOpen = useCartStore((state) => state.drawerOpen)
  const cartCount = useCartStore(selectCartCount)
  const openDrawer = useCartStore((state) => state.openDrawer)
  const closeDrawer = useCartStore((state) => state.closeDrawer)
  const { lenis } = useSmoothScroll()

  useEffect(() => {
    const closeForRoute = () => { setMenuOpen(false); closeDrawer() }
    window.addEventListener('typeshi:route-covered', closeForRoute)
    return () => window.removeEventListener('typeshi:route-covered', closeForRoute)
  }, [closeDrawer])

  useEffect(() => {
    const locked = menuOpen || cartOpen
    if (locked) lenis?.stop()
    else lenis?.start()
    document.body.classList.toggle('is-scroll-locked', locked)
    return () => document.body.classList.remove('is-scroll-locked')
  }, [menuOpen, cartOpen, lenis])

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header
        onMenu={() => setMenuOpen((value) => !value)}
        onCart={openDrawer}
        cartCount={cartCount}
        menuOpen={menuOpen}
        menuButtonRef={menuRef}
        cartButtonRef={cartRef}
      />
      <main className="px-xxl pt-[11rem] max-md:px-md max-md:pt-[8rem]">{children}</main>
      <Footer />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusRef={menuRef} />
      <CartDrawer open={cartOpen} onClose={closeDrawer} returnFocusRef={cartRef} />
    </div>
  )
}
