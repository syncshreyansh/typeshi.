import { useEffect } from 'react'
import { setPageMeta } from '../lib/meta'

export function LegalPage({ type }) {
  const isTerms = type === 'terms'
  useEffect(() => { setPageMeta(`${isTerms ? 'Terms' : 'Privacy'} / Typeshi`, isTerms ? 'Plain-language demo terms for the Typeshi storefront.' : 'Plain-language demo privacy information for the Typeshi storefront.') }, [isTerms])
  const title = isTerms ? 'Terms, plainly.' : 'Privacy, plainly.'
  const sections = isTerms ? [
    ['Demo storefront', 'Typeshi is a frontend-only apparel catalogue. Products, prices, accounts, payment, and delivery details shown here are demonstration content.'],
    ['Orders', 'A real storefront would confirm availability, collect payment securely, and send an order confirmation. This build does none of those things.'],
    ['Questions', 'If this were live, the studio would be reachable through the Contact page for order, sizing, and returns questions.'],
  ] : [
    ['What we collect', 'This demonstration stores cart selections in your browser so the frontend flow can be explored. No account or server database is connected.'],
    ['External links', 'The Instagram link leaves this site. Check that service for its own privacy terms.'],
    ['A small promise', 'No demo checkout details are sent anywhere. Clear your browser storage to remove the local cart.'],
  ]
  return <section className="legal-page" aria-labelledby="legal-title"><p className="label mb-xl text-muted">Legal / {isTerms ? 'Terms' : 'Privacy'}</p><h1 id="legal-title" className="display-xl legal-title">{title}</h1><div className="legal-sections">{sections.map(([heading, copy]) => <section key={heading}><h2 className="subheading">{heading}</h2><p className="body">{copy}</p></section>)}</div></section>
}
