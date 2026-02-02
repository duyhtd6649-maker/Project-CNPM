import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../../../infrastructure/http/axiosClient"; 
import { useAuth } from '../../../app/AppProviders';
import '../components/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Giữ nguyên từ code cũ của bạn

  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '',
    email: '', 
    phone: '', 
    password: '', 
    repeatPassword: '',
    gender: 'Male', 
    country: '', 
    dob: '', 
    jobs: '', 
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

    // Mapping dữ liệu chính xác theo yêu cầu Backend (Dựa trên lỗi trong ảnh của bạn)
    const payload = {
      username: formData.email,      // Backend dùng email làm username
      email: formData.email,         // Phải có email nếu không sẽ báo lỗi blank
      password1: formData.password,    
      password2: formData.repeatPassword, 
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.role.toLowerCase(), 
      phone_number: formData.phone,
      gender: formData.gender,
      country: formData.country,
      jobs: formData.jobs,
      dob: formData.dob,
    };

    try {
      await axiosClient.post('/api/auth/registration/', payload);
      
      alert(`Đăng ký tài khoản ${formData.role} thành công!`);
      navigate('/login');
      
    } catch (error) {
      console.error("Register Error:", error);

      if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
        alert("Lỗi hệ thống: Sai địa chỉ API (404). Vui lòng kiểm tra lại baseURL trong axiosClient.js");
        return;
      }

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

            {/* THÊM TRƯỜNG EMAIL - CỰC KỲ QUAN TRỌNG */}
            <div className="form-group">
              <label>Email (Username)</label>
              <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" placeholder="Vietnam" value={formData.country} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Repeat Password</label>
              <input type="password" name="repeatPassword" placeholder="Repeat Password" value={formData.repeatPassword} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Job</label>
              <input type="text" name="jobs" placeholder="Your job" value={formData.jobs} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
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