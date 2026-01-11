import React from "react";
import bannerCat from "../../assets/banner-cat.png";
import bannerLetter from "../../assets/banner-letter.png";
import bannerDog from "../../assets/banner-dog.png";
import '../../Style/HomePage/BannerHome.css';

const BannerHome = () => {
  return (
    <div className="banner-wrapper">
      <div className="banner-center">
        <img src={bannerCat} alt="Cat" className="image image-cat" />
        <img src={bannerLetter} alt="Letter" className="image image-letter" />
        <img src={bannerDog} alt="Dog" className="image image-dog" />
      </div>
    </div>
  );
};

export default BannerHome;
