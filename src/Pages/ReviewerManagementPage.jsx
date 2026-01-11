import React, { useEffect, useState } from "react";
import "../Style/PetManagementPage.css";
import {
  FaInbox,
  FaPaw,
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaEye,
  FaTachometerAlt,
  FaDonate,
  FaStar,
} from "react-icons/fa";
import api from "../configs/axios";
import { Link } from "react-router-dom";

export default function ReviewerManagementPage() {
  const [reviews, setReviews] = useState([]);

useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await api.get("/Review/all");
      if (Array.isArray(res.data)) {
        setReviews(res.data);
      } else {
        console.warn("Dữ liệu đánh giá không đúng định dạng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };

  fetchReviews();
}, []);


  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá đánh giá này?");
    if (confirm) {
      try {
        const res = await api.delete(`/Review/${id}`);
        if (res.data.isSuccess) {
          setReviews(reviews.filter((r) => r.reviewId !== id));
        } else {
          alert("Xoá thất bại: " + res.data.message);
        }
      } catch (err) {
        console.error("Lỗi khi xoá:", err);
        alert("Lỗi máy chủ.");
      }
    }
  };

  return (
    <div className="management-page">
      <div className="sidebar">
        <h2>
          <FaStar /> Reviewer
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
          <li>
      <Link to="/manage-reviewer" className="sidebar-link">
        <FaStar /> Reviewer
      </Link>
    </li>
        </ul>
      </div>

      <div className="main-content">
        <h1 className="page-title">Danh sách đánh giá</h1>
        <table className="pet-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>User ID</th>
              <th>Nội dung</th>
              <th>Đánh giá (sao)</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="6">Không có đánh giá nào.</td>
              </tr>
            ) : (
              reviews.map((review, index) => (
                <tr key={review.reviewId}>
                  <td>{index + 1}</td>
                  <td>{review.userId}</td>
                  <td>{review.content}</td>
                  <td>{review.rating} ⭐</td>
                  <td>{new Date(review.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(review.reviewId)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
