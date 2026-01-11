import React from "react";
import logo from "../../assets/pacp logo 3 1.png";
import "../../Style/HomePage/NavBar.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">PACP</h1>
          <h2 className="hero-subtitle">Pet Rescue and Adoption Platform</h2>
          <p className="hero-description">
            Kết nối cộng đồng yêu động vật, giúp đỡ chó mèo bị bỏ rơi và hỗ trợ các tổ chức cứu hộ tìm người nhận nuôi mới. PACP mang lại thông tin minh bạch, lựa chọn dễ dàng và trải nghiệm nhận nuôi thân thiện trên khắp Việt Nam.
          </p>
          <Link to="/about-us" className="main-btn">
            Về chúng tôi <span className="arrow">➔</span>
          </Link>
        </div>
        <div className="hero-image">
          <img src={logo} alt="PACP Logo" />
        </div>
      </div>
    </section>
  );
};

export default NavBar;
