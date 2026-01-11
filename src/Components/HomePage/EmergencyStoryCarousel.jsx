import React, { useState, useEffect } from 'react';
import { FaVideo, FaImage, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../../Style/EmergencyStoryCarousel.css';
import api from '../../configs/axios';

const EmergencyStoryCarousel = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [activeMedia, setActiveMedia] = useState({});
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const response = await api.get('/EmergencyReport/all');
        const mapped = response.data.map((r, i) => ({
          id: r.emergencyReportId,
          avatar: `https://randomuser.me/api/portraits/lego/${i % 10}.jpg`,
          address: r.address,
          videoUrl: r.videoUrls?.[0] || '',
          imageUrl: r.imageUrls?.[0] || '',
          description: r.description,
          status: r.status || 'IN_PROGRESS',
        }));
        
        // Khởi tạo media mặc định
        const initialMedia = {};
        mapped.forEach(item => {
          initialMedia[item.id] = item.videoUrl ? 'video' : 'image';
        });
        setActiveMedia(initialMedia);
        setEmergencies(mapped);
      } catch (err) {
        console.error('❌ Lỗi lấy báo cáo:', err);
      }
    };

    fetchEmergencies();
  }, []);

  const totalPages = Math.ceil(emergencies.length / itemsPerPage);
  const handleNext = () => setPageIndex(prev => (prev + 1) % totalPages);
  const handlePrev = () => setPageIndex(prev => (prev - 1 + totalPages) % totalPages);
  
  const handleMediaChange = (id, mediaType) => {
    setActiveMedia(prev => ({ ...prev, [id]: mediaType }));
  };

  const currentStories = emergencies.slice(
    pageIndex * itemsPerPage,
    pageIndex * itemsPerPage + itemsPerPage
  );

  return (
    <div className="story-carousel-container">
      <h2 className="section-title">Câu chuyện cứu hộ khẩn cấp</h2>
      
      <div className="story-navigation-wrapper">
        <button className="nav-button left" onClick={handlePrev}>
          <FaArrowLeft />
        </button>

        <div className="story-carousel-wrapper">
          {currentStories.map((item) => (
            <div key={item.id} className="story-card">
              <div className="card-header">
                <img src={item.avatar} alt="avatar" className="avatar" />
                <div className="address">{item.address}</div>
              </div>

              <div className="story-media-container">
                {activeMedia[item.id] === 'video' && item.videoUrl ? (
                  <video 
                    src={item.videoUrl} 
                    controls 
                    className="story-media"
                  />
                ) : item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt="emergency" 
                    className="story-media"
                  />
                ) : (
                  <div className="media-placeholder">
                    <FaImage className="placeholder-icon" />
                  </div>
                )}
                
                <div className="media-toggle">
                  {item.videoUrl && (
                    <button 
                      className={`toggle-btn ${activeMedia[item.id] === 'video' ? 'active' : ''}`}
                      onClick={() => handleMediaChange(item.id, 'video')}
                    >
                      <FaVideo />
                    </button>
                  )}
                  {item.imageUrl && (
                    <button 
                      className={`toggle-btn ${activeMedia[item.id] === 'image' ? 'active' : ''}`}
                      onClick={() => handleMediaChange(item.id, 'image')}
                    >
                      <FaImage />
                    </button>
                  )}
                </div>
              </div>

              <div className="story-description">{item.description}</div>

              <div className={`story-status ${item.status.trim().toUpperCase() === 'COMPLETED' ? 'resolved' : 'waiting'}`}>
                {item.status.trim().toUpperCase() === 'COMPLETED' 
                  ? '✅ Đã hoàn thành' 
                  : '⏳ Đang xử lý'}
              </div>
            </div>
          ))}
        </div>

        <button className="nav-button right" onClick={handleNext}>
          <FaArrowRight />
        </button>
      </div>

      <div className="story-dots">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={`dot ${i === pageIndex ? 'active' : ''}`}
            onClick={() => setPageIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmergencyStoryCarousel;
