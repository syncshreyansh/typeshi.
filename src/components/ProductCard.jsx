import { Link } from 'react-router-dom'
import { ProductImage } from './ProductImage'
import { formatINR } from '../lib/format'

export function ProductCard({ product, index = 0, variant = 0, compact = false }) {
  const variantName = `product-card-variant-${variant % 3 + 1}`
  return (
    <article className={`product-card ${variantName} ${compact ? 'product-card-compact' : ''}`} data-product-id={product.id}>
      <Link to={`/shop/${product.slug}`} className="product-card-link" aria-label={`View ${product.name}`}>
        <div className="product-card-image-wrap">
          <ProductImage product={product} image={product.images[0]} className="product-card-image" />
          <ProductImage product={product} image={product.images[1]} className="product-card-image product-card-image-swap" />
          <span className="product-card-index">{String(index + 1).padStart(2, '0')}</span>
          {product.tag && <span className="product-card-tag label">{product.tag}</span>}
        </div>
        <div className="product-card-meta">
          <div>
            <h2 className="label">{product.name}</h2>
            <p className="body">{product.category} / {product.drop}</p>
          </div>
          <span className="label">{formatINR(product.price)}</span>
        </div>
        <div className="product-card-footer">
          <span className="body">{product.shortDescription}</span>
          <span className="product-swatches" aria-label={`${product.colors.length} colors available`}>
            {product.colors.map((color) => <i key={color.name} title={color.name} style={{ backgroundColor: color.hex }} />)}
          </span>
        </div>
      </Link>
    </article>
  )
}
