import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "/src/infrastructure/http/axiosClient"; 
import '../components/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', repeatPassword: '',
    gender: 'Male', country: '', dob: '', jobs: '', email: '', role: 'Candidate'
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

    // FIX: Mapping đúng trường 'password1' và 'password2' theo yêu cầu của BE trong ảnh lỗi
    const payload = {
      username: formData.email,
      email: formData.email,
      password1: formData.password,    // BE yêu cầu trường này
      password2: formData.repeatPassword, // BE yêu cầu trường này
      first_name: formData.name,
      role: formData.role.toLowerCase(),
    };

    try {
      const response = await axiosClient.post('/auth/registration/', payload);
      if (response.status === 201 || response.status === 200) {
        alert("Đăng ký thành công!");
        navigate('/login');
      }
    } catch (error) {
      const serverErrors = error.response?.data;
      let msg = "Đăng ký thất bại: ";
      if (serverErrors) {
        msg += Object.entries(serverErrors).map(([k, v]) => `${k}: ${v}`).join(" | ");
      } else {
        msg += "Không thể kết nối đến Server.";
      }
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create Account</h1>
        <form onSubmit={handleRegister}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" onChange={handleChange} className="form-select">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Repeat Password</label>
              <input type="password" name="repeatPassword" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Jobs</label>
              <input type="text" name="jobs" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Enter your email</label>
              <input type="email" name="email" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Roles</label>
              <select name="role" onChange={handleChange} className="form-select">
                <option value="Candidate">Candidate</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? "Đang xử lý..." : "Register"}
          </button>
          <div className="back-to-login">
            <Link to="/login" className="login-link">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

