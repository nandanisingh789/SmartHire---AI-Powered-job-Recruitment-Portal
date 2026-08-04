import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await API.post('/auth/login', form);
      login(res.data);
      const role = res.data.role;
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/jobs');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-title">Welcome Back 👋</div>
        <div className="auth-sub">Login to your SmartHire account</div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" className="form-control"
              placeholder="you@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-control"
              placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: '#718096', textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={{ color: '#3182ce' }}>Register here</Link>
        </p>

        {/* Quick Demo Credentials */}
        <div style={{ marginTop: 20, background: '#f7fafc', padding: 14, borderRadius: 8, fontSize: 12 }}>
          <strong>Demo Credentials:</strong><br />
          Admin: admin@smarthire.com / admin123<br />
          Recruiter: recruiter@smarthire.com / recruit123<br />
          Candidate: candidate@smarthire.com / cand123
        </div>
      </div>
    </div>
  );
}
