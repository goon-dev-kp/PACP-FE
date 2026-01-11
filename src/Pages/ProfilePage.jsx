import React, { useEffect, useState } from "react";
import {
  FaUserCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaBirthdayCake, FaBuilding, FaEdit, FaSignOutAlt
} from "react-icons/fa";
import "../Style/ProfilePage.css";
import api from "../configs/axios";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const navigate = useNavigate();

  const banks = [
    { name: "Vietcombank", logo: "/banks/vietcombank.png" },
    { name: "Techcombank", logo: "/banks/techcombank.png" },
    { name: "BIDV", logo: "/banks/bidv.png" },
    { name: "MB Bank", logo: "/banks/mbbank.png" },
    { name: "Agribank", logo: "/banks/agribank.png" },
  ];

  useEffect(() => {
    try {
      api.get(`/User/profile`).then(res => {
        if (res.data.isSuccess) setUser(res.data.result);
      });

      api.get(`/wallet/profile`).then(res => {
        if (res.data.isSuccess) setWallet(res.data.result);
      });
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleEdit = () => {
    navigate("/profile/edit");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateWallet = async () => {
    try {
      const res = await api.post("/wallet/create", {
        bankAccountNumber,
        bankName: selectedBank
      });
      if (res.data.isSuccess) {
        setWallet(res.data.data);
        setShowCreatePopup(false);
      } else {
        alert(res.data.message || "Tạo ví thất bại");
      }
    } catch (err) {
      console.log(err);
      alert("Có lỗi xảy ra khi tạo ví.");
    }
  };
  const [withdrawAmount, setWithdrawAmount] = useState("");
const [isWithdrawing, setIsWithdrawing] = useState(false);

const handleWithdraw = async () => {
  if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
    alert("Vui lòng nhập số tiền hợp lệ.");
    return;
  }

  try {
    setIsWithdrawing(true);
    const res = await api.post("/wallet/withdraw", parseFloat(withdrawAmount));
    if (res.data.isSuccess) {
      alert("Rút tiền thành công!");
      setWallet(res.data.result); // cập nhật lại số dư mới
      setWithdrawAmount("");
    } else {
      alert(res.data.message || "Rút tiền thất bại.");
    }
  } catch (err) {
    console.error(err);
    alert("Đã xảy ra lỗi khi rút tiền.");
  } finally {
    setIsWithdrawing(false);
  }
};


  if (!user) {
    return <div className="profile-loading">Đang tải thông tin cá nhân...</div>;
  }

  return (
    <div className="profile-bg">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" />
            ) : (
              <FaUserCircle size={96} color="#6b3fa0" />
            )}
          </div>
          <div className="profile-info-main">
            <h1 className="profile-name">{user.userName}</h1>
            <div className="profile-role">
              {user.role === "VENDOR" ? (
                <span className="profile-role-vendor">Tổ chức cứu hộ</span>
              ) : (
                <span className="profile-role-user">Người dùng</span>
              )}
            </div>
            <div className="profile-actions">
              <button className="profile-edit-btn" onClick={handleEdit}>
                <FaEdit /> Chỉnh sửa
              </button>
              <button className="profile-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail-item">
            <FaEnvelope className="profile-detail-icon" />
            <span>{user.email}</span>
          </div>
          <div className="profile-detail-item">
            <FaPhoneAlt className="profile-detail-icon" />
            <span>{user.phoneNumber || "Chưa cập nhật"}</span>
          </div>
          <div className="profile-detail-item">
            <FaMapMarkerAlt className="profile-detail-icon" />
            <span>{user.address || "Chưa cập nhật"}</span>
          </div>
          <div className="profile-detail-item">
            <FaBirthdayCake className="profile-detail-icon" />
            <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Chưa cập nhật"}</span>
          </div>

          {user.role === "VENDOR" && (
            <>
              <div className="profile-detail-item">
                <FaBuilding className="profile-detail-icon" />
                <span><b>Tên tổ chức:</b> {user.bussinessName}</span>
              </div>
              <div className="profile-detail-item">
                <FaBuilding className="profile-detail-icon" />
                <span><b>Mã số tổ chức:</b> {user.bussinessNumber}</span>
              </div>
            </>
          )}
        </div>

        <div className="wallet-section">
          <h2>Ví điện tử</h2>
          {wallet ? (
            <div className="wallet-info">
              <p><strong>Ngân hàng:</strong> {wallet.bankName}</p>
              <p><strong>Số tài khoản:</strong> {wallet.bankAccountNumber}</p>
              <p><strong>Số dư:</strong> {wallet.balance.toLocaleString()} VND</p>
              <div className="withdraw-section">
  <input
    type="number"
    value={withdrawAmount}
    onChange={(e) => setWithdrawAmount(e.target.value)}
    placeholder="Nhập số tiền muốn rút"
    min="0"
  />
  <button
    className="btn-withdraw"
    onClick={handleWithdraw}
    disabled={isWithdrawing}
  >
    {isWithdrawing ? "Đang xử lý..." : "Rút tiền"}
  </button>
</div>
            </div>
          ) : (
            <button className="btn-create-wallet" onClick={() => setShowCreatePopup(true)}>
              + Tạo ví
            </button>
          )}
        </div>

        {showCreatePopup && (
          <div className="wallet-popup">
            <div className="wallet-popup-content">
              <h3>Tạo ví mới</h3>

              <label>Số tài khoản</label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="Nhập số tài khoản"
              />

              <label>Chọn ngân hàng</label>
              <div className="bank-list">
                {banks.map((bank) => (
                  <div
                    key={bank.name}
                    className={`bank-item ${selectedBank === bank.name ? "selected" : ""}`}
                    onClick={() => setSelectedBank(bank.name)}
                  >
                    {/* <img src={bank.logo} alt={bank.name} width="40" /> */}
                    <span>{bank.name}</span>
                  </div>
                ))}
              </div>

              <div className="wallet-popup-actions">
                <button onClick={handleCreateWallet}>Tạo ví</button>
                <button onClick={() => setShowCreatePopup(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
