import { useEffect, useState } from 'react';

const initialState = {
  subject: '',
  description: '',
  priority: 'medium',
};

const TicketForm = ({ initialValues = initialState, onSubmit, submitText = 'Submit', loading = false }) => {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field-group">
        <label>Subject</label>
        <input type="text" name="subject" value={form.subject} onChange={handleChange} required />
      </div>

      <div className="field-group">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows="5" required />
      </div>

      <div className="field-group">
        <label>Priority</label>
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Submitting...' : submitText}
      </button>
    </form>
  );
};

export default TicketForm;
