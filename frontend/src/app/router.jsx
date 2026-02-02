import { createBrowserRouter, Outlet, Navigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { AppProviders, useAuth } from './AppProviders';

import Login from '../features/candidate/pages/Login';
import Register from '../features/candidate/pages/Register';
import ForgotPassword from '../features/candidate/pages/ForgotPassword';
import HomepageCandidates from '../features/candidate/pages/HomepageCandidates';
import ViewUserProfile from '../features/candidate/pages/ViewUserProfile';
import PremiumPage from '../features/candidate/pages/PremiumPage';
import CreateCV from '../features/candidate/pages/CreateCV';
import EditProfile from '../features/candidate/pages/EditProfile';
import NotificationSystem from '../features/candidate/pages/notificationunderdevelopment';
import SavedCV from '../features/candidate/pages/SavedCV';
import Chatbot from '../features/candidate/pages/Chatbot';
import Viewjob from '../features/candidate/pages/Viewjob';
import JobBrowsing from '../features/candidate/pages/Joblist';

import AdminLogin from '../features/admin/pages/AdminLogin';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import ManageInternalAccount from '../features/admin/pages/ManageInternalAccount';
import ManageCandidateAccount from '../features/admin/pages/ManageCandidateAccount';
import ManageRecruiterAccount from '../features/admin/pages/ManageRecruiterAccount';
import ManageAdminAccount from '../features/admin/pages/ManageAdminAccount';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const navStyle = {
  position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
  zIndex: 1000, display: 'flex', gap: '15px', background: 'rgba(24, 25, 107, 0.95)',
  padding: '12px 25px', borderRadius: '50px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
  fontSize: '11px', fontWeight: '600'
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
          { path: 'forgot-password', element: <ForgotPassword /> },
        ],
      },
      { path: 'home', element: <ProtectedRoute><HomepageCandidates /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><ViewUserProfile /></ProtectedRoute> },
      { path: 'edit-profile', element: <ProtectedRoute><EditProfile /></ProtectedRoute> },
      { path: 'premium', element: <ProtectedRoute><PremiumPage /></ProtectedRoute> },
      { path: 'saved-cv', element: <ProtectedRoute><SavedCV /></ProtectedRoute> },
      { path: 'chatbot', element: <ProtectedRoute><Chatbot /></ProtectedRoute> },
      { path: 'view-job', element: <ProtectedRoute><Viewjob /></ProtectedRoute> },
      { path: 'job-list', element: <ProtectedRoute><JobBrowsing /></ProtectedRoute> },
      { path: 'create-cv', element: <ProtectedRoute><CreateCV /></ProtectedRoute> },
      { path: 'feature-locked', element: <NotificationSystem /> },
      { path: 'admin-login', element: <AdminLogin /> },
      { path: 'admin', element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
      { path: 'manage-internal', element: <ProtectedRoute><ManageInternalAccount /></ProtectedRoute> },
      { path: 'manage-candidate', element: <ProtectedRoute><ManageCandidateAccount /></ProtectedRoute> },
      { path: 'manage-recruiter', element: <ProtectedRoute><ManageRecruiterAccount /></ProtectedRoute> },
      { path: 'manage-admin-acc', element: <ProtectedRoute><ManageAdminAccount /></ProtectedRoute> },
      { path: '*', element: <Navigate to="/login" /> },
    ],
  },
]);