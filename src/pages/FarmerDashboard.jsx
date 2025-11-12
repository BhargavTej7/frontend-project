import { useMemo, useState } from 'react'
import OrderCard from '../components/OrderCard.jsx'
import ProductCard from '../components/ProductCard.jsx'
import StatCard from '../components/StatCard.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { formatCurrency } from '../utils/formatters.js'

const FarmerDashboard = () => {
  const {
    state,
    currentUser,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
  } = useAppContext()

  const farmerProducts = state.products.filter(
    (product) => product.farmerId === currentUser?.id,
  )

  const farmerOrders = state.orders.filter(
    (order) => order.farmerId === currentUser?.id,
  )

  const revenueDelivered = farmerOrders
    .filter((order) => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalPrice, 0)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    unit: '',
    valueAdd: '',
    certifications: '',
    images: '',
  })

  const [editingProductId, setEditingProductId] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () =>
    setForm({
      name: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      unit: '',
      valueAdd: '',
      certifications: '',
      images: '',
    })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!currentUser) return

    const valueAdd = form.valueAdd
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const certifications = form.certifications
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const images = form.images
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        unit: form.unit,
        valueAdd,
        certifications,
        images,
        lastUpdated: Date.now(),
        status: 'pending',
      })
    } else {
      addProduct(currentUser.id, {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        unit: form.unit,
        valueAdd,
        certifications,
        images,
      })
    }

    resetForm()
    setEditingProductId('')
  }

  const startEditing = (product) => {
    setEditingProductId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      unit: product.unit,
      valueAdd: product.valueAdd?.join(', ') ?? '',
      certifications: product.certifications?.join(', ') ?? '',
      images: product.images?.join(', ') ?? '',
    })
  }

  const ctaLabel = editingProductId ? 'Update product' : 'Publish product'

  const nextOrderActions = useMemo(
    () => [
      { label: 'Confirm', value: 'confirmed' },
      { label: 'Processing', value: 'processing' },
      { label: 'Shipped', value: 'shipped' },
      { label: 'Delivered', value: 'delivered' },
    ],
    [],
  )

  return (
    <div className="page farmer">
      <header className="page-header">
        <div>
          <h1>Farmer venture cockpit</h1>
          <p>
            Track your value-added SKUs, monitor export orders, and iterate on
            processing strategies with data-backed insights.
          </p>
        </div>
        <div className="header-summary">
          <StatCard
            label="Live SKUs"
            value={farmerProducts.length}
            hint="Products visible to global buyers"
            icon="🧺"
            tone="success"
          />
          <StatCard
            label="Delivered revenue"
            value={formatCurrency(revenueDelivered)}
            hint="Completed orders ready for payout"
            icon="💸"
          />
        </div>
      </header>

      <section className="farmer-grid">
        <article className="farmer-card">
          <header>
            <h2>{editingProductId ? 'Update your product' : 'Launch a new product'}</h2>
            <p>
              Document your value-add steps, list certifications, and share a
              hero image to stand out to buyers.
            </p>
          </header>

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-field">
                <label htmlFor="name">Product name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Functional foods"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="unit">Unit</label>
                <input
                  id="unit"
                  name="unit"
                  value={form.unit}
                  onChange={handleInputChange}
                  placeholder="kg, packs, cases..."
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="price">Price per unit (USD)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="stock">Available stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="description">Describe your processing journey</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleInputChange}
                placeholder="Share sourcing, processing, flavour notes, shelf-life..."
                required
              />
            </div>

            <div className="grid">
              <div className="form-field">
                <label htmlFor="valueAdd">Value-add techniques</label>
                <textarea
                  id="valueAdd"
                  name="valueAdd"
                  rows={3}
                  value={form.valueAdd}
                  onChange={handleInputChange}
                  placeholder="Solar drying, stone milling, infusion..."
                />
              </div>
              <div className="form-field">
                <label htmlFor="certifications">Certifications</label>
                <textarea
                  id="certifications"
                  name="certifications"
                  rows={3}
                  value={form.certifications}
                  onChange={handleInputChange}
                  placeholder="Organic, HACCP, ISO22000..."
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="images">Image URLs</label>
              <textarea
                id="images"
                name="images"
                rows={2}
                value={form.images}
                onChange={handleInputChange}
                placeholder="Add comma-separated URLs"
              />
            </div>

            <div className="form-actions">
              {editingProductId ? (
                <button
                  type="button"
                  className="cta ghost"
                  onClick={() => {
                    resetForm()
                    setEditingProductId('')
                  }}
                >
                  Cancel edit
                </button>
              ) : (
                <button type="button" className="cta ghost" onClick={resetForm}>
                  Reset form
                </button>
              )}
              <button type="submit" className="cta primary">
                {ctaLabel}
              </button>
            </div>
          </form>
        </article>

        <article className="farmer-card products">
          <header>
            <h2>Your product catalogue</h2>
            <p>
              Keep inventory fresh and respond quickly to admin feedback for
              faster approvals.
            </p>
          </header>

          <div className="farmer-products">
            {farmerProducts.length ? (
              farmerProducts.map((product) => (
                <div className="farmer-product-row" key={product.id}>
                  <ProductCard
                    product={product}
                    actionLabel="Edit product"
                    onSelect={() => startEditing(product)}
                  />
                  <div className="product-controls">
                    <span className={`status-chip status-${product.status}`}>
                      {product.status}
                    </span>
                    <button
                      className="cta ghost"
                      onClick={() =>
                        updateProduct(product.id, {
                          stock: product.stock + 25,
                          lastUpdated: Date.now(),
                        })
                      }
                    >
                      +25 stock
                    </button>
                    <button
                      className="cta danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">
                You haven’t published any value-added products yet. Use the form
                to launch your first SKU!
              </p>
            )}
          </div>
        </article>
      </section>

      <section className="farmer-orders">
        <header>
          <h2>Buyer demand</h2>
          <p>
            Maintain momentum by updating order statuses and sharing progress
            with buyers.
          </p>
        </header>
        <div className="order-list">
          {farmerOrders.length ? (
            farmerOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={nextOrderActions.map((item) => ({
                  label: item.label,
                  onClick: () => updateOrderStatus(order.id, item.value),
                  tone: item.value === 'delivered' ? 'success' : 'ghost',
                }))}
              />
            ))
          ) : (
            <p className="empty-state">
              No orders yet. Keep your catalogue updated and respond quickly to
              buyer enquiries.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default FarmerDashboard


