import React from 'react';

const Login = () => {
  const handleGoogleLogin = () => {
    // 1. Client ID lấy từ Google Cloud
    const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE"; 
    
    // 2. Link này phải KHỚP 100% với "Authorized redirect URIs" trên Console
    const REDIRECT_URI = "http://localhost:5173/google-callback"; 
    
    // 3. Scope: Những quyền mình muốn xin (Email và Profile cơ bản)
    const SCOPE = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
    
    // 4. Tạo URL
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&access_type=offline&prompt=consent`;
    
    // 5. Chuyển hướng user
    window.location.href = googleLoginUrl;
  };

  return (
    <button onClick={handleGoogleLogin}>
      Login with Google
    </button>
  );
};
export default Login;