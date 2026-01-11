import { createBrowserRouter, Outlet, Navigate, Link } from 'react-router-dom';

import Login from '../features/candidate/pages/Login.jsx';
import Register from '../features/candidate/pages/Register.jsx';

import ForgotPassword from '../features/candidate/pages/ForgotPassword';
import HomepageCandidates from '../features/candidate/pages/HomepageCandidates';
import ViewUserProfile from '../features/candidate/pages/ViewUserProfile';
import PremiumPage from '../features/candidate/pages/PremiumPage';
import CreateCV from '../features/candidate/pages/CreateCV';
import AdminLogin from '../features/admin/pages/AdminLogin';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import ManageInternalAccount from '../features/admin/pages/ManageInternalAccount'; 
import ManageCandidateAccount from '../features/admin/pages/ManageCandidateAccount';

const navStyle = {
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  display: 'flex',
  gap: '15px',
  background: 'rgba(24, 25, 107, 0.95)',
  padding: '12px 25px',
  borderRadius: '50px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
  fontSize: '11px',
  fontWeight: '600',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255,255,255,0.1)'
};

const linkStyle = { color: '#ffffff', textDecoration: 'none', textTransform: 'uppercase' };

const RootLayout = () => (
  <>
    <nav style={navStyle}>
      <Link to="/home" style={linkStyle}>Home</Link>
      <Link to="/login" style={linkStyle}>Login</Link>
      <Link to="/register" style={linkStyle}>Register</Link>
      <Link to="/admin" style={linkStyle}>Admin</Link>
    </nav>
    <Outlet />
  </>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "home", element: <HomepageCandidates /> },
      { path: "profile", element: <ViewUserProfile /> },
      { path: "premium", element: <PremiumPage /> },
      { path: "create-cv", element: <CreateCV /> },
      { path: "admin-login", element: <AdminLogin /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "manage-internal", element: <ManageInternalAccount /> },
      { path: "manage-candidate", element: <ManageCandidateAccount /> },
      { path: "*", element: <Navigate to="/login" /> }
    ]
  }
]);