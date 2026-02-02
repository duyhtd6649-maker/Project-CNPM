import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../../../infrastructure/http/axiosClient"; 
import { useAuth } from '../../../app/AppProviders';
import '../components/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    lastName: '',
    firstName: '',
    phone: '', 
    dob: '', 
    password: '', 
    repeatPassword: '',
    gender: 'Male', 
    country: '', 
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

    const payload = {
      username: formData.username,
      email: formData.email,
      password1: formData.password,     
      password2: formData.repeatPassword, 
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      role: formData.role.toLowerCase(),
      dob: formData.dob,
      country: formData.country,
      gender: formData.gender,
      jobs: formData.jobs
    };

    try {
      const response = await axiosClient.post('/api/auth/registration/', payload);
      
      if (response.status === 201 || response.status === 200) {
        alert("Đăng ký thành công!");
        if (response.data.access) {
          login(response.data);
          navigate('/home');
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      const serverErrors = error.response?.data;
      let msg = "Đăng ký thất bại:\n";
      if (typeof serverErrors === 'object') {
        Object.entries(serverErrors).forEach(([k, v]) => msg += `- ${k}: ${v}\n`);
      } else {
        msg += "Mật khẩu không đạt chuẩn hoặc lỗi hệ thống.";
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
              <label>Username</label>
              <input type="text" name="username" placeholder="nva123" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="example@mail.com" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name (Họ)</label>
              <input type="text" name="lastName" placeholder="Nguyễn" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>First Name (Tên)</label>
              <input type="text" name="firstName" placeholder="Văn A" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" placeholder="0123456789" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Abc@12345" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Repeat Password</label>
              <input type="password" name="repeatPassword" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" onChange={handleChange} className="form-select">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" placeholder="Vietnam" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Current Job</label>
              <input type="text" name="jobs" placeholder="Developer" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Register As</label>
              <select name="role" onChange={handleChange} className="form-select">
                <option value="Candidate">Candidate</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? "Processing..." : "Register"}
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