import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'

const Auth = () => {
  const { login, registerUser } = useAppContext()
  const navigate = useNavigate()

  const [mode, setMode] = useState('signin')
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
      role: 'farmer',
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

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <>
              <div className="form-field">
                <label htmlFor="role">I am a</label>
                <select
                  id="role"
                  name="role"
                  value={formState.role}
                  onChange={handleChange}
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
          ) : null}

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
            {mode === 'signin' ? 'Access dashboard' : 'Create account'}
          </button>
        </form>

        <p className="auth-note">
          Need admin access? Use the seeded credentials{' '}
          <code>admin@farmlink.io / admin123</code>
        </p>
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


