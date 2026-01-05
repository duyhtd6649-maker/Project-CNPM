import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import HomepageCandidates from './HomepageCandidates' 
import ViewUserProfile from './ViewUserProfile'
import PremiumPage from './PremiumPage'
import CreateCV from './CreateCV'
import AdminDashboard from './AdminDashboard'

function App() {
  return (
    <>
      {/* Thanh điều hướng nhanh - Chỉ dùng trong quá trình Dev để test giao diện */}
      <nav style={navStyle}>
        <Link to="/home">User Home</Link>
        <Link to="/admin">Admin Dash</Link>
        <Link to="/create-cv">Create CV</Link>
      </nav>

      <Routes>
        {/* Điều hướng mặc định */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Tuyến đường công khai (Public Routes) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Tuyến đường cho Người dùng (Candidate Routes) */}
        <Route path="/home" element={<HomepageCandidates />} />
        <Route path="/profile" element={<ViewUserProfile />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/create-cv" element={<CreateCV />} />

        {/* Tuyến đường cho Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Xử lý trang 404 - Nếu nhập sai URL sẽ về Login hoặc Home */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}

// Giữ nguyên Style của bạn nhưng tối ưu hiển thị
const navStyle = {
  position: 'fixed',
  bottom: '20px', // Chuyển xuống dưới để không đè lên Header chính của trang
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  display: 'flex',
  gap: '15px',
  background: 'rgba(24, 25, 107, 0.9)', // Đổi màu tím tối cho chuyên nghiệp
  padding: '12px 20px',
  borderRadius: '50px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  fontSize: '13px',
  fontWeight: '600'
};

// Lưu ý: Trong các Link bên trên, bạn cần thêm CSS để đổi màu chữ thành trắng (white)

export default App