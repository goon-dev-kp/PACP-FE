import React from "react";
import "../../Style/AboutUs.css";
import petmg from "../../assets/pet.png";
import { FaPaw, FaHeart, FaHandsHelping, FaSearch, FaShieldAlt, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-header">
        <Link to="/" className="aboutus-back-link">
          <button className="aboutus-back-btn" aria-label="Quay lại">
            <span>&#8592;</span>
          </button>
        </Link>
        <h1 className="aboutus-title">
          <FaPaw className="title-icon" /> Về chúng tôi
        </h1>
      </div>
      
      <div className="aboutus-banner">
        <img
          src={petmg}
          alt="Banner mèo và chó"
          className="aboutus-banner-img"
        />
        <div className="banner-overlay">
          <h2 className="banner-title">Cứu hộ & Nhận nuôi thú cưng</h2>
          <p className="banner-subtitle">Kết nối yêu thương - Trao cơ hội sống</p>
        </div>
      </div>
      
      <div className="aboutus-content">
        <div className="mission-section">
          <p>
            PACP là nền tảng kết nối cộng đồng yêu động vật, giúp đỡ những chú chó mèo bị bỏ rơi tìm được mái ấm mới. 
            Chúng tôi cung cấp thông tin minh bạch, hỗ trợ quá trình nhận nuôi và lan tỏa tình yêu thương đến mọi ngóc ngách tại Việt Nam.
          </p>
        </div>
        
        <div className="values-section">
          <h3 className="section-title"><FaHeart className="section-icon" /> Giá trị cốt lõi</h3>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon rescue-icon">
                <FaPaw />
              </div>
              <h4>Cứu hộ động vật</h4>
              <p>Cầu nối giữa người nhận nuôi và động vật cần giúp đỡ, giúp chúng tìm được mái ấm an toàn.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon reduce-icon">
                <FaHandsHelping />
              </div>
              <h4>Giảm thiểu bỏ rơi</h4>
              <p>Khuyến khích nhận nuôi thay vì mua bán, nâng cao nhận thức về bảo vệ động vật.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon connect-icon">
                <FaHeart />
              </div>
              <h4>Kết nối cộng đồng</h4>
              <p>Xây dựng mạng lưới những người yêu động vật, sẵn sàng sẻ chia và hỗ trợ.</p>
            </div>
          </div>
        </div>
        
        <div className="features-section">
          <h3 className="section-title"><FaSearch className="section-icon" /> Đặc điểm nổi bật</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <div>
                <h4>Tìm kiếm dễ dàng</h4>
                <p>Lọc động vật theo giống, tuổi, giới tính, kích thước để tìm bạn đồng hành lý tưởng.</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <div>
                <h4>An toàn sức khỏe</h4>
                <p>Giảm rủi ro bệnh tật và nâng cao chất lượng sống cho thú cưng.</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <div>
                <h4>Tiện ích vượt trội</h4>
                <p>Tiết kiệm thời gian với quy trình nhận nuôi đơn giản, minh bạch.</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaHandsHelping />
              </div>
              <div>
                <h4>Hỗ trợ tổ chức</h4>
                <p>Tạo nguồn thu bền vững cho các trạm cứu hộ thông qua hệ thống đóng góp.</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaPaw />
              </div>
              <div>
                <h4>Phát triển bền vững</h4>
                <p>Phân tích dữ liệu để đề xuất mô hình cứu hộ hiệu quả, hợp tác toàn diện.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="aboutus-footer">
        <h3>Liên hệ với chúng tôi</h3>
        <p>Email: support@pacp.vn | Hotline: 1900 1234</p>
        <p>© 2023 PACP - Pet Adoption & Care Platform</p>
      </div>
    </div>
  );
};

export default AboutUs;
