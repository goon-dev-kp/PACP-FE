import React, { useEffect, useState } from 'react';
import { FaInbox, FaCheck, FaTimes, FaPaw, FaPlusCircle, FaEye, FaTachometerAlt, FaDonate, FaStar } from 'react-icons/fa';
import api from '../configs/axios';
import { Link } from 'react-router-dom';
import '../Style/PetManagementPage.css';

export default function RequestManagementPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/AdoptionRequest/get-adoptionRequests-by-processedByUserId');
                if (response.data.isSuccess) {
                    setRequests(response.data.result);
                } else {
                    console.warn('Không lấy được danh sách yêu cầu.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy yêu cầu:', error);
            }
        };
        fetchRequests();
    }, []);

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: 'Chờ duyệt',
            APPROVED: 'Đã duyệt',
            REJECTED: 'Từ chối',
            ADOPTED: 'Đã nhận nuôi',
            CANCELED: 'Đã huỷ',
        };
        const colorClass = status.toLowerCase();
        return <span className={`status-badge ${colorClass}`}>{statusMap[status] || status}</span>;
    };

    const handleApprove = async (id) => {
        try {
            const res = await api.post(`/AdoptionRequest/approve-adoptionRequest/${id}`);
            if (res.data.isSuccess) {
                alert("Đã duyệt yêu cầu.");
                updateStatus(id, 'APPROVED');
            }
        } catch {
            alert("Lỗi khi duyệt yêu cầu.");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await api.put(`/adoptionRequest/reject/${id}`);
            if (res.data.isSuccess) {
                alert("Đã từ chối yêu cầu.");
                updateStatus(id, 'REJECTED');
            }
        } catch {
            alert("Lỗi khi từ chối yêu cầu.");
        }
    };

    const updateStatus = (id, newStatus) => {
        setRequests(prev =>
            prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
    };

    return (
        <div className="management-page">
            <div className="sidebar">
                <h2><FaInbox /> Quản lý</h2>
                 <li>
                        <Link to="/dashboard" className="sidebar-link">
                            <FaTachometerAlt /> Dashboard
                        </Link>
                    </li>
                <ul>
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
                        <Link to="/manage-requests" className="sidebar-link">
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
                <h1 className="page-title">Yêu cầu nhận nuôi</h1>
                <table className="pet-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Người gửi</th>
                            <th>Thú cưng</th>
                            <th>Tin nhắn</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><td colSpan="6">Không có yêu cầu nào.</td></tr>
                        ) : (
                            requests.map((req, index) => (
                                <tr key={req.id}>
                                    <td>{index + 1}</td>
                                    <td>{req.requesterName || 'Ẩn danh'}</td>
                                    <td>{req.petName || 'Không rõ'}</td>
                                    <td>{req.message || 'Không có'}</td>
                                    <td>{getStatusBadge(req.status)}</td>
                                    <td>
                                        {req.status === 'PENDING' ? (
                                            <>
                                                <button className="action-button edit" onClick={() => handleApprove(req.id)}>
                                                    <FaCheck />
                                                </button>
                                                <button className="action-button delete" onClick={() => handleReject(req.id)}>
                                                    <FaTimes />
                                                </button>
                                            </>
                                        ) : (
                                            <span>—</span>
                                        )}
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
