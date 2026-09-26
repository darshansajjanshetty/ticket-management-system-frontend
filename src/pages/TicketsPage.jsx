import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['all', 'open', 'in_progress', 'pending', 'resolved', 'closed'];
const priorityOptions = ['all', 'low', 'medium', 'high', 'urgent'];

const formatStatus = (status) =>
  (status || 'open')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatPriority = (priority) =>
  (priority || 'medium').replace(/^\w/, (char) => char.toUpperCase());

const TicketsPage = ({ sidebarOpen = true }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAgentView = user?.role === 'agent' || user?.role === 'admin';
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const usersRequest = isAgentView ? api.get('/users') : Promise.resolve({ data: [] });
      const [ticketsResponse, agentsResponse] = await Promise.all([
        api.get('/tickets'),
        usersRequest,
      ]);

      setTickets(ticketsResponse.data);
      setAgents(agentsResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTickets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...tickets]
      .filter((ticket) => {
        const customerName = (ticket.customer_name || '').toLowerCase();
        const customerEmail = (ticket.customer_email || '').toLowerCase();
        const subject = (ticket.subject || '').toLowerCase();
        const ticketId = String(ticket.id || '').toLowerCase();

        const matchesSearch =
          !normalizedSearch ||
          ticketId.includes(normalizedSearch) ||
          subject.includes(normalizedSearch) ||
          customerName.includes(normalizedSearch) ||
          customerEmail.includes(normalizedSearch);

        const matchesStatus = statusFilter === 'all' || (ticket.status || 'open') === statusFilter;
        const matchesPriority = priorityFilter === 'all' || (ticket.priority || 'medium') === priorityFilter;
        const matchesAssignment = assignedFilter === 'all' || String(ticket.assigned_to || 'unassigned') === assignedFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesAssignment;
      })
      .sort((a, b) => {
        const first = new Date(a[sortKey] || a.created_at || 0).getTime();
        const second = new Date(b[sortKey] || b.created_at || 0).getTime();
        return sortDirection === 'asc' ? first - second : second - first;
      });
  }, [tickets, search, statusFilter, priorityFilter, assignedFilter, sortDirection, sortKey]);

  const handleStatusChange = async (ticketId, nextStatus) => {
    try {
      await api.put(`/tickets/${ticketId}`, { status: nextStatus });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update status');
    }
  };

  const handlePriorityChange = async (ticketId, nextPriority) => {
    try {
      await api.put(`/tickets/${ticketId}`, { priority: nextPriority });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update priority');
    }
  };

  const handleAssign = async (ticketId, agentId) => {
    try {
      await api.put(`/tickets/${ticketId}`, { assigned_to: agentId || null });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to assign ticket');
    }
  };

  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm('Delete this ticket? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete(`/tickets/${ticketId}`);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete ticket');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setAssignedFilter('all');
    setSortKey('created_at');
    setSortDirection('desc');
  };

  const pageTitle = user?.role === 'agent' ? 'Ticket operations' : 'My tickets';

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
          <span className="status-inline">{pageTitle}</span>
          <div className="status-actions">
            <Link to="/tickets/new" className="new-ticket-btn">+ New Ticket</Link>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: '1rem' }}>
          <div className="panel-header-row">
            <div>
              <span className="panel-kicker">Search & filters</span>
              <h3>Ticket queue</h3>
            </div>
            <button type="button" className="mini-action" onClick={clearFilters}>Clear filters</button>
          </div>

          <div className="agent-toolbar" style={{ flexWrap: 'wrap' }}>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ticket ID, subject, customer..."
            />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All statuses' : formatStatus(option)}
                </option>
              ))}
            </select>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All priorities' : formatPriority(option)}
                </option>
              ))}
            </select>
            {isAgentView && (
              <select value={assignedFilter} onChange={(event) => setAssignedFilter(event.target.value)}>
                <option value="all">All assignments</option>
                <option value="unassigned">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={String(agent.id)}>{agent.name}</option>
                ))}
              </select>
            )}
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
              <option value="created_at">Sort by created</option>
              <option value="updated_at">Sort by updated</option>
            </select>
            <select value={sortDirection} onChange={(event) => setSortDirection(event.target.value)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="panel"><p className="empty-state">Loading tickets...</p></div>
        ) : error ? (
          <div className="panel"><p className="error-message">{error}</p></div>
        ) : filteredTickets.length === 0 ? (
          <div className="panel"><p className="empty-state">No tickets found for the selected filters.</p></div>
        ) : (
          <div className="panel table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  {isAgentView && <th>Assigned To</th>}
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.customer_name || ticket.customer_email || 'Customer'}</td>
                    <td>{ticket.subject}</td>
                    <td>General</td>
                    <td>
                      <select value={ticket.priority || 'medium'} onChange={(event) => handlePriorityChange(ticket.id, event.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td>
                      {isAgentView ? (
                        <select value={ticket.status || 'open'} onChange={(event) => handleStatusChange(ticket.id, event.target.value)}>
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="pending">Pending</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      ) : (
                        formatStatus(ticket.status || 'open')
                      )}
                    </td>
                    {isAgentView && (
                      <td>
                        <select value={ticket.assigned_to || 'unassigned'} onChange={(event) => handleAssign(ticket.id, event.target.value === 'unassigned' ? null : event.target.value)}>
                          <option value="unassigned">Unassigned</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                          ))}
                        </select>
                      </td>
                    )}
                    <td>{new Date(ticket.created_at).toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <Link to={`/tickets/${ticket.id}`} className="mini-action">View</Link>
                        <button type="button" className="mini-action" onClick={() => handleDelete(ticket.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
