// 📁 components/Sidebar.jsx (hoặc nhúng trong cùng file)
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaPlusCircle, FaInbox, FaExclamationTriangle } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2><FaPaw /> Quản lý</h2>
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
          <Link to="/manage-request" className="sidebar-link">
            <FaInbox /> Yêu cầu nhận nuôi
          </Link>
        </li>
        <li>
          <Link to="/manage-emergency" className="sidebar-link">
            <FaExclamationTriangle /> Báo cáo khẩn cấp
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
