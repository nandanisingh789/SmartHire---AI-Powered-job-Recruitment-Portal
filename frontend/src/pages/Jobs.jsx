import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';


const scoreClass = (s) =>
  s >= 80 ? 'score-excellent' : s >= 60 ? 'score-good' : s >= 40 ? 'score-average' : 'score-low';
const scoreEmoji = (s) => (s >= 80 ? '🌟' : s >= 60 ? '✅' : s >= 40 ? '⚠️' : '❌');
const scoreLabel = (s) =>
  s >= 80 ? 'Excellent Match — High chance of shortlisting!'
  : s >= 60 ? 'Good Match — Strong profile for this role'
  : s >= 40 ? 'Average Match — Consider upskilling'
  : 'Low Match — Skill gap detected';


const KNOWN_SKILLS = [
  'java','spring boot','spring','hibernate','mysql','postgresql','react','javascript',
  'html','css','rest api','node.js','nodejs','python','git','docker','aws','mongodb',
  'microservices','kafka','redis','angular','typescript','jpa','maven','gradle',
  'sql','linux','c++','c#','.net','php','flutter','kotlin','swift',
];
function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter(sk => lower.includes(sk))
    .map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
}


export default function Jobs() {
  const { user } = useAuth();
  const navigate  = useNavigate();


  const [jobs, setJobs]         = useState([]);
  const [page, setPage]         = useState(0);
  const [hasMore, setHasMore]   = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [keyword, setKeyword]   = useState('');
  const [searchMode, setSearchMode] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null);
  const [step, setStep]         = useState('form'); // 'form' | 'result'
  const [form, setForm]         = useState({ coverLetter: '', resumeSkills: '', resumeFileName: '' });
  const [resumeText, setResumeText]   = useState('');
  const [parsedSkills, setParsedSkills] = useState([]);
  const [editingSkills, setEditingSkills] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState(null);
  const [applyErr, setApplyErr] = useState('');


  const fetchJobs = useCallback(async (pg = 0, reset = true) => {
    reset ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await API.get(`/jobs/all?page=${pg}&size=6`);
      const data = res.data;
      setJobs(prev => reset ? data.jobs : [...prev, ...data.jobs]);
      setHasMore(data.hasMore);
      setTotalJobs(data.totalJobs);
      setPage(pg);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchJobs(0, true); }, [fetchJobs]);

  const handleSearch = async () => {
    if (!keyword.trim()) { setSearchMode(false); fetchJobs(0, true); return; }
    setLoading(true); setSearchMode(true);
    try {
      const res = await API.get(`/jobs/search?keyword=${encodeURIComponent(keyword)}`);
      setJobs(res.data);
      setHasMore(false);
      setTotalJobs(res.data.length);
    } finally { setLoading(false); }
  };

  const handleReset = () => { setKeyword(''); setSearchMode(false); fetchJobs(0, true); };

  
  const openApply = (job) => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'CANDIDATE') return;
    setSelectedJob(job);
    setStep('form');
    setApplyResult(null);
    setApplyErr('');
    setResumeText('');
    setParsedSkills([]);
    // pre-fill from profile
    const profileSkills = localStorage.getItem('profileSkills') || '';
    setEditingSkills(profileSkills);
    setForm({ coverLetter: '', resumeSkills: profileSkills, resumeFileName: '' });
  };

  const closeModal = () => { setSelectedJob(null); setStep('form'); };

  
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, resumeFileName: file.name }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setResumeText(text);
      const extracted = extractSkillsFromText(text);
      setParsedSkills(extracted);
      const skillStr = extracted.join(',');
      setEditingSkills(skillStr);
      setForm(f => ({ ...f, resumeSkills: skillStr, resumeFileName: file.name }));
    };
    
    reader.readAsText(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true); setApplyErr('');
    try {
      const payload = {
        jobId: selectedJob.id,
        coverLetter: form.coverLetter,
        resumeSkills: editingSkills || form.resumeSkills,
        resumeFileName: form.resumeFileName,
      };
      const res = await API.post('/applications/apply', payload);
      setApplyResult(res.data);
      setStep('result');
    } catch (err) {
      setApplyErr(err.response?.data || 'Apply failed. You may have already applied.');
    } finally { setApplying(false); }
  };


  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Find Your Dream Job 🚀</h1>
        {!searchMode && <p style={{ color: '#718096', fontSize: 14 }}>{totalJobs} jobs available</p>}
        {searchMode && <p style={{ color: '#718096', fontSize: 14 }}>{totalJobs} results for "{keyword}"</p>}
      </div>

      {/* Search bar */}
      <div className="search-bar" style={{ marginBottom: 28 }}>
        <input className="form-control" placeholder="Search by job title, company, skill (e.g. Java, React, Noida)..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
        {searchMode && <button className="btn btn-outline" onClick={handleReset}>✕ Clear</button>}
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="empty"><div className="empty-icon">⏳</div><p>Loading jobs...</p></div>
      ) : jobs.length === 0 ? (
        <div className="empty"><div className="empty-icon">🗂️</div><p>No jobs found. Try a different keyword.</p></div>
      ) : (
        <>
          <div className="grid-2">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} user={user}
                onApply={() => openApply(job)}
                onLogin={() => navigate('/login')} />
            ))}
          </div>

          {/* Load More */}
          {!searchMode && hasMore && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button
                className="btn btn-outline"
                style={{ padding: '12px 40px', fontSize: 15 }}
                onClick={() => fetchJobs(page + 1, false)}
                disabled={loadingMore}>
                {loadingMore ? '⏳ Loading...' : '↓ Load More Jobs'}
              </button>
              <p style={{ fontSize: 12, color: '#a0aec0', marginTop: 8 }}>
                Showing {jobs.length} of {totalJobs} jobs
              </p>
            </div>
          )}

          {!hasMore && jobs.length > 0 && (
            <p style={{ textAlign: 'center', color: '#a0aec0', marginTop: 24, fontSize: 13 }}>
              ✅ You've seen all {totalJobs} jobs
            </p>
          )}
        </>
      )}

      {/* ══ APPLY MODAL ══════════════════════════════════ */}
      {selectedJob && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,23,42,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20, backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560,
            maxHeight: '92vh', overflowY: 'auto',
            boxShadow: '0 24px 80px rgba(0,0,0,0.35)'
          }}>

            {step === 'result' ? (
              <ResultScreen result={applyResult} job={selectedJob}
                onClose={closeModal}
                onMyApps={() => navigate('/candidate/applications')} />
            ) : (
              <ApplyForm
                job={selectedJob}
                form={form} setForm={setForm}
                editingSkills={editingSkills} setEditingSkills={setEditingSkills}
                parsedSkills={parsedSkills}
                resumeText={resumeText}
                onResumeUpload={handleResumeUpload}
                onSubmit={handleSubmit}
                applying={applying}
                error={applyErr}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function JobCard({ job, user, onApply, onLogin }) {
  const timeAgo = (dt) => {
    if (!dt) return '';
    const diff = Date.now() - new Date(dt).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)}m ago`;
  };

  return (
    <div className="card job-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Top */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          {/* Company icon placeholder */}
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: '#ebf8ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, marginRight: 12, flexShrink: 0
          }}>🏢</div>
          <div style={{ flex: 1 }}>
            <div className="card-title" style={{ fontSize: 16 }}>{job.title}</div>
            <div style={{ fontSize: 13, color: '#4a5568', fontWeight: 500 }}>{job.company}</div>
          </div>
          <span className={`badge badge-${job.status?.toLowerCase()}`}>{job.status}</span>
        </div>

        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#718096', marginBottom: 10, flexWrap: 'wrap' }}>
          <span>📍 {job.location}</span>
          <span>💼 {job.jobType}</span>
          {job.salary && <span>💰 {job.salary}</span>}
          {job.minExperience != null && <span>📅 {job.minExperience}+ yrs</span>}
        </div>

        <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6, marginBottom: 12 }}>
          {job.description?.substring(0, 110)}...
        </p>

        <div className="job-skills" style={{ marginBottom: 12 }}>
          {job.requiredSkills?.split(',').slice(0, 5).map(s => (
            <span className="skill-tag" key={s}>{s.trim()}</span>
          ))}
          {job.requiredSkills?.split(',').length > 5 && (
            <span className="skill-tag" style={{ background: '#f7fafc', color: '#a0aec0' }}>
              +{job.requiredSkills.split(',').length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        <span style={{ fontSize: 11, color: '#a0aec0' }}>🕒 {timeAgo(job.createdAt)}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {user?.role === 'CANDIDATE' && (
            <button className="btn btn-primary btn-sm" onClick={onApply}>
              Apply Now →
            </button>
          )}
          {!user && (
            <button className="btn btn-outline btn-sm" onClick={onLogin}>
              Login to Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


function ApplyForm({ job, form, setForm, editingSkills, setEditingSkills,
  parsedSkills, onResumeUpload, onSubmit, applying, error, onClose }) {

  return (
    <div>
      {/* Header band */}
      <div style={{
        background: 'linear-gradient(135deg, #0e1826 0%, #16223a 100%)',
        borderRadius: '20px 20px 0 0', padding: '22px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 2 }}>Apply for Job</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{job.title} · {job.company} · {job.location}</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>✕</button>
      </div>

      <div style={{ padding: 28 }}>

      {/* Job skills required */}
      <div style={{ background: '#f7fafc', borderRadius: 10, padding: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>📋 Job Required Skills:</div>
        <div className="job-skills">
          {job.requiredSkills?.split(',').map(s => (
            <span className="skill-tag" key={s}>{s.trim()}</span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#718096', marginTop: 8 }}>
          {job.salary && <span>💰 {job.salary} &nbsp;|&nbsp; </span>}
          {job.minExperience != null && <span>📅 {job.minExperience}+ yrs exp</span>}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={onSubmit}>

        {/* Resume Upload */}
        <div className="form-group">
          <label>📄 Upload Resume <span style={{ color: '#718096', fontWeight: 400 }}>(PDF or TXT — skills auto-extracted)</span></label>
          <div style={{
            border: '2px dashed #bee3f8', borderRadius: 10,
            padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
            background: form.resumeFileName ? '#ebf8ff' : '#f7fafc',
            transition: 'all 0.2s'
          }}
            onClick={() => document.getElementById('resumeInput').click()}>
            <input id="resumeInput" type="file" accept=".txt,.pdf"
              style={{ display: 'none' }} onChange={onResumeUpload} />
            {form.resumeFileName ? (
              <div>
                <div style={{ fontSize: 28, marginBottom: 4 }}>📎</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0d9488' }}>{form.resumeFileName}</div>
                <div style={{ fontSize: 12, color: '#718096' }}>Click to change file</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 32, marginBottom: 4 }}>☁️</div>
                <div style={{ fontSize: 14, color: '#718096' }}>Click to upload your resume</div>
                <div style={{ fontSize: 11, color: '#a0aec0', marginTop: 2 }}>Supports PDF, TXT</div>
              </div>
            )}
          </div>
        </div>

        {/* Auto-extracted skills */}
        {parsedSkills.length > 0 && (
          <div style={{ background: '#f0fff4', borderRadius: 10, padding: 14, marginBottom: 16, border: '1px solid #c6f6d5' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#276749', marginBottom: 8 }}>
              ✅ Skills auto-detected from your resume:
            </div>
            <div className="job-skills">
              {parsedSkills.map(s => (
                <span key={s} style={{
                  background: '#c6f6d5', color: '#276749',
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600
                }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Editable skills */}
        <div className="form-group">
          <label>🛠️ Your Skills <span style={{ color: '#718096', fontWeight: 400 }}>(edit if needed — comma separated)</span></label>
          <input className="form-control"
            placeholder="Java,Spring Boot,MySQL,React,Hibernate"
            value={editingSkills}
            onChange={e => setEditingSkills(e.target.value)}
          />
          <div style={{ fontSize: 11, color: '#718096', marginTop: 4 }}>
            💡 These skills are used by AI to calculate your match score
          </div>
        </div>

        {/* Cover Letter */}
        <div className="form-group">
          <label>✉️ Cover Letter <span style={{ color: '#718096', fontWeight: 400 }}>(optional)</span></label>
          <textarea className="form-control" rows={4}
            placeholder={`Dear Hiring Manager,\n\nI am excited to apply for the ${job.title} position at ${job.company}...`}
            value={form.coverLetter}
            onChange={e => setForm(f => ({ ...f, coverLetter: e.target.value }))}
            style={{ minHeight: 100 }}
          />
        </div>

        {/* AI notice */}
        <div style={{ background: '#fefcbf', borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 12, color: '#744210', border: '1px solid #f6e05e' }}>
          🤖 After submitting, AI instantly calculates your <strong>Match Score</strong> (skill overlap) and <strong>Predicted Salary Range</strong> based on your profile.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-success" type="submit" disabled={applying} style={{ flex: 1, fontSize: 15, padding: '12px 0' }}>
            {applying ? '⏳ Submitting...' : '🚀 Submit Application'}
          </button>
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
      </div>
    </div>
  );
}


function ResultScreen({ result, job, onClose, onMyApps }) {
  const s = result?.matchScore ?? 0;

  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 52, marginBottom: 8 }}>🎉</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0e1826', marginBottom: 4 }}>Application Submitted!</h2>
      <p style={{ color: '#718096', marginBottom: 24, fontSize: 14 }}>
        {job.title} · {job.company} · {job.location}
      </p>

      {/* AI Match Score */}
      <div style={{
        background: 'linear-gradient(135deg, #0e1826 0%, #16223a 100%)',
        borderRadius: 16, padding: '24px 20px', color: 'white', marginBottom: 16
      }}>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6, letterSpacing: 1 }}>🤖 AI MATCH SCORE</div>
        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>
          {scoreEmoji(s)} {s}%
        </div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{scoreLabel(s)}</div>

        {/* Score bar */}
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, height: 8, margin: '14px 0 0', overflow: 'hidden' }}>
          <div style={{
            width: `${s}%`, height: '100%', borderRadius: 20,
            background: s >= 80 ? '#68d391' : s >= 60 ? '#63b3ed' : s >= 40 ? '#f6e05e' : '#fc8181',
            transition: 'width 0.8s ease'
          }} />
        </div>
      </div>

      {/* Salary Prediction */}
      <div style={{
        background: '#f0fff4', border: '1.5px solid #c6f6d5',
        borderRadius: 14, padding: '18px 16px', marginBottom: 16
      }}>
        <div style={{ fontSize: 12, color: '#276749', fontWeight: 600, marginBottom: 4 }}>💰 AI Predicted Salary Range</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#276749' }}>{result?.predictedSalary}</div>
        <div style={{ fontSize: 11, color: '#718096', marginTop: 4 }}>Based on your experience, skills & match quality</div>
      </div>

      {/* Status */}
      <div style={{
        background: '#ebf8ff', border: '1px solid #bee3f8',
        borderRadius: 12, padding: 14, marginBottom: 24, fontSize: 13, color: '#2c5282'
      }}>
        <strong>Application Status:</strong> <span className="badge badge-applied">APPLIED</span>
        <br /><span style={{ fontSize: 11, marginTop: 4, display: 'block', color: '#718096' }}>
          Track status changes in My Applications → Under Review → Shortlisted → Hired
        </span>
      </div>

      {/* Job skills vs match */}
      {result?.resumeSkills && (
        <div style={{ background: '#f7fafc', borderRadius: 10, padding: 14, marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>Your submitted skills:</div>
          <div className="job-skills">
            {result.resumeSkills.split(',').map(s => (
              <span className="skill-tag" key={s}>{s.trim()}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onMyApps}>📋 My Applications</button>
        <button className="btn btn-outline" onClick={onClose}>Browse More Jobs</button>
      </div>
    </div>
  );
}
