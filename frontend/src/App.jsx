import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import CandidateApplications from './pages/CandidateApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function Protected({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/jobs" />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/candidate/applications" element={<Protected role="CANDIDATE"><CandidateApplications /></Protected>} />
        <Route path="/recruiter/dashboard" element={<Protected role="RECRUITER"><RecruiterDashboard /></Protected>} />
        <Route path="/recruiter/post-job" element={<Protected role="RECRUITER"><PostJob /></Protected>} />
        <Route path="/recruiter/applications" element={<Protected role="RECRUITER"><RecruiterDashboard /></Protected>} />
        <Route path="/admin/dashboard" element={<Protected role="ADMIN"><AdminDashboard /></Protected>} />
        <Route path="/admin/users" element={<Protected role="ADMIN"><AdminDashboard /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
