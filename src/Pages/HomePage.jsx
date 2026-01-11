import React from "react";
import NavBar from "../Components/HomePage/NavBar";
import BannerHome from "../Components/HomePage/BannerHome";
import IntroSection from "../Components/HomePage/IntroSection";
import MapSection from "../Components/HomePage/MapSection";
import EmergencyStoryCarousel from "../Components/HomePage/EmergencyStoryCarousel.jsx";
import "../Style/HomePage/HomePage.css"; // Thêm file này

const HomePage = () => {
  return (
    <div className="homepage-bg">
      <NavBar />
      <BannerHome />
      <IntroSection />
      <EmergencyStoryCarousel />
      <MapSection />
    </div>
  );
};

export default HomePage;
