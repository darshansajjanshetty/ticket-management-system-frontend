import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        name: form.username,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login({ token: response.data.token, user: response.data.user });
      navigate('/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div className="auth-visual-panel">
          <span className="auth-badge">Create account</span>
          <h1>Build a support experience customers trust.</h1>
          <p>
            Join the workspace, open requests quickly, and give every customer a clear, modern support journey.
          </p>
          <ul className="feature-list">
            <li>Fast onboarding</li>
            <li>Secure access</li>
            <li>Clear support flow</li>
          </ul>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">New here?</span>
          <h2>Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
