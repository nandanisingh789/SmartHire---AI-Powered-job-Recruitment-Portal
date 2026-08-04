import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './home.css';

function useCountUp(target, durationMs = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

export default function Home() {
  const { user } = useAuth();
  const score = useCountUp(94);

  const dashboardByRole = {
    CANDIDATE: { to: '/candidate/applications', label: 'View My Applications' },
    RECRUITER: { to: '/recruiter/dashboard', label: 'Go to Dashboard' },
    ADMIN: { to: '/admin/dashboard', label: 'Go to Dashboard' },
  };
  const primaryCta = user
    ? dashboardByRole[user.role] ?? { to: '/jobs', label: 'Browse Open Roles' }
    : { to: '/register', label: 'Create Free Account' };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div>
            <span className="lp-eyebrow"><span className="dot" />AI-Powered Matching</span>
            <h1>Stop guessing who's <span className="hl">right</span> for the role.</h1>
            <p className="lp-hero-sub">
              SmartHire scores every application against the job description the moment it's submitted —
              skills, experience, and fit — so recruiters see a ranked shortlist, not a pile of resumes.
            </p>
            <div className="lp-hero-cta">
              <Link to={primaryCta.to} className="lp-btn lp-btn-spark">{primaryCta.label} →</Link>
              <Link to="/jobs" className="lp-btn lp-btn-ghost">Browse Open Roles</Link>
            </div>
            <p className="lp-hero-note">
              Exploring the demo? Try <code>candidate@smarthire.com</code> / <code>cand123</code> on the login page.
            </p>
          </div>

          <div className="lp-match" aria-hidden="true">
            <div className="lp-demo-card">
              <div className="lp-demo-avatar">AV</div>
              <div>
                <div className="lp-demo-name">Aisha Verma</div>
                <div className="lp-demo-role">Frontend Developer · 3 yrs exp</div>
                <div className="lp-demo-tags"><span>React</span><span>TypeScript</span><span>CSS</span></div>
              </div>
            </div>

            <div className="lp-beam">
              <div className="lp-beam-line" />
              <div className="lp-score">
                <span className="lp-score-num">{score}</span>
                <span className="lp-score-percent">%</span>
                <span className="lp-score-label">MATCH</span>
              </div>
            </div>

            <div className="lp-demo-card job">
              <div className="lp-demo-avatar job">NT</div>
              <div>
                <div className="lp-demo-name">Frontend Developer</div>
                <div className="lp-demo-role">NimbusTech · Bengaluru</div>
                <div className="lp-demo-tags"><span>React</span><span>TypeScript</span><span>Redux</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────── */}
      <section className="lp-section">
        <div className="lp-section-head">
          <span className="lp-kicker">Three seats, one platform</span>
          <h2>Built for everyone at the hiring table</h2>
          <p>Whichever side you're on, SmartHire gives you the tools for that role — no clutter from the others.</p>
        </div>
        <div className="lp-feature-grid">
          <Link to="/register" className="lp-feature-card">
            <div className="lp-feature-icon c1">🎯</div>
            <h3>For Candidates</h3>
            <p>Apply in a few clicks, get an instant AI match score on every application, and track status from applied to hired.</p>
            <span className="lp-arrow">Find a role →</span>
          </Link>
          <Link to="/register" className="lp-feature-card">
            <div className="lp-feature-icon c2">🗂️</div>
            <h3>For Recruiters</h3>
            <p>Post a role, and watch applicants arrive pre-ranked by fit — with predicted salary bands and skill overlap built in.</p>
            <span className="lp-arrow">Post a job →</span>
          </Link>
          <Link to="/login" className="lp-feature-card">
            <div className="lp-feature-icon c3">🛡️</div>
            <h3>For Admins</h3>
            <p>Oversee every job, application, and account on the platform from a single control panel.</p>
            <span className="lp-arrow">Sign in →</span>
          </Link>
        </div>
      </section>

      {/* ── How scoring works ────────────────────────── */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-steps">
          <div className="lp-section-head">
            <span className="lp-kicker">Under the hood</span>
            <h2>How the match score is built</h2>
            <p>Three steps happen the instant a candidate hits submit.</p>
          </div>
          <div className="lp-step-grid">
            <div className="lp-step">
              <div className="lp-step-num">01</div>
              <h4>Resume in, skills out</h4>
              <p>The uploaded resume is parsed and the candidate's skills are extracted and made editable.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">02</div>
              <h4>Compare against the JD</h4>
              <p>Those skills are checked against the job's required skills and experience threshold.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">03</div>
              <h4>Rank instantly</h4>
              <p>A match score and predicted salary range appear immediately — for the candidate and the recruiter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-cta">
          <h2>Ready to see your match score?</h2>
          <p>It takes less than a minute to create an account and apply to your first role.</p>
          <Link to="/register" className="lp-btn lp-btn-ghost">Get Started →</Link>
        </div>
      </section>

      <footer className="lp-footer">⚡ SmartHire — AI-powered hiring, built with Spring Boot &amp; React.</footer>
    </div>
  );
}
