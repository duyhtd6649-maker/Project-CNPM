import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import HomepageCandidates from './HomepageCandidates' 
import ViewUserProfile from './ViewUserProfile'
import PremiumPage from './PremiumPage'
import CreateCV from './CreateCV' // Import trang CreateCV mới

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<HomepageCandidates />} />
      <Route path="/profile" element={<ViewUserProfile />} />
      <Route path="/premium" element={<PremiumPage />} />
      
      {/* Tuyến đường cho trang tạo CV */}
      <Route path="/create-cv" element={<CreateCV />} />
    </Routes>
  )
}

// CSS inline tùy chọn (giữ nguyên từ code của bạn)
const navStyle = {
  position: 'fixed',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  display: 'flex',
  gap: '10px',
  background: 'rgba(255, 255, 255, 0.8)',
  padding: '10px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
};

export default App