import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'

const Auth = () => {
  const { login, registerUser } = useAppContext()
  const navigate = useNavigate()

  const [mode, setMode] = useState('signin')
  const [selectedRole, setSelectedRole] = useState('farmer')
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    location: '',
    expertise: '',
  })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () =>
    setFormState({
      name: '',
      email: '',
      password: '',
      role: selectedRole,
      location: '',
      expertise: '',
    })

  const goToDashboard = (role) => {
    if (role === 'admin') navigate('/admin')
    else if (role === 'farmer') navigate('/farmer')
    else navigate('/marketplace')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    try {
      if (mode === 'signin') {
        const user = login(formState.email, formState.password)
        goToDashboard(user.role)
      } else {
        const expertiseList = formState.expertise
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)

        const user = registerUser({
          name: formState.name.trim(),
          email: formState.email.trim(),
          password: formState.password,
          role: formState.role,
          location: formState.location.trim(),
          expertise: expertiseList,
        })

        resetForm()
        goToDashboard(user.role)
      }
    } catch (submissionError) {
      setError(submissionError.message)
    }
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setFormState((prev) => ({ ...prev, role }))
    setError('')
  }

  return (
    <div className="page auth">
      <section className="auth-panel">
        <div className="auth-toggle">
          <button
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => {
              setMode('signin')
              setError('')
            }}
          >
            Sign in
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => {
              setMode('register')
              setError('')
            }}
          >
            Create account
          </button>
        </div>

        {mode === 'signin' && (
          <div className="role-selector">
            <h3>Select your role to login</h3>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('admin')}
              >
                <span className="role-icon">👨‍💼</span>
                <span className="role-label">Admin</span>
              </button>
              <button
                type="button"
                className={`role-btn ${selectedRole === 'farmer' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('farmer')}
              >
                <span className="role-icon">👨‍🌾</span>
                <span className="role-label">Farmer</span>
              </button>
              <button
                type="button"
                className={`role-btn ${selectedRole === 'buyer' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('buyer')}
              >
                <span className="role-icon">🛒</span>
                <span className="role-label">Buyer</span>
              </button>
            </div>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <>
              <div className="form-field">
                <label htmlFor="role">I am a</label>
                <select
                  id="role"
                  name="role"
                  value={formState.role}
                  onChange={(e) => {
                    handleChange(e)
                    setSelectedRole(e.target.value)
                  }}
                  required
                >
                  <option value="farmer">Farmer entrepreneur</option>
                  <option value="buyer">Global buyer</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="name">Full name / organization</label>
                <input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="location">Primary location</label>
                <input
                  id="location"
                  name="location"
                  value={formState.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  required
                />
              </div>
              {formState.role === 'farmer' ? (
                <div className="form-field">
                  <label htmlFor="expertise">
                    Value-add focus areas (comma separated)
                  </label>
                  <input
                    id="expertise"
                    name="expertise"
                    value={formState.expertise}
                    onChange={handleChange}
                    placeholder="E.g. solar dehydration, herbal infusions"
                  />
                </div>
              ) : null}
            </>
          ) : (
            <div className="form-field">
              <label>Login as: <strong>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</strong></label>
            </div>
          )}

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="cta primary wide">
            {mode === 'signin' ? `Login as ${selectedRole}` : 'Create account'}
          </button>
        </form>

        {mode === 'signin' && (
          <div className="auth-credentials">
            <p className="auth-note">
              <strong>Demo Credentials:</strong>
            </p>
            <div className="credentials-list">
              <div className="credential-item">
                <strong>Admin:</strong> 2400030791@kluniversity.in / bhargav
              </div>
              <div className="credential-item">
                <strong>Farmer:</strong> 2400080026@kluniversity.in / farmer123
              </div>
              <div className="credential-item">
                <strong>Buyer:</strong> 2300031957@kluniversity.in / buyer123
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="auth-aside">
        <div className="aside-card">
          <h2>Market-ready playbooks for farmers</h2>
          <p>
            Get processing SOPs, compliance checklists, and packaging templates
            tailored to your crop. Launch value-added SKUs in under 6 weeks.
          </p>
        </div>
        <div className="aside-card">
          <h2>Verified sourcing for buyers</h2>
          <p>
            Tap into traceable, smallholder-led supply chains. Compare carbon
            footprints, sensory notes, and processing techniques instantly.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Auth


