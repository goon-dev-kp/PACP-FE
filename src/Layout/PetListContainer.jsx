import React, { useEffect, useState  } from 'react';
import '../Style/ListPet/ListPet.css';
import { FaStar, FaDog, FaBirthdayCake, FaHeartbeat, FaVenusMars, FaDonate } from 'react-icons/fa';
import api from '../configs/axios';
import DefaultPetImage from '../assets/Dog-1.png';
import { useNavigate } from 'react-router-dom';


export default function PetListContainer() {
  const [petGroups, setPetGroups] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedPet, setSelectedPet] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Donate popup
  const [donatePet, setDonatePet] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [donationCreated, setDonationCreated] = useState(false);
const [qrUrl, setQrUrl] = useState('');
const navigate = useNavigate();



  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get('/Pet');
        if (res.data.isSuccess) {
          setPetGroups(res.data.result);
        }
      } catch (err) {
        console.error('Lỗi khi gọi API /Pet:', err);
      }
    };
    fetchPets();
  }, []);

  const handleAdoptClick = (pet) => {
    setSelectedPet(pet);
    setMessage('');
  };

  const handleSubmitAdoption = async () => {
    if (!selectedPet || !message.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await api.post('/AdoptionRequest/create-adoptionRequest', {
        petId: selectedPet.id,
        message: message.trim()
      });
      if (res.data.isSuccess) {
        alert('Gửi yêu cầu nhận nuôi thành công!');
        setSelectedPet(null);
        setMessage('');
      } else {
        alert('Gửi yêu cầu thất bại: ' + res.data.message);
      }
    } catch (err) {
       console.error(err);
      alert('Đã xảy ra lỗi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setSelectedPet(null);
    setMessage('');
  };

  // Donate
  const handleDonateClick = (pet) => {
    setDonatePet(pet);
    setDonationAmount('');
    setDonationMessage('');
  };

  const handleCloseDonatePopup = () => {
    setDonatePet(null);
    setDonationAmount('');
    setDonationMessage('');
  };

 const handleSubmitDonate = async () => {
  if (!donatePet || !donationAmount || isNaN(Number(donationAmount))) {
    alert('Vui lòng nhập số tiền hợp lệ!');
    return;
  }
  try {
const formData = new FormData();
formData.append('RecieveId', donatePet.id);
formData.append('Amount', donationAmount); // Không cần parseFloat, FormData chỉ truyền string
formData.append('Message', donationMessage.trim());

setIsDonating(true);
console.log('🧾 Gửi số tiền:', donationAmount);

const res = await api.post('/Donate/create-donation', formData);


    if (res.data.isSuccess && res.data.result) {
  setQrUrl(res.data.result);       // 👉 Gán QR code vào state
  setDonationCreated(true);        // 👉 Cho phép hiển thị popup QR
  setDonatePet(null);              // 🚨 Ẩn popup nhập số tiền luôn (optional)
}
 else {
      alert('Quyên góp thất bại: ' + res.data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Đã xảy ra lỗi!');
  } finally {
    setIsDonating(false);
  }
};


  const displayedGroups = petGroups.filter(group =>
    filter === 'all' || group.typeName.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="pet-container">
      <div className="pet-header">
        <h2 className="pet-type">Danh sách thú cưng</h2>
        <select
          className="pet-filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="Dog">Chó</option>
          <option value="Cat">Mèo</option>
          <option value="Khac">Khác</option>
        </select>
      </div>

      {displayedGroups.length === 0 ? (
        <p className="no-pets">Không có thú cưng phù hợp.</p>
      ) : (
        displayedGroups.map((group) => (
          <div key={group.typeName} className="pet-group">
            <h2 className="pet-type">{group.typeName}</h2>
            <div className="pet-card-wrapper">
              {group.listPet.map((pet) => (
                <div className="pet-card" key={pet.id}>
                  <div className="pet-image-container">
                    <img
                      src={pet.images?.[0]?.url || DefaultPetImage}
                      alt="pet"
                      className="pet-image"
                    />
                    <div className="pet-favorite-btn" title="Yêu thích">
                      <FaStar color="#FEBFD4" />
                    </div>
                  </div>
                  <h3 className="pet-name">{pet.name}</h3>
                  <div className="pet-info">
                    <div className="info-item">
                      <FaDog className="info-icon" /> <span>{pet.breed}</span>
                    </div>
                    <div className="info-item">
                      <FaBirthdayCake className="info-icon" /> <span>{pet.age}</span>
                    </div>
                    <div className="info-item">
                      <FaVenusMars className="info-icon" /> <span>{pet.gender}</span>
                    </div>
                    <div className="info-item">
                      <FaHeartbeat className="info-icon" /> <span>{pet.healthStatus}</span>
                    </div>
                  </div>
                  <button className="adopt-button" onClick={() => handleAdoptClick(pet)}>
                    Nhận nuôi
                  </button>
                  <button className="donate-button" onClick={() => handleDonateClick(pet)}>
                    <FaDonate className="donate-icon" /> Quyên góp
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Popup nhận nuôi */}
      {selectedPet && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Yêu cầu nhận nuôi</h2>
            <img
              src={selectedPet?.images?.[0]?.url || DefaultPetImage}
              alt="pet"
              className="popup-image"
            />
            <div className="popup-pet-info">
              <p><strong>Tên:</strong> {selectedPet.name}</p>
              <p><strong>Giống:</strong> {selectedPet.breed}</p>
              <p><strong>Tuổi:</strong> {selectedPet.age}</p>
              <p><strong>Giới tính:</strong> {selectedPet.gender}</p>
            </div>
            <textarea
              placeholder="Gửi lời nhắn đến người chủ hiện tại..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="popup-textarea"
            />
            <div className="popup-actions">
              <button onClick={handleClosePopup} className="popup-cancel">Hủy</button>
              <button onClick={handleSubmitAdoption} className="popup-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup quyên góp */}
      {donatePet && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Quyên góp cho thú cưng</h2>
            <img
              src={donatePet.images?.[0]?.url || DefaultPetImage}
              alt="pet"
              className="popup-image"
            />
            <div className="popup-pet-info">
              <p><strong>Tên:</strong> {donatePet.name}</p>
              <p><strong>Giống:</strong> {donatePet.breed}</p>
            </div>
            <input
              type="number"
              className="popup-textarea"
              placeholder="Số tiền quyên góp (VNĐ)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              style={{ height: '45px' }}
            />
            <textarea
              placeholder="Lời nhắn (không bắt buộc)..."
              value={donationMessage}
              onChange={(e) => setDonationMessage(e.target.value)}
              className="popup-textarea"
            />
            <div className="popup-actions">
              <button onClick={handleCloseDonatePopup} className="popup-cancel">
                Hủy
              </button>
              <button
                onClick={handleSubmitDonate}
                className="popup-submit"
                disabled={isDonating}
              >
                {isDonating ? 'Đang gửi...' : 'Gửi quyên góp'}
              </button>
            </div>
          </div>
        </div>
      )}
      {donationCreated && (
  <div className="popup-overlay">
    <div className="popup">
      <h2>Vui lòng quét mã QR để thanh toán</h2>
      <img src={qrUrl} alt="QR code thanh toán" style={{ maxWidth: "300px", margin: '20px auto' }} />
      <p>Sau khi bạn đã chuyển khoản, vui lòng nhấn nút bên dưới để xác nhận.</p>
      <div className="popup-actions">
        <button
          onClick={() => {
            setDonationCreated(false); // Ẩn popup
            navigate('/thank-you');
          }}
          className="popup-submit"
        >
          ✅ Tôi đã thanh toán
        </button>
        <button
          onClick={() => {
            setDonationCreated(false);
            setQrUrl('');
          }}
          className="popup-cancel"
        >
          ❌ Hủy
        </button>
      </div>
    </div>
  </div>
)}
{isDonating && (
  <div className="popup-overlay">
    <div className="popup">
      <p>Đang tạo mã QR thanh toán...</p>
    </div>
  </div>
)}


    </div>
  );
}
