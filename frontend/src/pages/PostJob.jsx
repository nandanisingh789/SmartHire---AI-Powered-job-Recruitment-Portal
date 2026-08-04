import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', company: '', location: '', description: '',
    requiredSkills: '', minExperience: '', jobType: 'Full-time', salary: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await API.post('/jobs/recruiter/post', {
        ...form,
        minExperience: form.minExperience ? parseInt(form.minExperience) : 0
      });
      setSuccess('Job posted successfully!');
      setTimeout(() => navigate('/recruiter/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Failed to post job');
    } finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h1 className="page-title">📝 Post a New Job</h1>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Job Title *</label>
              <input name="title" className="form-control" placeholder="e.g. Java Backend Developer"
                value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input name="company" className="form-control" placeholder="e.g. Infosys"
                value={form.company} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Location *</label>
              <input name="location" className="form-control" placeholder="e.g. Noida, UP"
                value={form.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select name="jobType" className="form-control" value={form.jobType} onChange={handleChange}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea name="description" className="form-control" rows={4}
              placeholder="Describe the role, responsibilities, and requirements..."
              value={form.description} onChange={handleChange} required style={{ minHeight: 120 }} />
          </div>

          <div className="form-group">
            <label>Required Skills * <span style={{ color: '#718096', fontWeight: 400 }}>(comma separated — used for AI matching)</span></label>
            <input name="requiredSkills" className="form-control"
              placeholder="Java,Spring Boot,Hibernate,MySQL,React"
              value={form.requiredSkills} onChange={handleChange} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Min Experience (Years)</label>
              <input name="minExperience" type="number" className="form-control"
                placeholder="2" value={form.minExperience} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Salary Range</label>
              <input name="salary" className="form-control"
                placeholder="6-10 LPA" value={form.salary} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Posting...' : '🚀 Post Job'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/recruiter/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
