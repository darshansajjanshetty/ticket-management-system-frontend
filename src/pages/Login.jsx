import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const demoAccounts = {
  customer: {
    identifier: 'alice@example.com',
    password: 'password123',
  },
  admin: {
    identifier: 'agent@example.com',
    password: 'password123',
  },
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identifier: demoAccounts.customer.identifier,
    password: demoAccounts.customer.password,
  });
  const [selectedRole, setSelectedRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    const account = demoAccounts[role] || demoAccounts.customer;
    setSelectedRole(role);
    setForm({
      identifier: account.identifier,
      password: account.password,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const payload = form.identifier.includes('@')
      ? { email: form.identifier, password: form.password }
      : { username: form.identifier, password: form.password };

    try {
      const response = await api.post('/auth/login', payload);
      const serverRole = response.data.user.role;
      const role = serverRole === 'agent' || selectedRole === 'admin' ? 'agent' : 'customer';
      const user = { ...response.data.user, role };

      login({ token: response.data.token, user });
      navigate(role === 'agent' ? '/agent-dashboard' : '/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div className="auth-visual-panel">
          <span className="auth-badge">SupportOps</span>
          <h1>Customer support that feels instant.</h1>
          <p>
            Manage requests, track progress, and keep every conversation moving with one calm operational view.
          </p>
          <ul className="feature-list">
            <li>Live ticket visibility</li>
            <li>Priority-based routing</li>
            <li>Faster response loops</li>
          </ul>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">Welcome back</span>
          <h2>Login</h2>
        </div>

        <div className="role-toggle">
          <button
            type="button"
            className={selectedRole === 'customer' ? 'role-pill active' : 'role-pill'}
            onClick={() => handleRoleSelect('customer')}
          >
            Customer
          </button>
          <button
            type="button"
            className={selectedRole === 'admin' ? 'role-pill active' : 'role-pill'}
            onClick={() => handleRoleSelect('admin')}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label htmlFor="identifier">Username or email</label>
            <input
              id="identifier"
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="Enter username or email"
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
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
