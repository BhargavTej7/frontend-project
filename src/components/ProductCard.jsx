import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { formatCurrency, timeAgo } from '../utils/formatters.js'

const ProductCard = ({ product, onSelect, actionLabel = 'Add to cart' }) => {
  const { state } = useAppContext()

  const farmer = useMemo(
    () => state.users.find((user) => user.id === product.farmerId),
    [state.users, product.farmerId],
  )

  return (
    <article className="product-card">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="product-thumbnail"
        loading="lazy"
      />

      <div className="product-body">
        <div className="product-header">
          <div>
            <h3>{product.name}</h3>
            <p className="product-category">{product.category}</p>
          </div>
          <span className="product-price">
            {formatCurrency(product.price)} / {product.unit}
          </span>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-meta">
          <span className="product-tag">
            Stock: <strong>{product.stock}</strong> {product.unit}
          </span>
          <span className="product-tag ghost">
            Updated {timeAgo(product.lastUpdated)}
          </span>
        </div>

        <div className="product-footer">
          <div className="farmer-info">
            <span className="farmer-avatar" aria-hidden>
              {farmer?.name
                ? farmer.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                : 'F'}
            </span>
            <div>
              <p className="farmer-name">{farmer?.name ?? 'Unknown farmer'}</p>
              <p className="farmer-location">{farmer?.location}</p>
            </div>
          </div>

          {product.status !== 'approved' ? (
            <span className={`product-status status-${product.status}`}>
              {product.status === 'pending' ? 'Awaiting approval' : product.status}
            </span>
          ) : (
            <button className="cta secondary" onClick={() => onSelect?.(product)}>
              {actionLabel}
            </button>
          )}
        </div>

        {product.valueAdd?.length ? (
          <div className="value-add-list">
            {product.valueAdd.map((item) => (
              <span key={item} className="value-chip">
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {product.certifications?.length ? (
          <div className="certifications">
            <span className="cert-label">Certifications</span>
            <div className="cert-grid">
              {product.certifications.map((cert) => (
                <span key={cert}>{cert}</span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default ProductCard


