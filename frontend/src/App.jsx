import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import HomepageCandidates from './pages/HomepageCandidates' 
import ViewUserProfile from './pages/ViewUserProfile'
import PremiumPage from './pages/PremiumPage'
import CreateCV from './pages/CreateCV'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin' // Import trang AdminLogin mới tạo

// Thêm Font Archivo Black trực tiếp vào file hoặc index.css
const fontImport = document.createElement('style');
fontImport.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');`;
document.head.appendChild(fontImport);

function App() {
  return (
    <>
      {/* Thanh điều hướng nhanh - Chỉ dùng trong quá trình Dev để test giao diện */}
      <nav style={navStyle}>
        <Link to="/home" style={linkStyle}>User Home</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/admin-login" style={linkStyle}>Admin Login</Link>
        <Link to="/admin" style={linkStyle}>Admin Dash</Link>
        <Link to="/create-cv" style={linkStyle}>Create CV</Link>
      </nav>

      <Routes>
        {/* Điều hướng mặc định */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Tuyến đường công khai (Public Routes) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Tuyến đường Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Tuyến đường cho Người dùng (Candidate Routes) */}
        <Route path="/home" element={<HomepageCandidates />} />
        <Route path="/profile" element={<ViewUserProfile />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/create-cv" element={<CreateCV />} />

        {/* Tuyến đường cho Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Xử lý trang 404 - Nếu nhập sai URL sẽ về Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}

// Style cho thanh điều hướng Dev
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
  fontSize: '12px',
  fontWeight: '600',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255,255,255,0.1)'
};

// Style cho các Link trong Nav để đổi màu chữ trắng
const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

export default App