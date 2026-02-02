import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../../../infrastructure/http/axiosClient";
import '../components/Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    password: '',
    repeatPassword: '',
    gender: 'Male',
    country: '',
    jobs: '',
    role: 'Candidate',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      alert("Mật khẩu không khớp!");
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
      phone_number: formData.phone,
      gender: formData.gender,
      country: formData.country,
      jobs: formData.jobs,
      role: formData.role.toLowerCase(),
      dob: formData.dob,
    };

    try {
      await axiosClient.post('/api/auth/registration/', payload);
      alert("Đăng ký thành công!");
      navigate('/login');
    } catch (error) {
      alert("Lỗi đăng ký:\n" + JSON.stringify(error.response?.data, null, 2));
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
              <label>Username</label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Repeat Password</label>
              <input
                type="password"
                name="repeatPassword"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Current Job</label>
              <input
                type="text"
                name="jobs"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" onChange={handleChange}>
                <option value="Candidate">Candidate</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>

          </div>

          <button type="submit" disabled={loading} className="btn-register">
            {loading ? "Processing..." : "Register"}
          </button>

          <div className="back-to-login">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
