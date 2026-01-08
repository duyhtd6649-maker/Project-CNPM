import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './features/candidate/pages/Login'
import Register from './features/candidate/pages/Register'
import ForgotPassword from './features/candidate/pages/ForgotPassword'
import HomepageCandidates from './features/candidate/pages/HomepageCandidates'
import ViewUserProfile from './features/candidate/pages/ViewUserProfile'
import PremiumPage from './features/candidate/pages/PremiumPage'
import CreateCV from './features/candidate/pages/CreateCV'
import AdminLogin from './features/admin/pages/AdminLogin'
import AdminDashboard from './features/admin/pages/AdminDashboard'
import ManageInternalAccount from './features/admin/pages/ManageInternalAccount' 
import ManageCandidateAccount from './features/admin/pages/ManageCandidateAccount'

const fontImport = document.createElement('style')
fontImport.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
`
document.head.appendChild(fontImport)

function App() {
  return (
    <>
      <nav style={navStyle}>
        <Link to="/home" style={linkStyle}>User Home</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/admin-login" style={linkStyle}>Admin Login</Link>
        <Link to="/admin" style={linkStyle}>Admin Dash</Link>
        <Link to="/manage-internal" style={linkStyle}>Internal</Link>
        <Link to="/manage-candidate" style={linkStyle}>Candidate</Link>
        <Link to="/create-cv" style={linkStyle}>Create CV</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<HomepageCandidates />} />
        <Route path="/profile" element={<ViewUserProfile />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/create-cv" element={<CreateCV />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        <Route path="/manage-internal" element={<ManageInternalAccount />} />
        <Route path="/manage-candidate" element={<ManageCandidateAccount />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}

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
}

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}

export default App