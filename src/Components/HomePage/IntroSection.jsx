import React from "react";
import introImage from '../../assets/intro.png';
import '../../Style/HomePage/IntroSection.css';

const IntroSection = () => {
  return (
    <div className="intro-section">
      <div className="intro-left">
        <h1 className="intro-title">Vì Một Thế Giới Tốt Đẹp Hơn Cho Động Vật</h1>
        <p className="intro-content">
          PACP là nơi mọi người có thể chung tay cứu trợ, nhận nuôi và lan tỏa yêu thương đến những thú cưng cần giúp đỡ. Chúng tôi cam kết mang lại sự minh bạch, an toàn và trải nghiệm thân thiện cho cộng đồng nhận nuôi động vật tại Việt Nam.
        </p>
        <a href="#about" className="main-btn">
          Xem Thêm <span className="arrow">➔</span>
        </a>
      </div>
      <div className="intro-right">
        <img src={introImage} alt="Động Vật" className="intro-image" />
      </div>
    </div>
  );
};

export default IntroSection;
