import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get('/admin/users')
    ]).then(([s, u]) => {
      setStats(s.data);
      setUsers(u.data);
    }).finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await API.delete(`/admin/users/${id}`);
    setUsers(users.filter(u => u.id !== id));
  };

  if (loading) return <div className="page"><div className="empty"><div className="empty-icon">⏳</div><p>Loading...</p></div></div>;

  return (
    <div className="page">
      <h1 className="page-title">🛡️ Admin Dashboard</h1>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-box">
          <div className="stat-number">{stats.totalUsers || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-box" style={{ borderTopColor: '#38a169' }}>
          <div className="stat-number">{stats.totalJobs || 0}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        <div className="stat-box" style={{ borderTopColor: '#d69e2e' }}>
          <div className="stat-number">{stats.totalApplications || 0}</div>
          <div className="stat-label">Applications</div>
        </div>
        <div className="stat-box" style={{ borderTopColor: '#e53e3e' }}>
          <div className="stat-number">{stats.totalCandidates || 0}</div>
          <div className="stat-label">Candidates</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>👥 All Users</h2>
        <table className="table">
          <thead><tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Location</th><th>Joined</th><th>Action</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-hired' : u.role === 'RECRUITER' ? 'badge-shortlist' : 'badge-applied'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{u.location || '-'}</td>
                <td style={{ fontSize: 12 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
