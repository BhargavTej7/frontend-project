import { useAppContext } from '../context/AppContext.jsx'
import { formatCurrency } from '../utils/formatters.js'

const Stories = () => {
  const {
    state: { users, products, feedback, orders },
  } = useAppContext()

  const successStories = feedback.slice(0, 3).map((item) => {
    const buyer = users.find((user) => user.id === item.buyerId)
    const order = orders.find((o) => o.id === item.orderId)
    const product = products.find((p) => p.id === order?.productId)
    const farmer = users.find((user) => user.id === order?.farmerId)

    return {
      id: item.id,
      buyer,
      product,
      farmer,
      comment: item.comment,
      rating: item.rating,
      order,
    }
  })

  return (
    <div className="page stories">
      <header className="page-header">
        <div>
          <h1>Stories of rural entrepreneurship</h1>
          <p>
            Meet the farmers transforming crops into premium products and the
            buyers championing equitable trade.
          </p>
        </div>
      </header>

      <section className="stories-grid">
        {successStories.length ? (
          successStories.map((story) => (
            <article key={story.id} className="story-card">
              <header>
                <span className="story-role">{story.farmer?.role}</span>
                <h2>{story.farmer?.name}</h2>
                <p>{story.farmer?.location}</p>
              </header>
              <p className="story-comment">“{story.comment}”</p>
              <div className="story-meta">
                <div>
                  <span className="label">Buyer</span>
                  <strong>{story.buyer?.name}</strong>
                </div>
                <div>
                  <span className="label">Product</span>
                  <strong>{story.product?.name}</strong>
                </div>
                <div>
                  <span className="label">Order value</span>
                  <strong>{formatCurrency(story.order?.totalPrice ?? 0)}</strong>
                </div>
                <div>
                  <span className="label">Rating</span>
                  <strong>{'⭐'.repeat(story.rating)}</strong>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="empty-state">
            Stories will populate as buyers leave feedback on delivered orders.
          </p>
        )}
      </section>

      <section className="stories-footer">
        <h2>Amplify your story next</h2>
        <p>
          Share behind-the-scenes photos, talk about producer communities, and
          highlight climate-smart practices. We spotlight new stories on the
          marketplace home page every week.
        </p>
      </section>
    </div>
  )
}

export default Stories


