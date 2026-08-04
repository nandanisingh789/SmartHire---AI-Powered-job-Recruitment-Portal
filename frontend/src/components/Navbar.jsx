import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="spark">⚡</span> SmartHire
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/jobs" className={linkClass}>Browse Jobs</NavLink>

        {!user && (
          <>
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/register" className={linkClass}>Register</NavLink>
          </>
        )}
        {user?.role === 'CANDIDATE' && (
          <NavLink to="/candidate/applications" className={linkClass}>My Applications</NavLink>
        )}
        {user?.role === 'RECRUITER' && (
          <>
            <NavLink to="/recruiter/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/recruiter/post-job" className={linkClass}>Post Job</NavLink>
            <NavLink to="/recruiter/applications" className={linkClass}>Applications</NavLink>
          </>
        )}
        {user?.role === 'ADMIN' && (
          <>
            <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
          </>
        )}
        {user && (
          <>
            <span className="navbar-user">👤 {user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
