import React, { useState } from "react";
import axios from "axios";
import "../Style/ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 

  const handleSend = async () => {
    if (!email) {
      setMessage("Vui lòng nhập email.");
      return;
    }
    try {
      const response = await axios.post("https://pacpproject.onrender.com/api/Auth/forgot-password", email, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage(response.data.message || "Email đã được gửi. Vui lòng kiểm tra hộp thư.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Gửi email thất bại, vui lòng thử lại sau."
      );
    }
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-form">
        <p>Quên Mật Khẩu</p>
        <input
          type="email"
          placeholder="Nhập vào email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSend}>Gửi</button>
        {message && <p className="response-message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;
