import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/ThankYou.css";
import api from "../configs/axios";

const ThankYou = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Cảm ơn bạn!";
  }, []);

  const handleSubmitReview = async () => {
    if (!content.trim()) {
      alert("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Vui lòng chọn mức đánh giá hợp lệ (1-5 sao).");
      return;
    }

    try {
      const res = await api.post("/review/create", {
        content,
        rating,
      });
      if (res.data.isSuccess) {
        setSubmitted(true);
        alert("Cảm ơn bạn đã đánh giá!");
        // Chuyển về trang chủ sau 1.5s
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        alert("Không thể gửi đánh giá. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi gửi đánh giá:", error);
      alert("Đã xảy ra lỗi khi gửi đánh giá!");
    }
  };

  return (
    <div className="thank-you-container">
      <div className="card">
        <h1>🎉 Cảm ơn bạn rất nhiều!</h1>
        <p>Chúng tôi đã nhận được khoản quyên góp của bạn.</p>
        <p>Bạn đã góp phần mang đến một cuộc sống tốt đẹp hơn cho các bé thú cưng 🐾</p>

        {!submitted && (
          <div className="review-section">
            <h3>🎤 Hãy để lại đánh giá của bạn trước khi tiếp tục:</h3>
            <textarea
              placeholder="Cảm nghĩ của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <label>Đánh giá:</label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} sao
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleSubmitReview}>Gửi đánh giá</button>
            </div>
          </div>
        )}

        {submitted && (
          <p style={{ marginTop: "20px" }}>🙏 Cảm ơn bạn đã để lại đánh giá! Đang chuyển về trang chủ...</p>
        )}
      </div>
    </div>
  );
};

export default ThankYou;
