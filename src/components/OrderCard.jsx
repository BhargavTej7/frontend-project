import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

const STATUS_LABELS = {
  pending: 'Pending confirmation',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  in_transit: 'In transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const OrderCard = ({ order, actions }) => {
  const { state } = useAppContext()

  const product = useMemo(
    () => state.products.find((item) => item.id === order.productId),
    [state.products, order.productId],
  )

  const buyer = useMemo(
    () => state.users.find((user) => user.id === order.buyerId),
    [state.users, order.buyerId],
  )

  const farmer = useMemo(
    () => state.users.find((user) => user.id === order.farmerId),
    [state.users, order.farmerId],
  )

  const statusText = STATUS_LABELS[order.status] ?? order.status

  return (
    <article className="order-card">
      <header>
        <span className={`order-status status-${order.status}`}>{statusText}</span>
        <strong>{product?.name ?? 'Product removed'}</strong>
      </header>

      <dl className="order-grid">
        <div>
          <dt>Quantity</dt>
          <dd>
            {order.quantity} {product?.unit ?? ''}
          </dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>{formatCurrency(order.totalPrice)}</dd>
        </div>
        <div>
          <dt>Buyer</dt>
          <dd>{buyer?.name}</dd>
        </div>
        <div>
          <dt>Farmer</dt>
          <dd>{farmer?.name}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(order.createdAt)}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDate(order.updatedAt)}</dd>
        </div>
      </dl>

      {order.notes ? <p className="order-notes">“{order.notes}”</p> : null}

      {Array.isArray(actions) && actions.length ? (
        <div className="order-actions">
          {actions.map(({ label, onClick, tone = 'default' }) => (
            <button
              key={label}
              className={`cta small ${tone}`}
              onClick={onClick}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  )
}

export default OrderCard


