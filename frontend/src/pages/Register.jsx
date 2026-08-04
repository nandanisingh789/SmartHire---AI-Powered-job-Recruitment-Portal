import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'CANDIDATE',
    skills: '', experienceYears: '', location: '', bio: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await API.post('/auth/register', {
        ...form,
        experienceYears: form.experienceYears ? parseInt(form.experienceYears) : null
      });
      setSuccess('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ maxWidth: 500 }}>
        <div className="auth-title">Join SmartHire ✨</div>
        <div className="auth-sub">Create your account</div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" className="form-control" placeholder="John Doe"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" className="form-control" value={form.role} onChange={handleChange}>
                <option value="CANDIDATE">Candidate</option>
                <option value="RECRUITER">Recruiter</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" className="form-control"
              placeholder="you@email.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-control"
              placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
          </div>

          {form.role === 'CANDIDATE' && (
            <>
              <div className="form-group">
                <label>Skills <span style={{color:'#718096'}}>(comma separated)</span></label>
                <input name="skills" className="form-control"
                  placeholder="Java,Spring Boot,MySQL,React" value={form.skills} onChange={handleChange} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input name="experienceYears" type="number" className="form-control"
                    placeholder="3" value={form.experienceYears} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" className="form-control"
                    placeholder="Noida, UP" value={form.location} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" className="form-control"
                  placeholder="Tell recruiters about yourself..." value={form.bio} onChange={handleChange} />
              </div>
            </>
          )}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: '#718096', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#3182ce' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
