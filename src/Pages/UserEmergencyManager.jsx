import React, { useEffect, useState } from 'react';
import api from '../configs/axios';
import '../Style/UserEmergencyManager.css';
import Sidebar from '../Components/Sidebar';
import { FaInbox, FaPaw, FaPlusCircle, FaEye, FaTachometerAlt, FaDonate , FaStar} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserEmergencyManager = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const [media, setMedia] = useState(null); // media = { type: 'image' | 'video', url: '...' }

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/EmergencyReport/by-user');
                if (res.data.isSuccess) {
                    setReports(res.data.result);
                } else {
                    setError(res.data.message || 'Không thể tải dữ liệu');
                }
            } catch (error) {
    console.error(error);
    setError('Lỗi server hoặc kết nối mạng');
}

        };
        fetchReports();
    }, []);

    const openMedia = (type, url) => {
        setMedia({ type, url });
    };

    const closeMedia = () => {
        setMedia(null);
    };

    const markAsCompleted = async (reportId) => {
  if (!window.confirm('Bạn có chắc muốn đánh dấu báo cáo này là HOÀN THÀNH?')) return;

  try {
    const res = await api.post(`/EmergencyReport/finish/${reportId}`);
    if (res.data.isSuccess) {
      setReports((prev) =>
        prev.map((r) =>
          r.emergencyReportId === reportId ? { ...r, status: 'COMPLETED' } : r
        )
      );
    } else {
      alert(res.data.message || 'Không thể cập nhật trạng thái.');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi kết nối hoặc máy chủ.');
  }
};


    if (error) return <div className="uem-error">{error}</div>;
    if (!reports.length) return <div className="uem-empty">Không có báo cáo nào.</div>;

    return (
        <div className="uem-container">
            <div className="sidebar">
                <h2><FaPaw /> Quản lý</h2>
                <ul>
                     <li>
        <Link to="/dashboard" className="sidebar-link">
            <FaTachometerAlt /> Dashboard
        </Link>
    </li>
                    <li>
                        <Link to="/manage-pet" className="sidebar-link"><FaPaw /> Thú cưng</Link>
                    </li>
                    <li>
                        <Link to="/create-pet" className="sidebar-link"><FaPlusCircle /> Thêm mới</Link>
                    </li>
                    <li>
                        <Link to="/manage-request" className="sidebar-link"><FaInbox /> Yêu cầu nhận nuôi</Link>
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

            <div className="uem-main">
                <h2 className="uem-title">📢 Quản lý báo cáo khẩn cấp</h2>

                <table className="uem-table">
                    <thead>
                        <tr>
                            <th>📍 Địa chỉ</th>
                            <th>📝 Mô tả</th>
                            <th>🚑 Tình trạng</th>
                            <th>📞 Liên hệ</th>
                            <th>🕒 Gửi lúc</th>
                            <th>🖼 Media</th>
                            <th>📌 Trạng thái</th>
                            <th>⚙️ Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.emergencyReportId}>
                                <td>{report.address}</td>
                                <td>{report.description}</td>
                                <td>{report.healthStatus}</td>
                                <td>{report.contactPhone}</td>
                                <td>{new Date(report.createdAt).toLocaleString()}</td>
                                <td>
                                    {report.imageUrls.length > 0 && (
                                        <button onClick={() => openMedia('image', report.imageUrls[0])}>
                                            <FaEye style={{ marginRight: '6px' }} />
                                            Xem hình
                                        </button>
                                    )}
                                    {report.videoUrls.length > 0 && (
                                        <button onClick={() => openMedia('video', report.videoUrls[0])}>
                                            <FaEye style={{ marginRight: '6px' }} />
                                            Xem video
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {report.status === 'IN_PROGRESS' ? '⏳ Đang xử lý' : '✅ Đã hoàn thành'}
                                </td>
                                <td>
                                    {report.status === 'IN_PROGRESS' && (
                                        <button onClick={() => markAsCompleted(report.emergencyReportId)}>
                                            Hoàn thành
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {media && (
                    <div className="uem-overlay" onClick={closeMedia}>
                        <div className="uem-overlay-content" onClick={e => e.stopPropagation()}>
                            <button className="uem-close-btn" onClick={closeMedia}>❌</button>
                            {media.type === 'image' ? (
                                <img src={media.url} alt="Emergency" className="uem-overlay-media" />
                            ) : (
                                <video src={media.url} controls className="uem-overlay-media" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserEmergencyManager;
