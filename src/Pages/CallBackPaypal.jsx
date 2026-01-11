import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../configs/axios";
import "../Style/CallBackPaypal.css";

const CallBackPaypal = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("⏳ Đang xác nhận thanh toán từ PayPal...");
  const navigate = useNavigate();
  const isCalled = useRef(false); // 👈 Thêm flag

  useEffect(() => {
    if (isCalled.current) return;
    isCalled.current = true; // ✅ Đánh dấu đã gọi rồi

    const token = searchParams.get("token");
    if (!token) {
      setMessage("❌ Không tìm thấy mã token từ PayPal.");
      return;
    }

    const handleCallback = async () => {
      try {
        const res = await api.get(`/Donate/handle-paypal/${token}`);
        if (!res.data.isSuccess || !res.data.result?.donationId) {
          setMessage("❌ Xác thực PayPal thất bại.");
          setTimeout(() => navigate("/payment-error"), 3000);
          return;
        }

        const donationId = res.data.result.donationId;

        const callbackRes = await api.get(`/Donate/callback-paypal/${donationId}`);
        if (callbackRes.data.isSuccess) {
          setMessage("✅ Thanh toán thành công! Cảm ơn bạn đã quyên góp ❤️");
          setTimeout(() => navigate("/thank-you"), 3000);
        } else {
          setMessage("❌ Callback thất bại: " + callbackRes.data.message);
          
        }
      } catch (err) {
        console.error("🔥 Lỗi callback PayPal:", err);
        setMessage("❌ Lỗi hệ thống khi xác nhận thanh toán.");
       setTimeout(() => navigate("/payment-error"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="callback-container">
      <div className="message-card">
        <h2>{message}</h2>
        <p className="subtext">Vui lòng đợi trong giây lát...</p>
      </div>
    </div>
  );
};

export default CallBackPaypal;
