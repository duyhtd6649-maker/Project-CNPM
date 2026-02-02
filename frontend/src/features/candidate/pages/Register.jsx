import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../infrastructure/http/axiosClient";
import { useAuth } from "../../../app/AppProviders";
import "../components/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    gender: "Male",
    country: "",
    jobs: "",
    role: "Candidate",
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

    const payload = {
      username: formData.email, // Backend dùng email làm username
      email: formData.email, // Phải có email nếu không sẽ báo lỗi blank
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
      setLoading(true);
      const res = await axiosClient.post("/api/auth/registration/", payload);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert("Lỗi đăng ký: " + JSON.stringify(err.response?.data));
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
              <label>Username</label>
              <input name="username" onChange={handleChange} required />
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
              <select
                name="gender"
                className="form-select"
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
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
              <select
                name="role"
                className="form-select"
                onChange={handleChange}
              >
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
