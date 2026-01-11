import React from 'react';
import '../../Style/HomePage/MapSection.css';

const MapSection = () => {
  return (
    <div className="map-section">
      <h2 className="map-title">Bản đồ các tổ chức cứu hộ</h2>
      <div className="map-container">
        <iframe
          className="map-embed"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.216227661708!2d106.67998317590428!3d10.79454538935569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528dca4c85d1b%3A0xb4db6f6d8763b4cb!2zR29vZ2xlIFZpZXcgU29mZXR3YXJl!5e0!3m2!1sen!2s!4v1718012345678!5m2!1sen!2s"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        />
      </div>
    </div>
  );
};

export default MapSection;
