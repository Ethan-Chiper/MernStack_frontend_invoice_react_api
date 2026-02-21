import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    login: "",
    email: "",
    password: "",
    accepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.accepted) {
      toast.warning("Please accept the terms and conditions");
      return;
    }

    // Success toast
    toast.success("Registration Successful ✅");

    // Redirect to login
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* LEFT PANEL - Form */}
        <div className="auth-left">
          <div className="logo">COMPANY LOGO</div>
          
          <div className="tabs">
            <span className="active">sign up</span>
            <span onClick={() => navigate("/login")}>login</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="login"
                placeholder="monile no"
                value={form.login}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="confirm"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="terms">
              <input
                type="checkbox"
                name="accepted"
                checked={form.accepted}
                onChange={handleChange}
                required
              />
              <span>I have accepted the terms and conditions</span>
            </div>

            <button type="submit" className="auth-btn">
              sign up →
            </button>
          </form>
        </div>

        {/* RIGHT PANEL - Welcome */}
        <div className="auth-right">
          <h2>Welcome!</h2>
          <p>Lorem ipsum dolor sit amet. Nulla vero eos clita sed tempor ipsum.</p>
        </div>
      </div>
    </div>
  );
}