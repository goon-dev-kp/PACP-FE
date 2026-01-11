// src/pages/PaymentError.jsx
import { useNavigate } from "react-router-dom";
import "../Style/PaymentError.css";

const PaymentError = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-card">
        <h1>❌ Thanh toán thất bại</h1>
        <p>Đã có lỗi xảy ra trong quá trình xử lý thanh toán với PayPal.</p>
        <p>Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
        <button onClick={() => navigate("/")}>Quay về trang chủ</button>
      </div>
    </div>
  );
};

export default PaymentError;
