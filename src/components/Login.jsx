import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Register.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Login Successful ✅");
    
    // Redirect to product dashboard after 1.5 seconds
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* LEFT PANEL - Form */}
        <div className="auth-left">
          <h1>Hello!</h1>
          <p>Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              SIGN IN
            </button>
          </form>

          <p className="bottom-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/")}>Create</span>
          </p>
        </div>

        {/* RIGHT PANEL - Welcome */}
        <div className="auth-right">
          <h2>Welcome Back!</h2>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>
    </div>
  );
}