import { useMemo, useState } from 'react'
import OrderCard from '../components/OrderCard.jsx'
import StatCard from '../components/StatCard.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

const ORDER_STATUSES = [
  { label: 'Confirm', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'In transit', value: 'in_transit' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancel', value: 'cancelled' },
]

const AdminDashboard = () => {
  const { state, toggleUserStatus, approveProduct, updateOrderStatus } =
    useAppContext()
  const [filterStatus, setFilterStatus] = useState('all')

  const farmers = state.users.filter((user) => user.role === 'farmer')
  const buyers = state.users.filter((user) => user.role === 'buyer')

  const pendingProducts = state.products.filter(
    (product) => product.status === 'pending',
  )

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return state.orders
    return state.orders.filter((order) => order.status === filterStatus)
  }, [state.orders, filterStatus])

  const totalGmv = state.orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  )

  const activeFarmers = farmers.filter((farmer) => farmer.status === 'active')
  const suspendedUsers = state.users.filter(
    (user) => user.status === 'suspended',
  )

  return (
    <div className="page admin">
      <header className="page-header">
        <div>
          <h1>Platform Operations Command</h1>
          <p>
            Monitor market activity, approve products, and maintain trust across
            every transaction in the ecosystem.
          </p>
        </div>
      </header>

      <section className="stats">
        <StatCard
          label="Gross marketplace volume"
          value={formatCurrency(totalGmv)}
          hint="Inclusive of confirmed cross-border orders"
          icon="💱"
        />
        <StatCard
          label="Active farmer ventures"
          value={`${activeFarmers.length} / ${farmers.length}`}
          hint="Farmers with approved SKUs and consistent supply"
          icon="👩🏾‍🌾"
          tone="success"
        />
        <StatCard
          label="Buy-side demand"
          value={`${buyers.length} buyers`}
          hint="Procurement teams with verified credentials"
          icon="🤝"
        />
        <StatCard
          label="Compliance alerts"
          value={`${suspendedUsers.length} accounts`}
          hint="Accounts paused due to due-diligence holds"
          icon="⚠️"
          tone={suspendedUsers.length ? 'warning' : 'default'}
        />
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <header>
            <h2>Account governance</h2>
            <p>Activate or pause stakeholders. Suspended users lose access instantly.</p>
          </header>
          <div className="table">
            <div className="table-head">
              <span>Name</span>
              <span>Role</span>
              <span>Location</span>
              <span>Joined</span>
              <span>Status</span>
              <span aria-label="Actions" />
            </div>
            {state.users
              .filter((user) => user.role !== 'admin')
              .map((user) => (
                <div className="table-row" key={user.id}>
                  <span>{user.name}</span>
                  <span className="pill">{user.role}</span>
                  <span>{user.location}</span>
                  <span>{formatDate(user.createdAt)}</span>
                  <span className={`status-chip status-${user.status}`}>
                    {user.status}
                  </span>
                  <button
                    className="cta ghost"
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Re-activate'}
                  </button>
                </div>
              ))}
          </div>
        </article>

        <article className="admin-card">
          <header>
            <h2>Product approvals</h2>
            <p>Review SKUs requesting export clearance and mark their status.</p>
          </header>
          {pendingProducts.length ? (
            <ul className="approval-list">
              {pendingProducts.map((product) => (
                <li key={product.id}>
                  <div>
                    <p className="title">{product.name}</p>
                    <p className="meta">{product.category}</p>
                    <p className="description">{product.description}</p>
                  </div>
                  <div className="actions">
                    <button
                      className="cta secondary"
                      onClick={() => approveProduct(product.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="cta ghost"
                      onClick={() => approveProduct(product.id, 'revision_required')}
                    >
                      Request revision
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">
              All submitted products are currently approved. Encourage farmers to
              launch new SKUs!
            </p>
          )}
        </article>
      </section>

      <section className="admin-orders">
        <header className="orders-header">
          <div>
            <h2>Cross-border order pipeline</h2>
            <p>Track milestone completion and intervene when needed.</p>
          </div>
          <div className="filter-group">
            <label htmlFor="status-filter">Filter</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </header>

        <div className="order-list">
          {filteredOrders.length ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={ORDER_STATUSES.map((status) => ({
                  label: status.label,
                  tone:
                    status.value === 'cancelled'
                      ? 'danger'
                      : status.value === 'delivered'
                      ? 'success'
                      : 'ghost',
                  onClick: () => updateOrderStatus(order.id, status.value),
                }))}
              />
            ))
          ) : (
            <p className="empty-state">No orders match this status filter.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard


