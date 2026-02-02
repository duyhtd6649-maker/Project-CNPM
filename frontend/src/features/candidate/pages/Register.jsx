import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../../../infrastructure/http/axiosClient"; 
import { useAuth } from '../../../app/AppProviders';
import '../components/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '', 
    phone: '', 
    password: '', 
    repeatPassword: '',
    gender: 'Male', 
    country: '', 
    dob: '', 
    jobs: '', 
    email: '', 
    role: 'Candidate'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.repeatPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);

    // Mapping dữ liệu theo CustomRegisterSerializer của Backend
    const payload = {
      username: formData.email, 
      email: formData.email,
      password1: formData.password,    
      password2: formData.repeatPassword, 
      first_name: formData.name,
      role: formData.role.toLowerCase(), // 'candidate' hoặc 'recruiter'
      phone_number: formData.phone,
      gender: formData.gender,
      country: formData.country,
      jobs: formData.jobs,
      role: formData.role.toLowerCase(),
      dob: formData.dob,
    };

    try {
      // Đã thêm /api/ để khớp với cấu trúc thư mục api/urls.py của bạn
      await axiosClient.post('/api/auth/registration/', payload);
      
      alert(`Đăng ký tài khoản ${formData.role} thành công!`);
      navigate('/login');
      
    } catch (error) {
      console.error("Register Error:", error);

      // 1. Xử lý nếu trả về HTML (thường do sai URL baseURL)
      if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
        alert("Lỗi hệ thống: Sai địa chỉ API (404). Vui lòng kiểm tra lại baseURL trong axiosClient.js");
        return;
      }

      // 2. Xử lý lỗi từ Backend
      const errorData = error.response?.data;
      let errorMsg = "Đăng ký thất bại, vui lòng thử lại!";

      if (errorData && typeof errorData === 'object') {
        errorMsg = Object.entries(errorData)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join("\n");
      } else if (error.message === "Network Error") {
        errorMsg = "Không thể kết nối đến Server. Hãy chắc chắn đã chạy 'python manage.py runserver'";
      }
      
      alert("Lỗi đăng ký:\n" + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>REGISTER</h1>
        <form onSubmit={handleRegister}>
          <div className="form-grid">

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Enter your name" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" placeholder="Enter phone number" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Repeat Password</label>
              <input type="password" name="repeatPassword" placeholder="Repeat Password" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-select" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Country</label>
              <input name="country" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Job</label>
              <input name="jobs" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" className="form-select" onChange={handleChange}>
                <option value="Candidate">Candidate</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>

          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? "Processing..." : "Register"}
          </button>

          <div className="back-to-login">
            <Link to="/login" className="login-link">
              Already have an account? Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
