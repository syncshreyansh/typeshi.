export function Logo({ className = '', tone = 'light', innerRef }) {
  return <span ref={innerRef} className={`logo-wordmark ${className} ${tone === 'dark' ? 'logo-wordmark-light' : 'logo-wordmark-dark'}`} aria-hidden="true"><img data-logo-image src="/logo/logo.svg" alt="" /><span className="logo-underline" data-logo-underline /></span>
}
