import { createBrowserRouter, Outlet, Navigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from './AppProviders';

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

import RecruiterDashboard from '../features/recruiter/pages/RecruiterDashboard'; // Đảm bảo đường dẫn này đúng

// --- CẬP NHẬT PROTECTED ROUTE THÔNG MINH HƠN ---
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  // Kiểm tra cả state user và localStorage để tránh lỗi khi F5 trang
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  // Nếu không có user trong context VÀ cũng không có token trong máy -> Bắt đăng nhập
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RootLayout = () => {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" /> },
      {
        path: '/',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot', element: <ForgotPassword /> },
        ],
      },
      // Đường dẫn cho Candidate (Khớp với navigate('/homepage') trong Login.jsx)
      { 
        path: 'homepage', 
        element: <ProtectedRoute><HomepageCandidates /></ProtectedRoute> 
      },
      { path: 'profile', element: <ProtectedRoute><ViewUserProfile /></ProtectedRoute> },
      { path: 'edit-profile', element: <ProtectedRoute><EditProfile /></ProtectedRoute> },
      { path: 'premium', element: <ProtectedRoute><PremiumPage /></ProtectedRoute> },
      { path: 'saved-cv', element: <ProtectedRoute><SavedCV /></ProtectedRoute> },
      { path: 'chatbot', element: <ProtectedRoute><Chatbot /></ProtectedRoute> },
      { path: 'view-job', element: <ProtectedRoute><Viewjob /></ProtectedRoute> },
      { path: 'job-list', element: <ProtectedRoute><JobBrowsing /></ProtectedRoute> },
      { path: 'create-cv', element: <ProtectedRoute><CreateCV /></ProtectedRoute> },
      { path: 'feature-locked', element: <NotificationSystem /> },
      
      // --- ROUTE RECRUITER ---
      { 
        path: 'recruiter-dashboard', 
        element: <ProtectedRoute><RecruiterDashboard /></ProtectedRoute> 
      },

      // --- ROUTE ADMIN ---
      { path: 'admin-login', element: <AdminLogin /> },
      { path: 'admin', element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
      { path: 'manage-internal', element: <ProtectedRoute><ManageInternalAccount /></ProtectedRoute> },
      { path: 'manage-candidate', element: <ProtectedRoute><ManageCandidateAccount /></ProtectedRoute> },
      { path: 'manage-recruiter', element: <ProtectedRoute><ManageRecruiterAccount /></ProtectedRoute> },
      { path: 'manage-admin-acc', element: <ProtectedRoute><ManageAdminAccount /></ProtectedRoute> },
      
      // Mặc định nếu sai đường dẫn thì về login
      { path: '*', element: <Navigate to="/login" /> },
    ],
  },
]);