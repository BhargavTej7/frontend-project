const StatCard = ({ label, value, hint, trend, icon, tone = 'default' }) => {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon" aria-hidden>{icon ?? '📈'}</div>
      <div className="stat-details">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {hint && <span className="stat-hint">{hint}</span>}
      </div>
      {trend && (
        <span className={`stat-trend ${trend.direction}`}>
          {trend.direction === 'up' ? '▲' : '▼'} {trend.value}
        </span>
      )}
    </div>
  )
}

export default StatCard


