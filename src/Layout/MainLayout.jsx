import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import EmergencyReportPopup from "../Components/EmergencyReportPopup";
import { getRoleFromToken } from "../utils/authUtils.js";
import EmergencyFeed from "../Components/EmergencyFeed";

const MainLayout = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = getRoleFromToken(token)?.toUpperCase();

  return (
    <div className="main-layout relative">
      <Header />
      <div>{children}</div>
      <Footer />

      {/* ✅ Hiển thị nút và form khẩn cấp nếu là VENDOR */}
      {role === "CUSTOMER" && <EmergencyReportPopup />}
      {role === "VENDOR" && <EmergencyFeed />}

    </div>
  );
};

export default MainLayout;
