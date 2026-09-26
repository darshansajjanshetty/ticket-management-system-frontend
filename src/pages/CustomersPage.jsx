import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

const CustomersPage = ({ sidebarOpen = true }) => {
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/tickets');
        setTickets(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const customers = useMemo(() => {
    const map = new Map();

    tickets.forEach((ticket) => {
      const key = ticket.user_id || ticket.customer_email || ticket.customer_name || 'anonymous';
      const current = map.get(key) || {
        id: ticket.user_id || key,
        name: ticket.customer_name || 'Customer',
        email: ticket.customer_email || 'customer@example.com',
        total: 0,
        open: 0,
        resolved: 0,
        lastActivity: ticket.updated_at || ticket.created_at,
      };

      current.total += 1;
      if ((ticket.status || 'open') === 'resolved' || (ticket.status || 'open') === 'closed') current.resolved += 1;
      if ((ticket.status || 'open') === 'open' || (ticket.status || 'open') === 'pending' || (ticket.status || 'open') === 'in_progress') current.open += 1;
      current.lastActivity = new Date(ticket.updated_at || ticket.created_at) > new Date(current.lastActivity) ? ticket.updated_at || ticket.created_at : current.lastActivity;

      map.set(key, current);
    });

    return [...map.values()].filter((customer) => {
      const searchText = search.trim().toLowerCase();
      if (!searchText) return true;
      return (
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText)
      );
    });
  }, [tickets, search]);

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
          <span className="status-inline">Customer directory</span>
        </div>

        <div className="panel">
          <div className="panel-header-row">
            <div>
              <span className="panel-kicker">Directory</span>
              <h3>Customers</h3>
            </div>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers"
              style={{ maxWidth: '220px' }}
            />
          </div>

          {loading ? (
            <p className="empty-state">Loading customers...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : customers.length === 0 ? (
            <p className="empty-state">No customers found.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Total Tickets</th>
                    <th>Open Tickets</th>
                    <th>Resolved Tickets</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.total}</td>
                      <td>{customer.open}</td>
                      <td>{customer.resolved}</td>
                      <td>{customer.lastActivity ? new Date(customer.lastActivity).toLocaleString() : 'Not available'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
