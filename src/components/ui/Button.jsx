import { Link } from 'react-router-dom'
import { Arrow } from '../Arrow'

const common = 'inline-flex min-h-[44px] items-center justify-center label transition-colors duration-200'

export function SolidButton({ children, className = '', ...props }) {
  const content = <span className="button-roll"><span className="button-label">{children}</span><span className="button-label button-label-clone" aria-hidden="true">{children}</span></span>
  const classes = `${common} button-solid relative overflow-hidden rounded-lg bg-[var(--btn-solid-bg)] px-md py-md text-[var(--btn-solid-fg)] ${className}`
  return props.to ? <Link className={classes} {...props}>{content}</Link> : <button className={classes} {...props}>{content}</button>
}

export function TextLink({ children, className = '', ...props }) {
  const content = <><span className="text-link-label">{children}</span><Arrow className="ml-xs transition-transform duration-200" /></>
  const classes = `${common} button-text-link group gap-xs text-ink ${className}`
  return props.to ? <Link className={classes} {...props}>{content}</Link> : <a className={classes} {...props}>{content}</a>
}

export function OutlineButton({ children, className = '', ...props }) {
  const content = <><span className="outline-label">{children}</span><span className="button-wipe" aria-hidden="true" /></>
  const classes = `${common} button-outline relative overflow-hidden rounded-lg border border-[#516254] px-md py-md text-ink ${className}`
  return props.to ? <Link className={classes} {...props}>{content}</Link> : <button className={classes} {...props}>{content}</button>
}
