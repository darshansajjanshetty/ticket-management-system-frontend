import { Bell, ChevronDown, HelpCircle, Menu, Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ sidebarOpen = true, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const dashboardPath = user && (user.role === 'admin' || user.role === 'agent') ? '/agent-dashboard' : '/customer-dashboard';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SD';

  const handleBrandNavigate = () => navigate(dashboardPath);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <button
            type="button"
            className="icon-button"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={() => {
              setProfileMenuOpen(false);
              if (onToggleSidebar) onToggleSidebar();
            }}
          >
            <Menu size={16} />
          </button>
          <div className="brand-stack">
            <button type="button" className="brand-link" onClick={handleBrandNavigate}>
              SupportDesk
            </button>
            <button type="button" className="brand-link secondary" onClick={handleBrandNavigate}>
              My Dashboard
            </button>
          </div>
        </div>

        {user ? (
          <div className="topbar-right">
            <button type="button" className="new-ticket-btn" onClick={() => navigate('/tickets/new')}>
              <Plus size={16} />
              <span>New Ticket</span>
            </button>
            <button type="button" className="icon-button" aria-label="Search" onClick={() => navigate('/tickets')}>
              <Search size={16} />
            </button>
            <button type="button" className="icon-button" aria-label="Notifications" onClick={() => navigate('/notifications')}>
              <Bell size={16} />
            </button>
            <button type="button" className="icon-button" aria-label="Help center" onClick={() => navigate('/knowledge-base')}>
              <HelpCircle size={16} />
            </button>
            <div className="user-menu-wrapper" ref={menuRef}>
              <button
                type="button"
                className="user-menu"
                aria-label="Open user menu"
                onClick={() => setProfileMenuOpen((current) => !current)}
              >
                <span className="user-avatar">{initials}</span>
                <span className="user-details">
                  <strong>{user.name || 'Support User'}</strong>
                  <small>{user.role === 'agent' ? 'Agent' : user.role === 'admin' ? 'Admin' : 'Customer'}</small>
                </span>
                <ChevronDown size={15} />
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown" role="menu" aria-label="User actions menu">
                  <div className="profile-summary">
                    <span className="user-avatar large">{initials}</span>
                    <div>
                      <strong>{user.name || 'Support User'}</strong>
                      <small>{user.email || 'user@example.com'}</small>
                    </div>
                  </div>
                  <button type="button" className="dropdown-item" onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }}>
                    Profile
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { setProfileMenuOpen(false); navigate('/settings'); }}>
                    Settings
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { setProfileMenuOpen(false); navigate('/notifications'); }}>
                    Notifications
                  </button>
                  <button type="button" className="dropdown-item danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="topbar-right auth-actions">
            <Link to="/login" className="nav-login-link">Login</Link>
            <Link to="/register" className="nav-register-link">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
