import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaEye } from "react-icons/fa";
import "../Style/DonationPage.css";
import api from "../configs/axios";

function DonationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await api.get(`/Donate/${id}`);
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = response.data;
        
        if (result.isSuccess) {
          // Sửa ở đây: dữ liệu thực tế nằm trong result.result
          setDonation(result.result);
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

    fetchDonation();
  }, [id]);

  const getStatusIcon = () => {
    // Xử lý trạng thái dạng số
    switch(donation.status) {
      case 1: // Hoàn thành
        return <FaCheckCircle className="status-icon completed" />;
      case 0: // Chờ thanh toán
        return <FaClock className="status-icon pending" />;
      default: // Thất bại hoặc trạng thái khác
        return <FaTimesCircle className="status-icon failed" />;
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (!donation) return <div className="error">Không tìm thấy thông tin quyên góp</div>;

  return (
    <div className="form-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <div className="main-content">
        <div className="detail-header">
          <h1 className="page-title">Chi tiết Quyên góp</h1>
          <div className="donation-id">ID: {donation.donationId}</div>
        </div>

        <div className="donation-detail-container">
          <div className="detail-section">
            <h2>Thông tin chung</h2>
            <div className="detail-item">
              <span className="detail-label">Trạng thái:</span>
              <span className={`detail-value status-${getStatusClass(donation.status)}`}>
                {getStatusIcon()} {getStatusText(donation.status)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Số tiền:</span>
              <span className="detail-value amount">{donation.amount.toLocaleString()} đ</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Thời gian:</span>
              <span className="detail-value">
                {new Date(donation.donatedAt).toLocaleString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phương thức:</span>
              <span className="detail-value">
                {donation.paymentMethod === 1 ? "PayPal" : "Khác"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Thông tin người dùng</h2>
            <div className="detail-item">
              <span className="detail-label">ID người dùng:</span>
              <span className="detail-value">{donation.donatedByUserId}</span>
            </div>
          </div>

          {donation.message && (
            <div className="detail-section">
              <h2>Lời nhắn</h2>
              <div className="message-box">{donation.message}</div>
            </div>
          )}

          <div className="detail-section">
            <h2>Thông tin mục tiêu</h2>
            <div className="detail-item">
              <span className="detail-label">ID mục tiêu:</span>
              <span className="detail-value">{donation.donationTargetId}</span>
            </div>
          </div>
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

export default DonationDetailPage;
