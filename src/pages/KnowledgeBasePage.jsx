import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const articles = [
  { id: 1, title: 'How to reset your password', category: 'Account Access', author: 'Ava', views: 1280, updated: '2 days ago' },
  { id: 2, title: 'Troubleshooting billing and payment issues', category: 'Billing', author: 'Sam', views: 910, updated: '5 days ago' },
  { id: 3, title: 'How to update your profile and contact info', category: 'Account Settings', author: 'Nia', views: 760, updated: '1 week ago' },
  { id: 4, title: 'Escalation guidelines for urgent tickets', category: 'Operations', author: 'Milo', views: 620, updated: '2 weeks ago' },
];

const KnowledgeBasePage = ({ sidebarOpen = true }) => {
  const location = useLocation();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return articles;

    return articles.filter((article) => article.title.toLowerCase().includes(value) || article.category.toLowerCase().includes(value));
  }, [search]);

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
          <span className="status-inline">Knowledge base</span>
        </div>

        <div className="panel">
          <div className="panel-header-row">
            <div>
              <span className="panel-kicker">Library</span>
              <h3>Support articles</h3>
            </div>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles"
              style={{ maxWidth: '240px' }}
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Views</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((article) => (
                  <tr key={article.id}>
                    <td>{article.title}</td>
                    <td>{article.category}</td>
                    <td>{article.author}</td>
                    <td>{article.views}</td>
                    <td>{article.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
