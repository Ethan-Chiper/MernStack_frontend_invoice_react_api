import React, { Component } from "react";
import "../styles/Login.css";
import { loginUser } from "../services/authService";

class Login extends Component {
  state = {
    username: "",
    password: "",
    loading: false,
    error: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  // ✅ back to register
  goBack = () => {
    this.props.navigate && this.props.navigate("register");
  };

  // ✅ bottom register button navigation
  goToRegister = () => {
    this.props.navigate && this.props.navigate("register");
  };
  // 🔥 LOGIN API
  handleLogin = async () => {
    const { username, password } = this.state;

    if (!username || !password) {
      return this.setState({
        error: "Please enter username and password",
      });
    }

    try {
      this.setState({ loading: true });

      const payload = {
        email: username, // change to username if backend needs
        password,
      };

      console.log("🚀 Login payload:", payload);

      const res = await loginUser(payload);

      // ✅ IMPORTANT — SAVE TOKEN + USER_ID
      const token = res?.data?.data?.token;
      const userId = res?.data?.data?.user?.user_id;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (userId) {
        localStorage.setItem("user_id", userId);
      }

      console.log("✅ Saved token:", token);
      console.log("✅ Saved user_id:", userId);

      alert(res?.data?.message || "Login successful");

      // redirect
      this.props.navigate("dashboard");
    } catch (err) {
      console.error("❌ Login error:", err?.response || err);

      this.setState({
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Login failed",
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="auth-wrapper">
        {/* 🔵 Top Bar — RIGHT ALIGNED */}
        <div className="top-bar top-bar-flex">
          <h2>ADMIN</h2>

          <button className="back-btn" onClick={this.goBack}>
            ← Back
          </button>
        </div>

        <div className="auth-card">
          <h2 className="title">Login</h2>

          {this.state.error && (
            <div className="error-text">{this.state.error}</div>
          )}

          <label>username</label>
          <input
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={this.handleChange}
          />

          <label>password</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handleChange}
          />

          <div className="forgot">Forgot password?</div>

          <button
            className="btn-login"
            onClick={this.handleLogin}
            disabled={this.state.loading}
          >
            {this.state.loading ? "Please wait..." : "Login"}
          </button>

          {/* 🔥 CLICKABLE WORD (NOT BUTTON) */}
          <div className="auth-switch">
              Don't have an account?{" "}
            <span className="link-text" onClick={this.goToRegister}>
              Register
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;