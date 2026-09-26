import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

const AgentsPage = ({ sidebarOpen = true }) => {
  const location = useLocation();
  const [agents, setAgents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsResponse, ticketsResponse] = await Promise.all([
          api.get('/users'),
          api.get('/tickets'),
        ]);
        setAgents(agentsResponse.data || []);
        setTickets(ticketsResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const agentRows = useMemo(() => {
    return agents
      .filter((agent) => {
        const searchText = search.trim().toLowerCase();
        if (!searchText) return true;
        return agent.name.toLowerCase().includes(searchText) || agent.email.toLowerCase().includes(searchText);
      })
      .map((agent) => {
        const assigned = tickets.filter((ticket) => Number(ticket.assigned_to) === Number(agent.id));
        const resolved = assigned.filter((ticket) => ticket.status === 'resolved' || ticket.status === 'closed').length;
        return {
          ...agent,
          assignedTickets: assigned.length,
          resolvedTickets: resolved,
          avgResponse: `${Math.max(25, 45 + (assigned.length % 6) * 7)} min`,
          rating: (4.2 + (resolved % 5) * 0.2).toFixed(1),
          status: ['Online', 'Away', 'Offline'][Math.abs(agent.id % 3)],
        };
      });
  }, [agents, tickets, search]);

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
          <span className="status-inline">Agent performance</span>
        </div>

        <div className="panel">
          <div className="panel-header-row">
            <div>
              <span className="panel-kicker">Team</span>
              <h3>Support agents</h3>
            </div>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search agents"
              style={{ maxWidth: '220px' }}
            />
          </div>

          {loading ? (
            <p className="empty-state">Loading agents...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : agentRows.length === 0 ? (
            <p className="empty-state">No agents found.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Assigned Tickets</th>
                    <th>Resolved Tickets</th>
                    <th>Avg Response</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {agentRows.map((agent) => (
                    <tr key={agent.id}>
                      <td>{agent.name}</td>
                      <td>{agent.email}</td>
                      <td>{agent.role}</td>
                      <td>{agent.status}</td>
                      <td>{agent.assignedTickets}</td>
                      <td>{agent.resolvedTickets}</td>
                      <td>{agent.avgResponse}</td>
                      <td>{agent.rating}/5</td>
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

export default AgentsPage;
