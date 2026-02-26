import React, { Component } from "react";
import "../styles/Register.css";
import { registerUser } from "../services/authService";

class Register extends Component {
  state = {
    name: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  // ✅ ADD THIS (YOUR MISSING PART)
  goToLogin = () => {
    this.props.navigate("login");
  };

  handleRegister = async () => {
    const {
      name,
      email,
      countryCode,
      mobile,
      password,
      confirmPassword,
    } = this.state;

    // ✅ validation
    if (!name || !email || !mobile || !password) {
      return this.setState({ error: "All fields required" });
    }

    if (password !== confirmPassword) {
      return this.setState({ error: "Passwords do not match" });
    }

    try {
      this.setState({ loading: true });

      // 🔥 EXACT PAYLOAD FOR YOUR BACKEND
      const payload = {
        name,
        email,
        mobile: {
          country_code: countryCode,
          national_number: mobile,
        },
        password,
      };

      console.log("Sending payload:", payload);

      const res = await registerUser(payload);

      alert(res.data?.message || "Registered successfully");

      // ✅ redirect to login
      this.props.navigate("login");
    } catch (err) {
      this.setState({
        error: err?.message || "Registration failed",
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="auth-wrapper">
        <div className="top-bar">
          <h2>ADMIN</h2>
        </div>

        <div className="auth-card">
          <h2 className="title">Registration</h2>

          {this.state.error && (
            <div className="error-text">{this.state.error}</div>
          )}

          <label>Name</label>
          <input name="name" onChange={this.handleChange} />

          <label>Email</label>
          <input name="email" onChange={this.handleChange} />

          <label>Mobile</label>
          <div className="mobile-row">
            <select
              name="countryCode"
              value={this.state.countryCode}
              onChange={this.handleChange}
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
            </select>

            <input
              name="mobile"
              placeholder="9876543210"
              onChange={this.handleChange}
            />
          </div>

          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={this.handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={this.handleChange}
          />

          <button
            className="btn-login"
            onClick={this.handleRegister}
            disabled={this.state.loading}
          >
            {this.state.loading ? "Please wait..." : "Register"}
          </button>

          {/* Login (same style) */}
            <button className="btn-login" 
                  onClick={this.goToLogin}
                  disabled={this.state.loading}
            >
              Login
          </button>
        </div>
      </div>
    );
  }
}

export default Register;
