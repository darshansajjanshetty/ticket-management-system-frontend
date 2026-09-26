import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import api from '../services/api';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      await api.post('/tickets', formData);
      navigate('/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container narrow">
      <div className="page-header">
        <div>
          <p className="eyebrow">Customer</p>
          <h2>Create Ticket</h2>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/customer-dashboard')}>
          Back to dashboard
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      <TicketForm onSubmit={handleSubmit} loading={loading} submitText="Create Ticket" />
    </div>
  );
};

export default CreateTicket;
