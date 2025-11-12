import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'

const baseLinks = [{ to: '/', label: 'Home' }]

const roleLinks = {
  admin: [
    { to: '/admin', label: 'Admin' },
    { to: '/insights', label: 'Insights' },
  ],
  farmer: [
    { to: '/farmer', label: 'Farmer Hub' },
    { to: '/resources', label: 'Resources' },
  ],
  buyer: [
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/stories', label: 'Impact' },
  ],
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { currentUser, logout } = useAppContext()
  const navigate = useNavigate()

  const handleLogin = () => {
    setOpen(false)
    navigate('/auth')
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  const links = [...baseLinks]

  if (currentUser?.role) {
    links.push(...(roleLinks[currentUser.role] ?? []))
  } else {
    links.push({ to: '/marketplace', label: 'Marketplace' })
  }

  return (
    <header className="navigation">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-icon">🌱</span>
          <div>
            <span className="brand-name">AgriValue Exchange</span>
            <span className="brand-tagline">Grow. Transform. Export.</span>
          </div>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {currentUser ? (
            <div className="nav-actions">
              <span className="user-pill">
                <span className="user-role">{currentUser.role}</span>
                <span className="user-name">{currentUser.name}</span>
              </span>
              <button className="cta secondary" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="nav-actions">
              <button className="cta ghost" onClick={() => navigate('/marketplace')}>
                Browse Products
              </button>
              <button className="cta primary" onClick={handleLogin}>
                Sign in
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar


