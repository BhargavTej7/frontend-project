import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { formatCurrency } from '../utils/formatters.js'

const Landing = () => {
  const {
    state: { products, orders, users },
  } = useAppContext()

  const farmers = users.filter((user) => user.role === 'farmer')
  const buyers = users.filter((user) => user.role === 'buyer')
  const deliveredOrders = orders.filter((order) => order.status === 'delivered')

  const totalExportValue = deliveredOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  )

  return (
    <div className="page landing">
      <section className="hero">
        <div className="hero-content">
          <span className="badge">🌱 Connecting Farms to Markets</span>
          <h1>
            Connect with farmers and buyers worldwide
          </h1>
          <p>
            FarmConnect is your trusted platform for discovering fresh produce, 
            value-added agricultural products, and building sustainable partnerships. 
            Whether you're a farmer looking to expand your reach or a buyer seeking 
            quality products, we make connections simple and transparent.
          </p>
          <div className="hero-actions">
            <Link className="cta primary" to="/marketplace">
              Browse Products
            </Link>
            <Link className="cta secondary" to="/auth">
              Join FarmConnect
            </Link>
          </div>
          <p className="hero-meta">
            <strong>{farmers.length}</strong> active farmers •{' '}
            <strong>{buyers.length}</strong> verified buyers •{' '}
            <strong>{products.length}</strong> products available
          </p>
        </div>

        <div className="hero-visual" role="presentation">
          <div className="visual-grid">
            <div className="visual-card">
              <h3>🌾 Fresh Produce</h3>
              <p>Direct from farm to your table with full traceability.</p>
              <span>Organic • Certified • Fresh</span>
            </div>
            <div className="visual-card highlight">
              <h3>🌿 Value-Added Products</h3>
              <p>Premium processed goods with transparent sourcing.</p>
              <span>Quality Assured</span>
            </div>
            <div className="visual-card">
              <h3>🤝 Trusted Partnerships</h3>
              <p>Build long-term relationships with verified farmers and buyers.</p>
              <span>Secure • Reliable • Sustainable</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <StatCard
          label="Available Products"
          value={products.length}
          hint="Quality products from verified farmers."
          icon="🧺"
          trend={{ value: 'Growing', direction: 'up' }}
        />
        <StatCard
          label="Active Farmers"
          value={`${farmers.length} farmers`}
          hint="Verified farmers ready to connect with buyers."
          icon="👩🏾‍🌾"
          tone="success"
        />
        <StatCard
          label="Total Sales"
          value={formatCurrency(totalExportValue)}
          hint="Successful transactions and partnerships."
          icon="🌍"
          trend={{ value: 'Growing', direction: 'up' }}
        />
      </section>

      <section className="feature-grid">
        <article>
          <h2>Why Choose FarmConnect?</h2>
          <p>
            We bridge the gap between farmers and buyers, creating a seamless 
            marketplace where quality meets demand. Our platform ensures transparency, 
            fair pricing, and sustainable agricultural practices for everyone involved.
          </p>
        </article>
        <article>
          <h3>For Farmers</h3>
          <ul>
            <li>Reach buyers worldwide and expand your market reach.</li>
            <li>Showcase your products with detailed profiles and certifications.</li>
            <li>Manage orders, track sales, and grow your farming business.</li>
          </ul>
        </article>
        <article>
          <h3>For Buyers</h3>
          <ul>
            <li>Discover quality products directly from verified farmers.</li>
            <li>Transparent sourcing with full product traceability.</li>
            <li>Secure transactions and reliable delivery partnerships.</li>
          </ul>
        </article>
      </section>

      <section className="callout">
        <div>
          <h2>Building a sustainable future together.</h2>
          <p>
            FarmConnect is committed to supporting sustainable agriculture and 
            fair trade practices. Join our community of farmers and buyers working 
            together to create a better food system for everyone.
          </p>
        </div>
        <div className="callout-actions">
          <Link className="cta ghost" to="/insights">
            View Insights
          </Link>
          <Link className="cta ghost" to="/stories">
            Success Stories
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing


