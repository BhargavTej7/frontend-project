import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { formatCurrency, timeAgo } from '../utils/formatters.js'

const BuyerMarketplace = () => {
  const { state, currentUser, placeOrder, addFeedback } = useAppContext()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(10)
  const [notes, setNotes] = useState('')
  const [feedbackDraft, setFeedbackDraft] = useState({
    orderId: '',
    rating: 5,
    comment: '',
  })
  const [message, setMessage] = useState('')

  const approvedProducts = state.products.filter(
    (product) => product.status === 'approved',
  )

  const categories = useMemo(() => {
    const unique = new Set(approvedProducts.map((product) => product.category))
    return Array.from(unique)
  }, [approvedProducts])

  const filteredProducts = approvedProducts.filter((product) => {
    if (
      search &&
      !product.name.toLowerCase().includes(search.toLowerCase()) &&
      !product.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    if (category !== 'all' && product.category !== category) return false
    return true
  })

  const recentOrders = state.orders
    .filter((order) =>
      currentUser?.role === 'buyer'
        ? order.buyerId === currentUser.id
        : true,
    )
    .slice(0, 4)

  const recentFeedback = state.feedback.slice(0, 6)

  const handleSelectProduct = (product) => {
    if (!currentUser) {
      navigate('/auth')
      return
    }
    setSelectedProduct(product)
    setQuantity(10)
    setNotes('')
    setMessage('')
  }

  const handlePlaceOrder = (event) => {
    event.preventDefault()
    if (!currentUser) {
      navigate('/auth')
      return
    }

    try {
      placeOrder(currentUser.id, {
        productId: selectedProduct.id,
        quantity: Number(quantity),
        notes,
      })
      setMessage('Order placed successfully! We will keep you updated.')
      setSelectedProduct(null)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleFeedbackSubmit = (event) => {
    event.preventDefault()
    if (!currentUser) {
      navigate('/auth')
      return
    }
    if (!feedbackDraft.orderId) return

    addFeedback({
      orderId: feedbackDraft.orderId,
      buyerId: currentUser.id,
      farmerId: state.orders.find((order) => order.id === feedbackDraft.orderId)
        ?.farmerId,
      rating: Number(feedbackDraft.rating),
      comment: feedbackDraft.comment.trim(),
    })
    setFeedbackDraft({ orderId: '', rating: 5, comment: '' })
    setMessage('Feedback submitted. Thank you!')
  }

  const buyerReady = currentUser?.role === 'buyer'

  return (
    <div className="page marketplace">
      <header className="page-header">
        <div>
          <h1>Discover value-added farm innovations</h1>
          <p>
            Source premium, small-batch agricultural products with transparent
            processing journeys and export-ready documentation.
          </p>
        </div>
        <div className="search-panel">
          <input
            type="search"
            placeholder="Search by ingredient, processing technique, flavour..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </header>

      {!buyerReady ? (
        <section className="notice">
          <p>
            Sign in as a buyer to place orders and leave feedback. Existing buyer
            accounts can use <code>procurement@globalfoods.com / buyer123</code>.
          </p>
          <button className="cta primary" onClick={() => navigate('/auth')}>
            Access buyer console
          </button>
        </section>
      ) : null}

      <section className="product-section">
        <header>
          <h2>Featured SKUs</h2>
          <p>{filteredProducts.length} products match your filters.</p>
        </header>
        <div className="product-grid">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
                actionLabel={buyerReady ? 'Request quote' : 'Sign in to order'}
              />
            ))
          ) : (
            <p className="empty-state">
              No products match these filters yet. Try broadening your search or
              contact the admin team for sourcing support.
            </p>
          )}
        </div>
      </section>

      {selectedProduct ? (
        <section className="order-drawer">
          <div className="drawer-content">
            <header>
              <h3>Compose purchase request</h3>
              <button
                className="cta ghost"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </header>
            <div className="drawer-body">
              <h4>{selectedProduct.name}</h4>
              <p>{selectedProduct.description}</p>
              <form onSubmit={handlePlaceOrder}>
                <div className="form-field">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="notes">Notes to farmer</label>
                  <textarea
                    id="notes"
                    rows="3"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Packaging specs, delivery timelines, certifications..."
                  />
                </div>
                {message ? <p className="form-info">{message}</p> : null}
                <button type="submit" className="cta primary wide">
                  Submit purchase request
                </button>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      {buyerReady ? (
        <section className="feedback-section">
          <div>
            <h2>Recent orders</h2>
            <ul className="order-summary">
              {recentOrders.length ? (
                recentOrders.map((order) => {
                  const product = state.products.find(
                    (item) => item.id === order.productId,
                  )
                  return (
                    <li key={order.id}>
                      <div>
                        <strong>{product?.name ?? 'Product removed'}</strong>
                        <span>{timeAgo(order.updatedAt)}</span>
                      </div>
                      <span>{formatCurrency(order.totalPrice)}</span>
                    </li>
                  )
                })
              ) : (
                <li>No recent orders yet.</li>
              )}
            </ul>
          </div>

          <div className="feedback-form-card">
            <h2>Share feedback</h2>
            <p>
              Close the loop with farmers by sharing quality insights. Your inputs
              power continuous improvement and traceable storytelling.
            </p>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-field">
                <label htmlFor="order-select">Select order</label>
                <select
                  id="order-select"
                  value={feedbackDraft.orderId}
                  onChange={(event) =>
                    setFeedbackDraft((prev) => ({
                      ...prev,
                      orderId: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Choose an order</option>
                  {state.orders
                    .filter((order) => order.buyerId === currentUser.id)
                    .map((order) => {
                      const product = state.products.find(
                        (item) => item.id === order.productId,
                      )
                      return (
                        <option key={order.id} value={order.id}>
                          {product?.name} • {formatCurrency(order.totalPrice)}
                        </option>
                      )
                    })}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="rating">Rating</label>
                <input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={feedbackDraft.rating}
                  onChange={(event) =>
                    setFeedbackDraft((prev) => ({
                      ...prev,
                      rating: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-field">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  rows="3"
                  value={feedbackDraft.comment}
                  onChange={(event) =>
                    setFeedbackDraft((prev) => ({
                      ...prev,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="Flavor profile, packaging feedback, market response..."
                  required
                />
              </div>
              <button type="submit" className="cta secondary wide">
                Submit feedback
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <section className="feedback-wall">
        <h2>What global buyers are saying</h2>
        <div className="feedback-grid">
          {recentFeedback.length ? (
            recentFeedback.map((item) => {
              const buyer = state.users.find((user) => user.id === item.buyerId)
              const order = state.orders.find((order) => order.id === item.orderId)
              const product = state.products.find(
                (prod) => prod.id === order?.productId,
              )
              return (
                <figure key={item.id} className="feedback-card">
                  <blockquote>“{item.comment}”</blockquote>
                  <figcaption>
                    <span>{buyer?.name}</span>
                    <span>{product?.name}</span>
                    <span>{'⭐'.repeat(item.rating)}</span>
                  </figcaption>
                </figure>
              )
            })
          ) : (
            <p className="empty-state">
              Feedback will appear here once buyers submit their reviews.
            </p>
          )}
        </div>
      </section>

      {message && !selectedProduct ? (
        <div className="toast">{message}</div>
      ) : null}
    </div>
  )
}

export default BuyerMarketplace


