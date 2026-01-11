import React, { useEffect, useState } from "react";
import "../Style/PetManagementPage.css";
import { FaInbox, FaPaw, FaPlusCircle, FaEdit, FaTrash , FaEye, FaTachometerAlt, FaDonate, FaStar} from "react-icons/fa";

import api from "../configs/axios";
import { Link } from "react-router-dom"; // ✅ Thêm import này

export default function PetManagementPage() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get("/Pet/user");
        if (response.data.isSuccess) {
          setPets(response.data.result);
        } else {
          console.warn("Không tìm thấy thú cưng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thú cưng:", error);
      }
    };

    fetchPets();
  }, []);

  // const getStatusLabel = (status) => {
  //     switch (status) {
  //         case 'AVAILABLE': return 'Sẵn sàng';
  //         case 'ADOPTED': return 'Đã nhận nuôi';
  //         case 'LOST': return 'Bị thất lạc';
  //         case 'FOUND': return 'Đã tìm thấy';
  //         case 'IN_SHELTER': return 'Ở trại tạm trú';
  //         case 'DECEASED': return 'Đã qua đời';
  //         default: return 'Không rõ';
  //     }
  // };

  const handleEdit = (id) => {
    console.log("Edit pet with id:", id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá thú cưng này?");
    if (confirmDelete) {
      setPets(pets.filter((p) => p.id !== id));
    }
  };

  const handleStatusChange = async (petId, newStatus) => {
    try {
      const res = await api.put(`/Pet/status/${petId}?status=${newStatus}`);
      if (res.data.isSuccess) {
        alert("Cập nhật thành công!");
        // Cập nhật local state nếu cần
      } else {
        alert("Thất bại: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ.");
    }
  };

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
          <li>
      <Link to="/manage-reviewer" className="sidebar-link">
        <FaStar /> Reviewer
      </Link>
    </li>
        </ul>
      </div>
      <div className="main-content">
        <h1 className="page-title">Danh sách thú cưng</h1>
        <table className="pet-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Loại</th>
              <th>Giống</th>
              <th>Tuổi</th>
              <th>Tình trạng sức khỏe</th>
              <th>Trạng thái</th> {/* ✅ thêm cột mới */}
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pets.length === 0 ? (
              <tr>
                <td colSpan="8">Không có thú cưng nào.</td>
              </tr>
            ) : (
              pets.map((pet, index) => (
                <tr key={pet.id}>
                  <td>{index + 1}</td>
                  <td>{pet.name}</td>
                  <td>{pet.type}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.age}</td>
                  <td>{pet.healthStatus}</td>
                  <td>
                    <select
                      value={pet.status}
                      onChange={(e) =>
                        handleStatusChange(pet.id, e.target.value)
                      }
                      className={`status-select ${pet.status.toLowerCase()}`}
                    >
                      <option value="AVAILABLE">Sẵn sàng</option>
                      <option value="ADOPTED">Đã nhận nuôi</option>
                      <option value="LOST">Bị thất lạc</option>
                      <option value="FOUND">Đã tìm thấy</option>
                      <option value="IN_SHELTER">Ở trại tạm trú</option>
                      <option value="DECEASED">Đã qua đời</option>
                      <option value="PENDING">Đang chờ xử lý</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="action-button edit"
                      onClick={() => handleEdit(pet.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(pet.id)}
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
