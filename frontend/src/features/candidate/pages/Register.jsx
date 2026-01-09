import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../components/Register.css";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', 
    gender: 'Male', repeatPassword: '', 
    country: '', dob: '', jobs: '', 
    email: '', role: 'Candidate'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. Kiểm tra không để trống trường nào
    for (let key in formData) {
      if (formData[key].trim() === "") {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }
    }

    // 2. Kiểm tra mật khẩu khớp
    if (formData.password !== formData.repeatPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
    if (existingUsers.some(user => user.email === formData.email)) {
      alert("Email này đã được đăng ký!");
      return;
    }

    // 3. Lưu ĐẦY ĐỦ các trường dữ liệu
    const newUser = { 
      ...formData, 
      username: formData.name // Sử dụng name làm username đăng nhập
    };

    existingUsers.push(newUser);
    localStorage.setItem('usersList', JSON.stringify(existingUsers));

    alert("Đăng ký thành công!");
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>CREATE A NEW ACCOUNT</h1>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-grid">
            <div className="form-group"><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
            <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} /></div>
            <div className="form-group"><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} /></div>
            <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div className="form-group"><label>Repeat Password</label><input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} /></div>
            <div className="form-group"><label>Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} /></div>
            <div className="form-group"><label>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} /></div>
            <div className="form-group"><label>Current Jobs</label><input type="text" name="jobs" value={formData.jobs} onChange={handleChange} /></div>
            <div className="form-group" style={{gridColumn: "1 / -1"}}><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleChange} /></div>
          </div>
          <button type="submit" className="btn-register">Register Now</button>
          <div className="back-to-login"><Link to="/login" style={{ color: '#fff', display: 'block', marginTop: '15px' }}>Already have an account? Login</Link></div>
        </form>
      </div>
    </div>
  );
};

export default Register;