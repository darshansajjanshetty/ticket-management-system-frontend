import { useEffect, useState } from 'react';
import { BarChart3, BellRing, BookOpen, BriefcaseBusiness, Headset, LayoutDashboard, MessageSquareMore, Settings, Ticket, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import api from '../services/api';

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Tickets', icon: Ticket },
  { label: 'Customers', icon: Users },
  { label: 'Agents', icon: BriefcaseBusiness },
  { label: 'Knowledge Base', icon: BookOpen },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Chat', icon: MessageSquareMore },
  { label: 'Notifications', icon: BellRing },
  { label: 'Settings', icon: Settings },
];

const metrics = [
  { label: 'Open tickets', value: '132', trend: '+12%', tone: 'default' },
  { label: 'Unassigned', value: '15', trend: '+8%', tone: 'default' },
  { label: 'High priority', value: '17', trend: '+6%', tone: 'warning' },
  { label: 'Pending', value: '22', trend: '+4%', tone: 'default' },
  { label: 'Resolved today', value: '74', trend: '+19%', tone: 'success' },
  { label: 'Avg. response', value: '3h 30m', trend: '-12%', tone: 'default' },
  { label: 'Satisfaction', value: '4.1 / 5', trend: '+0.3', tone: 'success' },
  { label: 'SLA', value: '91%', trend: '+2%', tone: 'success' },
];

const recentTickets = [
  { id: '#TKT-1032', customer: 'Samir Bhosale', subject: 'Payment issue', priority: 'High', status: 'Open', created: '5 min ago' },
  { id: '#TKT-1031', customer: 'Meera Nair', subject: 'Account reset', priority: 'Medium', status: 'In Progress', created: '18 min ago' },
  { id: '#TKT-1030', customer: 'Karan Sethi', subject: 'Billing confusion', priority: 'Urgent', status: 'Pending', created: '31 min ago' },
];

const AgentDashboard = ({ sidebarOpen = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [presence, setPresence] = useState('Present');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = (tickets.length ? tickets : recentTickets).filter((ticket) => {
    const subject = (ticket.subject || '').toLowerCase();
    const customer = (ticket.customer || '').toLowerCase();
    const matchesSearch = !search || subject.includes(search.toLowerCase()) || customer.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`support-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className={`support-sidebar ${sidebarOpen ? '' : 'sidebar-hidden'}`}>
        <div className="sidebar-brand">
          <span className="brand-mark">
            <Headset size={18} />
          </span>
          <span>SupportDesk</span>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map(({ label, icon: Icon }) => {
            const routeMap = {
              Dashboard: '/dashboard',
              Tickets: '/tickets',
              Customers: '/customers',
              Agents: '/agents',
              'Knowledge Base': '/knowledge-base',
              Reports: '/reports',
              Chat: '/knowledge-base',
              Notifications: '/notifications',
              Settings: '/settings',
            };

            const to = routeMap[label] || '/dashboard';
            const isActive = location.pathname === to || (label === 'Dashboard' && location.pathname.includes('dashboard'));

            return (
              <Link to={to} className={isActive ? 'sidebar-item active' : 'sidebar-item'} key={label}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="dashboard-main-panel">
        <div className="status-strip">
          <span className="status-inline">Visible to: All agents</span>
          <div className="status-actions">
            <button type="button" className="mini-action" onClick={() => setPresence('Present')}>{presence}</button>
            <button type="button" className="mini-action" onClick={() => navigate('/knowledge-base')}>Announcements</button>
            <button type="button" className="mini-action" onClick={() => navigate('/tickets/new')}>Clone</button>
            <button type="button" className="mini-action" onClick={() => navigate('/settings')}>Edit</button>
          </div>
        </div>

        <div className="metrics-grid">
          {metrics.map((metric) => (
            <div className={`metric-card ${metric.tone}`} key={metric.label}>
              <span className="card-label">{metric.label}</span>
              <div className="metric-value-row">
                <strong>{metric.value}</strong>
                <span className="metric-trend">{metric.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="agent-toolbar">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by subject or customer"
            aria-label="Search tickets"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {loading ? (
          <Loading text="Loading tickets..." />
        ) : (
          <div className="table-wrap agent-table">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id || ticket.subject}>
                    <td>{ticket.id || '#TKT-1048'}</td>
                    <td>{ticket.customer || 'Customer'}</td>
                    <td>{ticket.subject || 'Account access issue'}</td>
                    <td>{ticket.category || 'Account'}</td>
                    <td><span className="ticket-pill priority-high">{ticket.priority || 'High'}</span></td>
                    <td><span className="ticket-pill status-open">{ticket.status || 'Open'}</span></td>
                    <td>{ticket.created || ticket.time || '10 min ago'}</td>
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

export default AgentDashboard;
