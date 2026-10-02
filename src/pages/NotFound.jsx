import { useEffect, useRef } from 'react'
import { OutlineButton, TextLink } from '../components/ui/Button'
import { setPageMeta } from '../lib/meta'
import { useLineReveal } from '../hooks/useLineReveal'
import { usePreloader } from '../components/Preloader'

export function NotFound() {
  const pageRef = useRef(null)
  const { preloaderDone } = usePreloader()
  useLineReveal({ scope: pageRef, preloaderDone, selector: '[data-line-reveal]' })
  useEffect(() => { setPageMeta('404 / Typeshi', 'That Typeshi page could not be found.') }, [])
  return (
    <section ref={pageRef} className="not-found-page min-h-[45vh] border-b border-hairline pb-section">
      <p className="label mb-xl text-muted">Error / 404</p>
      <div className="line-reveal-mask"><h1 data-line-reveal className="display-xl max-w-[10ch] break-all"><span className="line-reveal-word">Wrong turn.</span></h1></div>
      <div className="not-found-actions"><TextLink to="/">Back home</TextLink><OutlineButton to="/shop">Shop the pieces</OutlineButton></div>
    </section>
  )
}
