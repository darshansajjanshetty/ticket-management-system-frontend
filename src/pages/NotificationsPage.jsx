import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const initialNotifications = [
  { id: 1, title: 'New customer reply', detail: 'Customer replied to ticket #5013 with a screenshot of the error.', time: '2 min ago', unread: true, ticketId: 5013 },
  { id: 2, title: 'Escalation assigned', detail: 'Ticket #4982 was reassigned to your billing specialist queue.', time: '18 min ago', unread: true, ticketId: 4982 },
  { id: 3, title: 'Payment issue resolved', detail: 'Ticket #4957 was marked resolved and closed by the finance team.', time: '1 hour ago', unread: false, ticketId: 4957 },
  { id: 4, title: 'New knowledge article published', detail: 'The password reset playbook was updated with the latest troubleshooting steps.', time: '2 hours ago', unread: false, ticketId: null },
];

const NotificationsPage = ({ sidebarOpen = true }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  const markAsRead = (id) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
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
          <span className="status-inline">Notifications</span>
          <div className="status-actions">
            <button type="button" className="mini-action" onClick={markAllRead}>Mark all read</button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header-row">
            <div>
              <span className="panel-kicker">Inbox</span>
              <h3>{unreadCount} unread</h3>
            </div>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => (
              <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.detail}</p>
                  <small>{notification.time}</small>
                </div>
                <div className="notification-actions">
                  {notification.ticketId && (
                    <Link to={`/tickets/${notification.ticketId}`} className="mini-action">Open ticket</Link>
                  )}
                  {!notification.unread && <span className="status-pill status-resolved">Read</span>}
                  {notification.unread && (
                    <button type="button" className="mini-action" onClick={() => markAsRead(notification.id)}>Mark read</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
