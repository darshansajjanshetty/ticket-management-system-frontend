import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, BellRing, BookOpen, BriefcaseBusiness, Headset, LayoutDashboard, MessageSquareMore, Settings, Ticket, Users } from 'lucide-react';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
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
  { label: 'Open tickets', value: '142', trend: '+12%', tone: 'default' },
  { label: 'Unassigned', value: '18', trend: '+7%', tone: 'default' },
  { label: 'High priority', value: '24', trend: '+9%', tone: 'warning' },
  { label: 'Pending', value: '37', trend: '+5%', tone: 'default' },
  { label: 'Resolved today', value: '68', trend: '+15%', tone: 'success' },
  { label: 'Avg. response', value: '1h 24m', trend: '-18%', tone: 'default' },
  { label: 'Customer rating', value: '4.5 / 5', trend: '+0.2', tone: 'success' },
  { label: 'SLA', value: '92%', trend: '+3%', tone: 'success' },
];

const recentTickets = [
  { id: '#TKT-1024', customer: 'Rahul Kumar', subject: 'Unable to login', category: 'Account', priority: 'High', agent: 'Priya', status: 'Open', time: '10 min ago' },
  { id: '#TKT-1023', customer: 'Anjali Rao', subject: 'Payment failed', category: 'Billing', priority: 'Urgent', agent: 'Arjun', status: 'In Progress', time: '25 min ago' },
  { id: '#TKT-1021', customer: 'Nina Patel', subject: 'Feature request', category: 'Product', priority: 'Medium', agent: 'Sara', status: 'Pending', time: '1 hour ago' },
];

const CustomerDashboard = ({ sidebarOpen = true }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('Today');

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

  const displayTickets = tickets.length ? tickets.slice(0, 3) : recentTickets;

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
          <span className="status-inline">Visible to: Support customers</span>
          <div className="status-actions">
            <button type="button" className="mini-action" onClick={() => navigate('/tickets')}>View tickets</button>
            <button type="button" className="mini-action" onClick={() => navigate('/knowledge-base')}>Announcements</button>
            <button type="button" className="mini-action" onClick={() => navigate('/tickets/new')}>New request</button>
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

        <div className="dashboard-grid">
          <section className="panel panel-wide">
            <div className="panel-header-row">
              <div>
                <span className="panel-kicker">Ticket overview</span>
                <h3>Volume</h3>
              </div>
              <div className="panel-range">
                {['Today', 'Week', 'Month'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={range === option ? 'range-chip active' : 'range-chip'}
                    onClick={() => setRange(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="sparkline-chart">
              <span className="line line-one" />
              <span className="line line-two" />
              <span className="line line-three" />
            </div>
          </section>

          <section className="panel">
            <div className="panel-header-row">
              <div>
                <span className="panel-kicker">Ticket status</span>
                <h3>Distribution</h3>
              </div>
            </div>
            <div className="distribution-list">
              {[
                { label: 'Open', value: 42 },
                { label: 'Pending', value: 18 },
                { label: 'In Progress', value: 31 },
                { label: 'Resolved', value: 75 },
                { label: 'Closed', value: 120 },
              ].map((item) => (
                <div key={item.label} className="distribution-item">
                  <div className="distribution-topline">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${Math.min(item.value / 1.4, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header-row">
              <div>
                <span className="panel-kicker">Priority mix</span>
                <h3>Ticket priority</h3>
              </div>
            </div>
            <div className="distribution-list compact">
              {[
                { label: 'Low', value: 42 },
                { label: 'Medium', value: 31 },
                { label: 'High', value: 19 },
                { label: 'Urgent', value: 8 },
              ].map((item) => (
                <div key={item.label} className="distribution-item">
                  <div className="distribution-topline">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                  <div className="progress-track">
                    <span className="priority-bar" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel panel-wide">
            <div className="panel-header-row">
              <div>
                <span className="panel-kicker">Recent tickets</span>
                <h3>Operations queue</h3>
              </div>
              <Link to="/tickets/new" className="text-link">+ Create ticket</Link>
            </div>

            {loading ? (
              <Loading text="Loading customer tickets..." />
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Customer</th>
                      <th>Subject</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTickets.map((ticket) => (
                      <tr key={ticket.id || ticket.subject}>
                        <td>{ticket.id || '#TKT-1040'}</td>
                        <td>{ticket.customer || user?.name || 'Customer'}</td>
                        <td>{ticket.subject || 'Account access issue'}</td>
                        <td><span className="ticket-pill priority-high">{ticket.priority || 'High'}</span></td>
                        <td><span className="ticket-pill status-open">{ticket.status || 'Open'}</span></td>
                        <td>{ticket.time || '10 min ago'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
