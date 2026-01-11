/* ResetPassword.jsx */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons từ React Icons
import "../Style/ResetPassword.css"; // Import CSS styles for the component

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lấy email và token từ query param khi component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email") || "";
    const tokenParam = params.get("token") || "";
    setEmail(emailParam);
    setToken(tokenParam);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage("Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const resetPasswordDTO = {
        Email: email,
        Token: token,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword,
      };

      const response = await axios.post(
        "https://pacpproject.onrender.com/api/Auth/reset-password",
        resetPasswordDTO
      );

      if (response.status === 200) {
        setMessage("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
        // Chuyển về trang đăng nhập sau 2s
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
      );
    }
  };

  // Hàm toggle hiển thị/ẩn mật khẩu
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="reset-password-container">
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} readOnly />
        </div>
        <div className="password-field">
          <label>Mật khẩu mới:</label>
          <div className="input-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={toggleNewPasswordVisibility}
              role="button"
              aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="password-field">
          <label>Xác nhận mật khẩu:</label>
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={toggleConfirmPasswordVisibility}
              role="button"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
