import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function RecruiterDashboard() {
  const [jobs, setJobs]   = useState([]);
  const [apps, setApps]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/jobs/recruiter/my-jobs'),
      API.get('/applications/recruiter/all')
    ]).then(([j, a]) => {
      setJobs(j.data);
      setApps(a.data);
    }).finally(() => setLoading(false));
  }, []);

  const closeJob = async (id) => {
    if (!window.confirm('Close this job?')) return;
    await API.put(`/jobs/recruiter/close/${id}`);
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'CLOSED' } : j));
  };

  const updateStatus = async (appId, status) => {
    await API.put(`/applications/recruiter/update/${appId}?status=${status}`);
    setApps(apps.map(a => a.id === appId ? { ...a, status } : a));
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-average';
    return 'score-low';
  };

  if (loading) return <div className="page"><div className="empty"><div className="empty-icon">⏳</div><p>Loading...</p></div></div>;

  return (
    <div className="page">
      <h1 className="page-title">📊 Recruiter Dashboard</h1>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-box">
          <div className="stat-number">{jobs.length}</div>
          <div className="stat-label">Jobs Posted</div>
        </div>
        <div className="stat-box" style={{ borderTopColor: '#38a169' }}>
          <div className="stat-number">{jobs.filter(j => j.status === 'ACTIVE').length}</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-box" style={{ borderTopColor: '#d69e2e' }}>
          <div className="stat-number">{apps.length}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-box" style={{ borderTopColor: '#805ad5' }}>
          <div className="stat-number">{apps.filter(a => a.status === 'HIRED').length}</div>
          <div className="stat-label">Hired</div>
        </div>
      </div>

      {/* My Jobs */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>My Job Postings</h2>
          <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">+ Post New Job</Link>
        </div>
        {jobs.length === 0 ? (
          <div className="empty"><p>No jobs posted yet.</p></div>
        ) : (
          <table className="table">
            <thead><tr>
              <th>Title</th><th>Company</th><th>Skills</th><th>Status</th><th>Posted</th><th>Action</th>
            </tr></thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td><strong>{job.title}</strong></td>
                  <td>{job.company}</td>
                  <td style={{ fontSize: 12 }}>{job.requiredSkills?.substring(0, 40)}...</td>
                  <td><span className={`badge badge-${job.status?.toLowerCase()}`}>{job.status}</span></td>
                  <td style={{ fontSize: 12 }}>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-'}</td>
                  <td>
                    {job.status === 'ACTIVE' && (
                      <button className="btn btn-danger btn-sm" onClick={() => closeJob(job.id)}>Close</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Applications with AI scores */}
      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          📨 Applications Received
          <span style={{ fontSize: 13, color: '#718096', fontWeight: 400, marginLeft: 8 }}>
            (sorted by AI Match Score)
          </span>
        </h2>
        {apps.length === 0 ? (
          <div className="empty"><p>No applications yet.</p></div>
        ) : (
          <table className="table">
            <thead><tr>
              <th>Candidate</th><th>Job</th><th>Skills</th><th>Exp</th>
              <th>🤖 Match</th><th>💰 Predicted Salary</th><th>Status</th><th>Update</th>
            </tr></thead>
            <tbody>
              {[...apps].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).map(app => (
                <tr key={app.id}>
                  <td>
                    <strong>{app.candidateName}</strong><br />
                    <span style={{ fontSize: 11, color: '#718096' }}>{app.candidateEmail}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{app.jobTitle}</td>
                  <td style={{ fontSize: 11 }}>{app.candidateSkills?.substring(0, 30) || '-'}</td>
                  <td>{app.candidateExperience != null ? `${app.candidateExperience} yrs` : '-'}</td>
                  <td>
                    {app.matchScore != null && (
                      <span className={`match-score ${getScoreClass(app.matchScore)}`}>
                        {app.matchScore >= 80 ? '🌟' : app.matchScore >= 60 ? '✅' : '⚠️'} {app.matchScore}%
                      </span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: '#2f855a', fontSize: 13 }}>
                    {app.predictedSalary || '-'}
                  </td>
                  <td>
                    <span className={`badge badge-${app.status?.toLowerCase().replace('_', '')}`}>
                      {app.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <select className="form-control" style={{ padding: '4px 8px', fontSize: 12 }}
                      value={app.status}
                      onChange={e => updateStatus(app.id, e.target.value)}>
                      <option value="APPLIED">Applied</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="HIRED">Hired</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
