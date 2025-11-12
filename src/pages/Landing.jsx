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
          <span className="badge">FEDF-PS01 • Rural entrepreneurship</span>
          <h1>
            Unlock global markets for value-added agricultural products.
          </h1>
          <p>
            AgriValue Exchange empowers farmers to transform raw crops into high
            value products, build resilient supply chains, and connect directly
            with international buyers who care about provenance and impact.
          </p>
          <div className="hero-actions">
            <Link className="cta primary" to="/marketplace">
              Explore global marketplace
            </Link>
            <Link className="cta secondary" to="/auth">
              Join as farmer or buyer
            </Link>
          </div>
          <p className="hero-meta">
            <strong>{farmers.length}</strong> farmer entrepreneurs •{' '}
            <strong>{buyers.length}</strong> verified buyers •{' '}
            <strong>{products.length}</strong> value-added SKUs
          </p>
        </div>

        <div className="hero-visual" role="presentation">
          <div className="visual-grid">
            <div className="visual-card">
              <h3>Cold-pressed millet snacks</h3>
              <p>Approved for export to EU &amp; GCC markets.</p>
              <span>Traceable lot • Zero additives</span>
            </div>
            <div className="visual-card highlight">
              <h3>Solar-fermented cocoa</h3>
              <p>Premium demand from bean-to-bar chocolatiers.</p>
              <span>+38% price vs raw beans</span>
            </div>
            <div className="visual-card">
              <h3>Artisan jackfruit leather</h3>
              <p>Ready-to-eat sheets with clean-label credentials.</p>
              <span>Made in Kerala</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <StatCard
          label="Impact-ready SKUs"
          value={products.length}
          hint="All products include traceability and compliance docs."
          icon="🧺"
          trend={{ value: '+12 this quarter', direction: 'up' }}
        />
        <StatCard
          label="Export-ready farmers"
          value={`${farmers.length} active`}
          hint="Supported by processing blueprints and finance partners."
          icon="👩🏾‍🌾"
          tone="success"
        />
        <StatCard
          label="Delivered trade volume"
          value={formatCurrency(totalExportValue)}
          hint="Cross-border orders with digital paperwork."
          icon="🌍"
          trend={{ value: '+64%', direction: 'up' }}
        />
      </section>

      <section className="feature-grid">
        <article>
          <h2>Why AgriValue Exchange?</h2>
          <p>
            We provide farmers with processing blueprints, packaging support,
            and digital compliance workflows so that every product meets global
            buyer expectations. Buyers discover curated SKUs with transparent
            sourcing, carbon insights, and ready-to-ship documentation.
          </p>
        </article>
        <article>
          <h3>Farmer innovation labs</h3>
          <ul>
            <li>Product development playbooks with shelf-life validation.</li>
            <li>Access to community owned processing infrastructure.</li>
            <li>Packaging calculators and export labelling templates.</li>
          </ul>
        </article>
        <article>
          <h3>Buyer trust engine</h3>
          <ul>
            <li>Digital product passports with sensory profiles.</li>
            <li>Integrated logistics quotes and cold chain partners.</li>
            <li>Secure escrow and milestone based payouts.</li>
          </ul>
        </article>
      </section>

      <section className="callout">
        <div>
          <h2>Tech-forward from farm to port.</h2>
          <p>
            Built for low connectivity environments and multilingual teams,
            AgriValue Exchange blends field data, quality labs, and digital
            traceability to unlock premium markets for rural entrepreneurs.
          </p>
        </div>
        <div className="callout-actions">
          <Link className="cta ghost" to="/insights">
            View export intelligence
          </Link>
          <Link className="cta ghost" to="/stories">
            Read success stories
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing


