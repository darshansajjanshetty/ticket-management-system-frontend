import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const formatStatus = (status) =>
  status
    ?.replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Open';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTicket = async () => {
    try {
      const [ticketResponse, commentResponse] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/comments`),
      ]);

      setTicket(ticketResponse.data);
      setComments(commentResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusUpdate = async (event) => {
    const status = event.target.value;
    try {
      const response = await api.put(`/tickets/${id}`, { status });
      setTicket(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update ticket');
    }
  };

  const handlePriorityUpdate = async (event) => {
    const priority = event.target.value;
    try {
      const response = await api.put(`/tickets/${id}`, { priority });
      setTicket(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update priority');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post(`/tickets/${id}/comments`, { comment: commentText });
      setComments((prev) => [...prev, response.data]);
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add comment');
    }
  };

  if (loading) {
    return <Loading text="Loading ticket details..." />;
  }

  if (!ticket) {
    return <div className="page-container"><p className="error-message">{error || 'Ticket not found'}</p></div>;
  }

  return (
    <div className="page-container ticket-page">
      <div className="ticket-header">
        <div>
          <p className="eyebrow">Ticket details</p>
          <h2>#{ticket.id} · {ticket.subject}</h2>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(user?.role === 'agent' ? '/agent-dashboard' : '/customer-dashboard')}>
            Back to dashboard
          </button>
          <span className={`status-pill status-${ticket.status}`}>{formatStatus(ticket.status)}</span>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-card detail-main">
          <div className="card-heading">
            <h3>Issue summary</h3>
            <span className={`priority-pill priority-${ticket.priority || 'medium'}`}>
              {ticket.priority ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) : 'Medium'}
            </span>
          </div>
          <p className="ticket-description">{ticket.description}</p>
        </div>

        <div className="detail-card detail-side">
          <h3>Overview</h3>
          <div className="meta-grid">
            <div>
              <span>Priority</span>
              <strong>{ticket.priority ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) : 'Medium'}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{formatStatus(ticket.status)}</strong>
            </div>
            <div>
              <span>Created</span>
              <strong>{new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
            </div>
            <div>
              <span>Updated</span>
              <strong>{new Date(ticket.updated_at || ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'agent' && (
        <div className="agent-actions">
          <label>
            Status
            <select value={ticket.status} onChange={handleStatusUpdate}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label>
            Priority
            <select value={ticket.priority} onChange={handlePriorityUpdate}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
      )}

      <div className="comments-section">
        <h3>Conversation</h3>

        {comments.length === 0 ? (
          <p className="empty-state">No comments yet. Start the thread below.</p>
        ) : (
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-box">
                <div className="comment-meta">
                  <strong>{comment.commenter_name || 'Support team'}</strong>
                  <span>{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} rows="4" placeholder="Add a comment..." required />
          <button className="btn btn-primary" type="submit">Add comment</button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;
