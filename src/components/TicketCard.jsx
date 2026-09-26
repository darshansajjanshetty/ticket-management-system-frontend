import { Link } from 'react-router-dom';

const formatStatus = (status) =>
  status
    ?.replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Open';

const formatPriority = (priority) =>
  priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';

const TicketCard = ({ ticket }) => {
  const customerName = ticket.customer_name || ticket.customerName || 'Customer';
  const summary = ticket.description?.slice(0, 110) || 'No description provided yet.';

  return (
    <Link to={`/tickets/${ticket.id}`} className="ticket-card">
      <div className="ticket-card-top">
        <div>
          <p className="ticket-card-kicker">#{ticket.id} · {customerName}</p>
          <h3>{ticket.subject}</h3>
        </div>
        <span className={`status-pill status-${ticket.status}`}>{formatStatus(ticket.status)}</span>
      </div>

      <p className="ticket-card-body">{summary}</p>

      <div className="ticket-card-meta">
        <span className={`priority-pill priority-${ticket.priority || 'medium'}`}>
          {formatPriority(ticket.priority)}
        </span>
        <span>
          {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }) : 'Recently created'}
        </span>
      </div>
    </Link>
  );
};

export default TicketCard;
