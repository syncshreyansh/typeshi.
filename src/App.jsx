import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'

const Shop = lazy(() => import('./pages/Shop').then((m) => ({ default: m.Shop })))
const Product = lazy(() => import('./pages/Product').then((m) => ({ default: m.Product })))
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))
import { SmoothScroll } from './components/SmoothScroll'
import { Preloader } from './components/Preloader'
import { RouteTransition } from './components/RouteTransition'
import { ScrollProgress } from './components/ScrollProgress'
import { MotionGlobals } from './components/MotionGlobals'

function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Preloader>
          <MotionGlobals />
          <ScrollProgress />
          <Layout>
            <RouteTransition>
              {(displayLocation) => <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}><Routes location={displayLocation}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<Product />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<LegalPage type="terms" />} />
                <Route path="/privacy" element={<LegalPage type="privacy" />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
              </Routes></Suspense>}
            </RouteTransition>
          </Layout>
        </Preloader>
      </SmoothScroll>
    </BrowserRouter>
  )
}

export default App
