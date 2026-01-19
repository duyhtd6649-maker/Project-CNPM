import { createBrowserRouter, Outlet, Navigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

import Login from '../features/candidate/pages/Login.jsx';
import Register from '../features/candidate/pages/Register.jsx';
import ForgotPassword from '../features/candidate/pages/ForgotPassword.jsx';
import HomepageCandidates from '../features/candidate/pages/HomepageCandidates.jsx';
import ViewUserProfile from '../features/candidate/pages/ViewUserProfile.jsx';
import PremiumPage from '../features/candidate/pages/PremiumPage.jsx';
import CreateCV from '../features/candidate/pages/CreateCV.jsx';
import EditProfile from '../features/candidate/pages/EditProfile.jsx';
import NotificationSystem from '../features/candidate/pages/notificationunderdevelopment.jsx';
import SavedCV from '../features/candidate/pages/SavedCV.jsx';

import AdminLogin from '../features/admin/pages/AdminLogin.jsx';
import AdminDashboard from '../features/admin/pages/AdminDashboard.jsx';
import ManageInternalAccount from '../features/admin/pages/ManageInternalAccount.jsx';
import ManageCandidateAccount from '../features/admin/pages/ManageCandidateAccount.jsx';
import ManageAdminAccount from '../features/admin/pages/ManageAdminAccount.jsx';
import ManageRecruiterAccount from '../features/admin/pages/ManageRecruiterAccount.jsx';

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
  fontWeight: '600'
};

const linkStyle = { color: '#fff', textDecoration: 'none' };

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
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" /> },

      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot-password', element: <ForgotPassword /> }
        ]
      },

      { path: 'home', element: <HomepageCandidates /> },
      { path: 'profile', element: <ViewUserProfile /> },
      { path: 'edit-profile', element: <EditProfile /> },
      { path: 'premium', element: <PremiumPage /> },
      { path: 'saved-cv', element: <SavedCV /> },
      { path: 'create-cv', element: <CreateCV /> },
      { path: 'feature-locked', element: <NotificationSystem /> },

      { path: 'admin-login', element: <AdminLogin /> },
      { path: 'admin', element: <AdminDashboard /> },

      { path: 'manage-internal', element: <ManageInternalAccount /> },
      { path: 'manage-candidate', element: <ManageCandidateAccount /> },
      { path: 'manage-recruiter', element: <ManageRecruiterAccount /> },
      { path: 'manage-admin-acc', element: <ManageAdminAccount /> },

      { path: '*', element: <Navigate to="/login" /> }
    ]
  }
]);
