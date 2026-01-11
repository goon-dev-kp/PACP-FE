import React from "react";
import { FaPaw, FaPhoneAlt, FaMapMarkerAlt, FaHandsHelping, FaUserPlus, FaExclamationTriangle, FaDonate } from "react-icons/fa";
import VendorMapSection from "../Pages/VendorMapPage"; // Component bản đồ trạm cứu hộ (có thể dùng lại VendorMapPage)
import EmergencyStoryCarousel from "../Components/HomePage/EmergencyStoryCarousel";
import "../Style/RescuePage.css";
import { Link } from "react-router-dom";

export default function RescuePage() {
  return (
    <div className="rescue-bg">
      <section className="rescue-hero">
        <div className="rescue-hero-content">
          <h1 className="rescue-title">
            <FaPaw className="rescue-title-icon" /> Cứu hộ động vật
          </h1>
          <p className="rescue-intro">
            Đồng hành cùng cộng đồng bảo vệ, cứu hộ và trao cơ hội sống mới cho những động vật gặp nguy hiểm hoặc bị bỏ rơi. Hãy cùng PACP lan tỏa yêu thương!
          </p>
          <div className="rescue-action-btns">
            <Link to="/emergency-report" className="main-btn rescue-btn">
              <FaExclamationTriangle /> Báo cáo khẩn cấp
            </Link>
            <Link to="/donations" className="main-btn rescue-btn">
              <FaDonate /> Ủng hộ cứu hộ
            </Link>
            <Link to="/register-volunteer" className="main-btn rescue-btn">
              <FaUserPlus /> Đăng ký cộng tác viên
            </Link>
          </div>
        </div>
      </section>

      <section className="rescue-section rescue-process">
        <h2 className="rescue-section-title">Quy trình cứu hộ</h2>
        <div className="rescue-steps">
          <div className="rescue-step">
            <FaExclamationTriangle className="rescue-step-icon" />
            <span>Báo cáo khẩn cấp</span>
          </div>
          <div className="rescue-step">
            <FaPhoneAlt className="rescue-step-icon" />
            <span>Xác minh & tiếp nhận</span>
          </div>
          <div className="rescue-step">
            <FaHandsHelping className="rescue-step-icon" />
            <span>Tiếp cận & cứu hộ</span>
          </div>
          <div className="rescue-step">
            <FaPaw className="rescue-step-icon" />
            <span>Chăm sóc & phục hồi</span>
          </div>
          <div className="rescue-step">
            <FaMapMarkerAlt className="rescue-step-icon" />
            <span>Tìm chủ mới/trả về cộng đồng</span>
          </div>
        </div>
      </section>

      <section className="rescue-section">
        <h2 className="rescue-section-title">Trạm cứu hộ gần bạn</h2>
        <VendorMapSection />
      </section>

      <section className="rescue-section">
        <h2 className="rescue-section-title">Câu chuyện cứu hộ nổi bật</h2>
        <EmergencyStoryCarousel />
      </section>

      <section className="rescue-section rescue-faq">
        <h2 className="rescue-section-title">Câu hỏi thường gặp về cứu hộ</h2>
        <div className="faq-list">
          <div className="faq-item">
            <b>Khi nào nên báo cáo cứu hộ khẩn cấp?</b>
            <p>Khi bạn phát hiện động vật bị bỏ rơi, bị thương, bị bạo hành, hoặc gặp nguy hiểm trên đường phố, công viên, khu dân cư...</p>
          </div>
          <div className="faq-item">
            <b>Làm sao để báo cáo cứu hộ?</b>
            <p>Bạn chỉ cần nhấn nút <b>Báo cáo khẩn cấp</b> ở trên, điền thông tin và gửi. Đội cứu hộ sẽ liên hệ và xử lý nhanh nhất có thể.</p>
          </div>
          <div className="faq-item">
            <b>Tôi có thể trở thành cộng tác viên cứu hộ không?</b>
            <p>Hoàn toàn được! Chỉ cần nhấn <b>Đăng ký cộng tác viên</b>, điền thông tin và chờ xác nhận từ ban quản trị.</p>
          </div>
          <div className="faq-item">
            <b>Tôi muốn ủng hộ cho hoạt động cứu hộ?</b>
            <p>Bạn có thể quyên góp vật chất hoặc tài chính qua nút <b>Ủng hộ cứu hộ</b> ở đầu trang. Mọi sự đóng góp đều được công khai minh bạch.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
