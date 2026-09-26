import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SettingsPage = ({ sidebarOpen = true }) => {
  const location = useLocation();
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'customer',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextUser = { ...user, ...form };
    login({ token: localStorage.getItem('token') || 'local-token', user: nextUser });
    setSaved(true);
  };

  const sidebarItems = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Tickets', to: '/tickets' },
    { label: 'Customers', to: '/customers' },
    { label: 'Agents', to: '/agents' },
    { label: 'Reports', to: '/reports' },
    { label: 'Knowledge Base', to: '/knowledge-base' },
    { label: 'Notifications', to: '/notifications' },
    { label: 'Settings', to: '/settings' },
  ];

  return (
    <div className={`support-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className={`support-sidebar ${sidebarOpen ? '' : 'sidebar-hidden'}`}>
        <div className="sidebar-brand">
          <span className="brand-mark">S</span>
          <span>SupportDesk</span>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map(({ label, to }) => {
            const isActive = to === '/dashboard'
              ? ['/dashboard', '/customer-dashboard', '/agent-dashboard'].includes(location.pathname)
              : location.pathname === to;

            return (
              <Link key={label} to={to} className={isActive ? 'sidebar-item active' : 'sidebar-item'}>
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="dashboard-main-panel">
        <div className="status-strip">
          <span className="status-inline">User settings</span>
        </div>

        <div className="panel">
          <div className="panel-header-row">
            <div>
              <span className="panel-kicker">Profile</span>
              <h3>Workspace preferences</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '560px' }}>
            <div className="field-group">
              <label htmlFor="name">Display name</label>
              <input id="name" type="text" name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="field-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            {saved && <p className="success-message">Settings updated successfully.</p>}

            <button type="submit" className="btn btn-primary">Save settings</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
