import React from "react";
import { FaPhone, FaEnvelope, FaFacebookF } from "react-icons/fa";
import "../Style/Footer.css";
const Footer = () => {
  return (
    <div>
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-column">
            <h3 className="footer-logo">PACP</h3>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Liên hệ</h4>
            <p className="footer-info">
              <FaPhone className="footer-icon" /> 0123456789
            </p>
            <p className="footer-info">
              <FaEnvelope className="footer-icon" /> support@pacp.pet.amet
            </p>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Về chúng tôi</h4>
            <ul className="footer-links">
              <li>
                <a href="#home">Trang chủ</a>
              </li>
              <li>
                <a href="#official">Web chính thức</a>
              </li>
              <li>
                <a href="#opportunities">Cơ hội</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Chính sách</h4>
            <ul className="footer-links">
              <li>
                <a href="#privacy">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#rights">Chính sách quyền lợi</a>
              </li>
              <li>
                <a href="#ads">Chính sách quảng cáo</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Fanpage</h4>
            <div className="footer-fanpage">
              <FaFacebookF className="footer-fb-icon" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
