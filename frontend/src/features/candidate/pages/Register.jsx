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
      alert("Mật khẩu không khớp!");
      return;
    }
    setLoading(true);
    const payload = {
      username: formData.email,
      email: formData.email,
      password1: formData.password,
      password2: formData.repeatPassword,
      first_name: formData.name,
      role: formData.role.toLowerCase(),
      phone_number: formData.phone,
      gender: formData.gender,
      country: formData.country,
      date_of_birth: formData.dob,
      job_title: formData.jobs
    };

    try {
      await axiosClient.post('auth/registration/', payload);
      alert("Đăng ký thành công!");
      navigate('/login');
    } catch (error) {
      alert("Lỗi đăng ký: " + JSON.stringify(error.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Repeat Password</label>
              <input type="password" name="repeatPassword" placeholder="Repeat" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-select" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" placeholder="Vietnam" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Jobs</label>
              <input type="text" name="jobs" placeholder="Job title" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Enter your email</label>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Roles</label>
              <select name="role" className="form-select" onChange={handleChange}>
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