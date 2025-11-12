import StatCard from '../components/StatCard.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { formatCurrency } from '../utils/formatters.js'

const Insights = () => {
  const {
    state: { products, orders },
  } = useAppContext()

  const deliveredOrders = orders.filter((order) => order.status === 'delivered')

  const avgTicket =
    deliveredOrders.reduce((sum, order) => sum + order.totalPrice, 0) /
    (deliveredOrders.length || 1)

  const processingTrends = products.reduce(
    (acc, product) => {
      product.valueAdd?.forEach((technique) => {
        acc[technique] = (acc[technique] ?? 0) + 1
      })
      return acc
    },
    {},
  )

  const topTechniques = Object.entries(processingTrends)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="page insights">
      <header className="page-header">
        <div>
          <h1>Export intelligence</h1>
          <p>
            Spot demand signals, prioritize product development, and unlock new
            value-add categories using platform data.
          </p>
        </div>
      </header>

      <section className="stats">
        <StatCard
          label="Average delivered ticket size"
          value={formatCurrency(avgTicket || 0)}
          hint="Delivered order value over the last 90 days"
          icon="💹"
        />
        <StatCard
          label="Active processing techniques"
          value={topTechniques.length}
          hint="Unique value-add methods utilised by farmers"
          icon="⚙️"
        />
        <StatCard
          label="Export velocity"
          value={`${deliveredOrders.length} deliveries`}
          hint="Number of delivered orders this season"
          icon="🚢"
        />
      </section>

      <section className="insights-grid">
        <article>
          <h2>Top value-add playbooks</h2>
          <ol>
            {topTechniques.length ? (
              topTechniques.map(([technique, count]) => (
                <li key={technique}>
                  <strong>{technique}</strong> — adopted in {count} SKU(s)
                </li>
              ))
            ) : (
              <li>No value-add data yet. Encourage farmers to detail their process.</li>
            )}
          </ol>
        </article>
        <article>
          <h2>Emerging buyer requests</h2>
          <ul>
            <li>Clean-label snacks for modern trade retailers in the EU.</li>
            <li>Functional beverage ingredients with traceable sourcing.</li>
            <li>Regenerative agriculture storytelling for premium cafes.</li>
            <li>Compostable packaging solutions for direct-to-consumer brands.</li>
          </ul>
        </article>
        <article>
          <h2>Action playbook</h2>
          <p>
            Use these insights to prioritize product development, align farmer
            cohorts with buyer demand, and surface financing opportunities tied
            to working capital needs.
          </p>
          <ul>
            <li>
              Bundle processing SOPs with short explainer videos for quick
              adoption.
            </li>
            <li>
              Offer micro-grants for packaging R&amp;D tied to circular economy
              metrics.
            </li>
            <li>
              Highlight success stories in marketplace hero slots weekly.
            </li>
          </ul>
        </article>
      </section>
    </div>
  )
}

export default Insights


