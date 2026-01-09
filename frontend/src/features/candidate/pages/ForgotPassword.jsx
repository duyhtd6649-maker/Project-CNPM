import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../components/ForgotPassword.css";


const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // 1. Khởi tạo State để lưu giá trị input
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    newPassword: '',
    repeatPassword: ''
  });

  // 2. Hàm cập nhật dữ liệu khi gõ phím
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Hàm xử lý khi nhấn nút Change
  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, phone, newPassword, repeatPassword } = formData;

    // Bước A: Kiểm tra xem có ô nào bị bỏ trống không
    if (!email.trim()) return alert("Please enter your email!");
    if (!phone.trim()) return alert("Please enter your phone number!");
    if (!newPassword.trim()) return alert("Please enter new password!");
    if (!repeatPassword.trim()) return alert("Please confirm your password!");

    // Bước B: Kiểm tra định dạng Email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format! (Example: abc@gmail.com)");
      return;
    }

    // Bước C: Kiểm tra mật khẩu khớp nhau
    if (newPassword !== repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Bước D: Giả lập kiểm tra tài khoản tồn tại
    // (Trong thực tế, bước này sẽ gọi API đến Backend)
    const mockRegisteredEmail = "admin@gmail.com"; // Email mẫu đã đăng ký
    if (email !== mockRegisteredEmail) {
      alert("Account does not exist! This email is not registered.");
      return;
    }

    // Bước E: Thành công
    alert("Password changed successfully!");
    navigate('/login'); // Chuyển về trang đăng nhập
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>FORGOT PASSWORD</h1>
        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-group">
            <label>Enter your email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="example@gmail.com" 
            />
          </div>
          
          <div className="forgot-group">
            <label>Phone number</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="forgot-group">
            <label>New password</label>
            <input 
              type="password" 
              name="newPassword" 
              value={formData.newPassword} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="forgot-group">
            <label>Repeat password</label>
            <input 
              type="password" 
              name="repeatPassword" 
              value={formData.repeatPassword} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="forgot-btn-container">
            <button type="submit" className="forgot-btn">Change</button>
          </div>
        </form>
        
        <div className="forgot-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;