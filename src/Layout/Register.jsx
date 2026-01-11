/* Register.jsx */
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons từ React Icons
import { registerCustomer, registerBusiness } from "../services/authservice.";
import "../Style/Register.css";

const Register = () => {
  const [accountType, setAccountType] = useState("business");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showBusinessPassword, setShowBusinessPassword] = useState(false);
  const [showBusinessConfirmPassword, setShowBusinessConfirmPassword] =
    useState(false);
  const [showPersonalPassword, setShowPersonalPassword] = useState(false);
  const [showPersonalConfirmPassword, setShowPersonalConfirmPassword] =
    useState(false);

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra xác nhận mật khẩu
    if (
      (accountType === "business" &&
        formData.businessPassword !== formData.businessConfirmPassword) ||
      (accountType === "personal" &&
        formData.personalPassword !== formData.personalConfirmPassword)
    ) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    try {
      if (accountType === "business") {
        await registerBusiness({
          userName: formData.companyName, // hoặc trường nhập tên người đại diện nếu có
          email: formData.businessEmail,
          password: formData.businessPassword,
          confirmPassword: formData.businessConfirmPassword,
          phoneNumber: formData.businessPhone,
          address: formData.businessAddress || "",
          dateOfBirth: formData.establishmentDate, // hoặc trường phù hợp
          cccd: "string", // hoặc giá trị mặc định
          avatar: "default-avatar.png",
          bussinessName: formData.companyName,
          bussinessNumber: formData.taxCode,
        });
      } else {
        await registerCustomer({
          userName: formData.fullName,
          email: formData.personalEmail,
          password: formData.personalPassword,
          confirmPassword: formData.personalConfirmPassword,
          phoneNumber: formData.personalPhone,
          address: formData.address,
          dateOfBirth: formData.birthDate,
          cccd: "string", // Giá trị mặc định cho CCCD
          avatar: "default-avatar.png", // Giá trị mặc định cho avatar
        });
      }
      alert("Đăng ký thành công!");
      setFormData({});
    } catch (error) {
      alert("Đăng ký thất bại: " + (error?.message || JSON.stringify(error)));
    }
    setLoading(false);
  };

  // Hàm toggle hiển thị/ẩn mật khẩu
  const toggleBusinessPasswordVisibility = () => {
    setShowBusinessPassword(!showBusinessPassword);
  };

  const toggleBusinessConfirmPasswordVisibility = () => {
    setShowBusinessConfirmPassword(!showBusinessConfirmPassword);
  };

  const togglePersonalPasswordVisibility = () => {
    setShowPersonalPassword(!showPersonalPassword);
  };

  const togglePersonalConfirmPasswordVisibility = () => {
    setShowPersonalConfirmPassword(!showPersonalConfirmPassword);
  };

  return (
    <div className="container-register">
      <h2 className="register-title">
        <span className="title-icon">👤</span> Đăng Ký Tài Khoản
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="accountType"
              value="business"
              className="radio-input"
              checked={accountType === "business"}
              onChange={() => handleAccountTypeChange("business")}
            />
            Tài khoản doanh nghiệp
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="accountType"
              value="personal"
              className="radio-input"
              checked={accountType === "personal"}
              onChange={() => handleAccountTypeChange("personal")}
            />
            Tài khoản cá nhân
          </label>
        </div>

        {/* Trường cho tài khoản doanh nghiệp */}
        <div
          className={
            accountType === "business"
              ? "fields-container"
              : "fields-container hidden"
          }
          id="businessFields"
        >
          <div className="form-group">
            <label htmlFor="companyName" className="form-label">
              Tên công ty
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="input-field"
              required={accountType === "business"}
              value={formData.companyName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="taxCode" className="form-label">
              Mã số thuế
            </label>
            <input
              type="text"
              id="taxCode"
              name="taxCode"
              className="input-field"
              required={accountType === "business"}
              value={formData.taxCode || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="businessEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="businessEmail"
              name="businessEmail"
              className="input-field"
              required={accountType === "business"}
              value={formData.businessEmail || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="businessPhone" className="form-label">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="businessPhone"
              name="businessPhone"
              className="input-field"
              required={accountType === "business"}
              value={formData.businessPhone || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="businessPassword" className="form-label">
              Mật khẩu
            </label>
            <div className="input-wrapper">
              <input
                type={showBusinessPassword ? "text" : "password"}
                id="businessPassword"
                name="businessPassword"
                className="input-field"
                required={accountType === "business"}
                value={formData.businessPassword || ""}
                onChange={handleChange}
              />
              <span
                className="eye-icon"
                onClick={toggleBusinessPasswordVisibility}
                role="button"
                aria-label={
                  showBusinessPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                {showBusinessPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="businessConfirmPassword" className="form-label">
              Xác nhận mật khẩu
            </label>
            <div className="input-wrapper">
              <input
                type={showBusinessConfirmPassword ? "text" : "password"}
                id="businessConfirmPassword"
                name="businessConfirmPassword"
                className="input-field"
                required={accountType === "business"}
                value={formData.businessConfirmPassword || ""}
                onChange={handleChange}
              />
              <span
                className="eye-icon"
                onClick={toggleBusinessConfirmPasswordVisibility}
                role="button"
                aria-label={
                  showBusinessConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                {showBusinessConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="establishmentDate" className="form-label">
              Ngày thành lập
            </label>
            <input
              type="date"
              id="establishmentDate"
              name="establishmentDate"
              className="input-field date-input"
              required={accountType === "business"}
              value={formData.establishmentDate || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="businessAddress" className="form-label">
              Địa chỉ doanh nghiệp
            </label>
            <input
              type="text"
              id="businessAddress"
              name="businessAddress"
              className="input-field"
              value={formData.businessAddress || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Trường cho tài khoản cá nhân */}
        <div
          className={
            accountType === "personal"
              ? "fields-container"
              : "fields-container hidden"
          }
          id="personalFields"
        >
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="input-field"
              required={accountType === "personal"}
              value={formData.fullName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="personalEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="personalEmail"
              name="personalEmail"
              className="input-field"
              required={accountType === "personal"}
              value={formData.personalEmail || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="personalPhone" className="form-label">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="personalPhone"
              name="personalPhone"
              className="input-field"
              required={accountType === "personal"}
              value={formData.personalPhone || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="personalPassword" className="form-label">
              Mật khẩu
            </label>
            <div className="input-wrapper">
              <input
                type={showPersonalPassword ? "text" : "password"}
                id="personalPassword"
                name="personalPassword"
                className="input-field"
                required={accountType === "personal"}
                value={formData.personalPassword || ""}
                onChange={handleChange}
              />
              <span
                className="eye-icon"
                onClick={togglePersonalPasswordVisibility}
                role="button"
                aria-label={
                  showPersonalPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                {showPersonalPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="personalConfirmPassword" className="form-label">
              Xác nhận mật khẩu
            </label>
            <div className="input-wrapper">
              <input
                type={showPersonalConfirmPassword ? "text" : "password"}
                id="personalConfirmPassword"
                name="personalConfirmPassword"
                className="input-field"
                required={accountType === "personal"}
                value={formData.personalConfirmPassword || ""}
                onChange={handleChange}
              />
              <span
                className="eye-icon"
                onClick={togglePersonalConfirmPasswordVisibility}
                role="button"
                aria-label={
                  showPersonalConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                {showPersonalConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="birthDate" className="form-label">
              Ngày sinh
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              className="input-field date-input"
              required={accountType === "personal"}
              value={formData.birthDate || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="input-field"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Đang xử lý..." : "Tạo tài khoản"}
        </button>
      </form>
      <div className="footer-text">Điều khoản sử dụng | Chính sách bảo mật</div>
    </div>
  );
};

export default Register;
