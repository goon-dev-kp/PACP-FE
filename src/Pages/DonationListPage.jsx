import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye,  FaInbox, FaPaw, FaPlusCircle, FaDonate ,  FaTachometerAlt} from "react-icons/fa";

import "../Style/DonationPage.css";
import api from "../configs/axios";

function DonationListPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Gọi API để lấy danh sách quyên góp
        const response = await api.get("/Donate");
        
        // Kiểm tra nếu response không thành công
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = response.data;
        
        // Kiểm tra cờ isSuccess trong response
        if (result.isSuccess) {
          // Sử dụng result.result (mảng dữ liệu thực tế)
          setDonations(result.result);
        } else {
          throw new Error(result.message || "Lỗi không xác định");
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="management-page">
      <div className="sidebar">
        <h2>
          <FaPaw /> Quản lý
        </h2>
        <ul>
           <li>
                                  <Link to="/dashboard" className="sidebar-link">
                                      <FaTachometerAlt /> Dashboard
                                  </Link>
                              </li>
          <li>
            <Link to="/manage-pet" className="sidebar-link">
              <FaPaw /> Thú cưng
            </Link>
          </li>
          <li>
            <Link to="/create-pet" className="sidebar-link">
              <FaPlusCircle /> Thêm mới
            </Link>
          </li>
          <li>
            <Link to="/manage-request" className="sidebar-link">
              <FaInbox /> Yêu cầu nhận nuôi
            </Link>
          </li>
          <li>
            <Link to="/manage-emergency" className="sidebar-link">
              <FaEye /> Báo cáo khẩn cấp
            </Link>
          </li>
          <li>
    <Link to="/manage-donate" className="sidebar-link">
      <FaDonate /> Quyên góp
    </Link>
  </li>
        </ul>
      </div>

      <div className="main-content">
        <h1 className="page-title">Quản lý Quyên góp</h1>

        <div className="donation-list-container">
          <div className="donation-header">
            <div className="header-cell">ID</div>
            <div className="header-cell">Người quyên góp</div>
            <div className="header-cell">Số tiền</div>
            <div className="header-cell">Thời gian</div>
            <div className="header-cell">Trạng thái</div>
            <div className="header-cell">Hành động</div>
          </div>

          {donations.map((donation) => (
            <div key={donation.donationId} className="donation-row">
              <div className="donation-cell">{donation.donationId.substring(0, 8)}...</div>
              <div className="donation-cell">{donation.donatedByUserId.substring(0, 8)}...</div>
              <div className="donation-cell">{donation.amount.toLocaleString()} đ</div>
              <div className="donation-cell">
                {new Date(donation.donatedAt).toLocaleDateString()}
              </div>
              <div className="donation-cell">
                <span className={`status-${getStatusClass(donation.status)}`}>
                  {getStatusText(donation.status)}
                </span>
              </div>
              <div className="donation-cell">
                <Link 
                  to={`/donations/${donation.donationId}`} 
                  className="detail-btn"
                >
                  <FaEye /> Chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hàm chuyển đổi trạng thái số sang văn bản
function getStatusText(status) {
  switch(status) {
    case 1: return "Hoàn thành";
    case 0: return "Chờ thanh toán";
    default: return "Không xác định";
  }
}

// Hàm chuyển đổi trạng thái số sang tên class
function getStatusClass(status) {
  switch(status) {
    case 1: return "completed";
    case 0: return "waiting_for_payment";
    default: return "unknown";
  }
}

export default DonationListPage;
