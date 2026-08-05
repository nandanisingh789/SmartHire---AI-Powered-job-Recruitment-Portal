import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const STATUS_STEPS = ['APPLIED','UNDER_REVIEW','SHORTLISTED','HIRED'];

const STATUS_META = {
  APPLIED:      { label: 'Applied',      color: '#2b6cb0', bg: '#ebf8ff', icon: '📨' },
  UNDER_REVIEW: { label: 'Under Review', color: '#744210', bg: '#fefcbf', icon: '🔍' },
  SHORTLISTED:  { label: 'Shortlisted',  color: '#276749', bg: '#f0fff4', icon: '⭐' },
  REJECTED:     { label: 'Rejected',     color: '#c53030', bg: '#fff5f5', icon: '❌' },
  HIRED:        { label: 'Hired! 🎉',    color: '#553c9a', bg: '#e9d8fd', icon: '🏆' },
};

const scoreClass = (s) =>
  s >= 80 ? 'score-excellent' : s >= 60 ? 'score-good' : s >= 40 ? 'score-average' : 'score-low';

export default function CandidateApplications() {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/applications/my')
      .then(r => setApps(r.data))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  
  const stats = {
    total:       apps.length,
    shortlisted: apps.filter(a => a.status === 'SHORTLISTED').length,
    hired:       apps.filter(a => a.status === 'HIRED').length,
    avgScore:    apps.length
      ? Math.round(apps.reduce((s, a) => s + (a.matchScore || 0), 0) / apps.length)
      : 0,
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>📋 My Applications</h1>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/jobs')}>+ Apply More Jobs</button>
      </div>

      {/* Stats row */}
      {apps.length > 0 && (
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <div className="stat-box">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Applied</div>
          </div>
          <div className="stat-box" style={{ borderTopColor: '#38a169' }}>
            <div className="stat-number">{stats.shortlisted}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
          <div className="stat-box" style={{ borderTopColor: '#805ad5' }}>
            <div className="stat-number">{stats.hired}</div>
            <div className="stat-label">Hired</div>
          </div>
          <div className="stat-box" style={{ borderTopColor: '#d69e2e' }}>
            <div className="stat-number">{stats.avgScore}%</div>
            <div className="stat-label">Avg Match Score</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty"><div className="empty-icon">⏳</div><p>Loading your applications...</p></div>
      ) : apps.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <p style={{ marginBottom: 16 }}>No applications yet!</p>
          <button className="btn btn-primary" onClick={() => navigate('/jobs')}>Browse Jobs →</button>
        </div>
      ) : (
        <div>
          {apps.map(app => {
            const meta   = STATUS_META[app.status] || STATUS_META.APPLIED;
            const isOpen = expanded === app.id;
            const stepIdx = STATUS_STEPS.indexOf(app.status);

            return (
              <div key={app.id} className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
                {/* Card header — always visible */}
                <div
                  style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
                  onClick={() => toggle(app.id)}>

                  {/* Company icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, background: '#ebf8ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0
                  }}>🏢</div>

                  {/* Job info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#2d3748' }}>{app.jobTitle}</div>
                    <div style={{ fontSize: 13, color: '#718096' }}>
                      {app.company} &nbsp;·&nbsp; {app.jobLocation}
                    </div>
                  </div>

                  {/* Match score */}
                  {app.matchScore != null && (
                    <span className={`match-score ${scoreClass(app.matchScore)}`} style={{ fontSize: 13 }}>
                      {app.matchScore >= 80 ? '🌟' : app.matchScore >= 60 ? '✅' : '⚠️'} {app.matchScore}%
                    </span>
                  )}

                  {/* Status badge */}
                  <span style={{
                    padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: meta.bg, color: meta.color, whiteSpace: 'nowrap'
                  }}>
                    {meta.icon} {meta.label}
                  </span>

                  <span style={{ color: '#a0aec0', fontSize: 18 }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #f0f0f0', padding: '20px 24px', background: '#fafafa' }}>

                    {/* Progress tracker */}
                    {app.status !== 'REJECTED' && (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 12 }}>
                          Application Progress:
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                          {STATUS_STEPS.map((st, i) => {
                            const done    = i <= stepIdx;
                            const current = i === stepIdx;
                            const m       = STATUS_META[st];
                            return (
                              <div key={st} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                  <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: done ? '#3182ce' : '#e2e8f0',
                                    color: done ? 'white' : '#a0aec0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, fontWeight: 700,
                                    border: current ? '3px solid #2b6cb0' : 'none',
                                    boxSizing: 'border-box'
                                  }}>
                                    {done ? (current ? i + 1 : '✓') : i + 1}
                                  </div>
                                  <div style={{ fontSize: 10, color: done ? '#3182ce' : '#a0aec0', marginTop: 4, fontWeight: done ? 600 : 400, textAlign: 'center' }}>
                                    {m.label}
                                  </div>
                                </div>
                                {i < STATUS_STEPS.length - 1 && (
                                  <div style={{ height: 3, flex: 1, background: i < stepIdx ? '#3182ce' : '#e2e8f0', margin: '0 4px', marginBottom: 18 }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {app.status === 'REJECTED' && (
                      <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 13, color: '#c53030' }}>
                        ❌ Your application was not selected this time. Keep applying — better opportunities await!
                      </div>
                    )}

                    {/* AI info */}
                    <div className="grid-2" style={{ marginBottom: 16, gap: 12 }}>
                      <div style={{ background: 'linear-gradient(135deg,#1a365d,#2a4a7f)', borderRadius: 12, padding: 16, color: 'white', textAlign: 'center' }}>
                        <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>🤖 AI MATCH SCORE</div>
                        <div style={{ fontSize: 32, fontWeight: 900 }}>{app.matchScore ?? '-'}%</div>
                        <div style={{ fontSize: 11, opacity: 0.8 }}>
                          {app.matchScore >= 80 ? 'Excellent Match' : app.matchScore >= 60 ? 'Good Match' : app.matchScore >= 40 ? 'Average Match' : 'Low Match'}
                        </div>
                      </div>
                      <div style={{ background: '#f0fff4', border: '1.5px solid #c6f6d5', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: '#276749', fontWeight: 600, marginBottom: 4 }}>💰 PREDICTED SALARY</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#276749' }}>{app.predictedSalary || '—'}</div>
                        <div style={{ fontSize: 11, color: '#718096' }}>Based on your profile</div>
                      </div>
                    </div>

                    {/* Skills submitted */}
                    {app.resumeSkills && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Skills you submitted:</div>
                        <div className="job-skills">
                          {app.resumeSkills.split(',').map(s => (
                            <span className="skill-tag" key={s}>{s.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resume file */}
                    {app.resumeFileName && (
                      <div style={{ fontSize: 13, color: '#4a5568', marginBottom: 12 }}>
                        📎 Resume: <strong>{app.resumeFileName}</strong>
                      </div>
                    )}

                    {/* Cover letter */}
                    {app.coverLetter && (
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>✉️ Your Cover Letter:</div>
                        <div style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6 }}>{app.coverLetter}</div>
                      </div>
                    )}

                    <div style={{ fontSize: 12, color: '#a0aec0' }}>
                      Applied on: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* AI explanation */}
      {apps.length > 0 && (
        <div className="card" style={{ marginTop: 8, background: '#ebf8ff', border: '1px solid #bee3f8' }}>
          <div style={{ fontSize: 13, color: '#2c5282', lineHeight: 1.7 }}>
            <strong>🤖 How AI Match Score works:</strong> Your submitted skills are compared with the job's required skills using a matching algorithm.
            The % shows how many required skills you have. Higher score = faster recruiter shortlisting.<br />
            <strong>💰 Predicted Salary</strong> is calculated using your experience years + skill count + match quality.
          </div>
        </div>
      )}
    </div>
  );
}
