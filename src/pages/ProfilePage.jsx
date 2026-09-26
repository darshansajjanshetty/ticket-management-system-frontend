import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SD';

  return (
    <div className="page-container narrow">
      <div className="page-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>{user?.name || 'Support user'}</h2>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to dashboard
        </Link>
      </div>

      <div className="detail-card">
        <div className="profile-header-row">
          <div className="user-avatar large">{initials}</div>
          <div>
            <h3>{user?.name || 'Support user'}</h3>
            <p className="muted-copy">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer'}</p>
          </div>
        </div>

        <div className="meta-grid">
          <div>
            <span>Email</span>
            <strong>{user?.email || 'user@example.com'}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{user?.role || 'customer'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
