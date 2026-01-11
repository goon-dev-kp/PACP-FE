/* CustomerLogin.jsx */
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons từ React Icons
import { login } from "../services/authservice.";
import logo from "../assets/logo.png";
import "../Style/Login.css";



const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      console.log("API trả về:", data); // Kiểm tra dữ liệu trả về
      // Lưu token đúng trường
      if (data.result && data.result.accessToken) {
        localStorage.setItem("token", data.result.accessToken);
      }
      navigate("/", { state: { message: "Đăng nhập thành công!" } });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  // Hàm toggle hiển thị/ẩn mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="container-login">
        <div className="title-login">Đăng nhập</div>
        {message && (
          <div style={{ color: "green", marginBottom: 10 }}>{message}</div>
        )}
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="input-login"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              className="input-login"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={togglePasswordVisibility}
              role="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="links-login">
            <Link to={"/forget-password"}>Quên mật khẩu</Link>
            <Link to={"/register"}>Chưa có tài khoản?</Link>
          </div>
          <button className="login-btn" type="submit">
            Đăng nhập
          </button>
        </form>
        <div className="footer-login">
          Điều khoản sử dụng | Chính sách riêng tư
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
