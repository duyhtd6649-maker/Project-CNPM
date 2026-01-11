import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Register.css';

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
    // Validate empty
    for (let key in formData) {
      if (typeof formData[key] === 'string' && formData[key].trim() === "") {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }
    }
    if (formData.password !== formData.repeatPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
    const emailExists = savedUsers.some(u => u.email === formData.email);
    if (emailExists) {
      alert("Email này đã được đăng ký!");
      return;
    }

    const newUser = {
      username: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      gender: formData.gender,
      role: formData.role,
      country: formData.country,
      dob: formData.dob,
      jobs: formData.jobs
    };

    savedUsers.push(newUser);
    localStorage.setItem('usersList', JSON.stringify(savedUsers));
    alert("Đăng ký thành công!");
    navigate('/login', { state: { successMessage: "Đăng ký thành công! Mời bạn đăng nhập." } });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>CREATE A NEW ACCOUNT</h1>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-grid">
            <div className="form-group">
              <label>Enter new name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Enter new password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Repeat password</label>
              <input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Jobs</label>
              <input type="text" name="jobs" value={formData.jobs} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Enter your email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Roles</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                <option value="Candidate">Candidate</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-register">Register</button>
          <div className="back-to-login">
            <Link to="/login" className="login-link">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;