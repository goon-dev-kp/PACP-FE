import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../Style/EmergencyForm.css";
import api from "../configs/axios";

const MAPBOX_TOKEN = "pk.eyJ1IjoidGVzdGNvZGVhcGkyNzExIiwiYSI6ImNtYjB6dG9wZjAxc2syd3B5Ym5rcW83YTIifQ.l72aVvo0Vxa5LyJNUU4Tkg";
mapboxgl.accessToken = MAPBOX_TOKEN;

const EmergencyReportPopup = () => {
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    senderName: "",
    contactPhone: "",
    address: "",
    description: "",
    healthStatus: "",
    images: [],
    imagePreviews: [],
    videos: [],
    latitude: null,
    longitude: null,
  });

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Khởi tạo hoặc cập nhật map khi có tọa độ
  useEffect(() => {
    if (showEmergencyForm && formData.latitude && formData.longitude && mapContainerRef.current) {
      if (!mapRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [formData.longitude, formData.latitude],
          zoom: 14,
        });

        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([formData.longitude, formData.latitude])
          .addTo(mapRef.current);

        markerRef.current.on("dragend", async () => {
          const { lng, lat } = markerRef.current.getLngLat();
          await updateAddressFromCoordinates(lng, lat);
        });

        mapRef.current.on("click", async (e) => {
          const { lng, lat } = e.lngLat;
          markerRef.current.setLngLat([lng, lat]);
          await updateAddressFromCoordinates(lng, lat);
        });
      } else {
        markerRef.current.setLngLat([formData.longitude, formData.latitude]);
        mapRef.current.flyTo({ center: [formData.longitude, formData.latitude] });
      }
    }
  }, [showEmergencyForm, formData.latitude, formData.longitude]);

  // Xoá map khi đóng form
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [showEmergencyForm]);

  // Hàm cập nhật địa chỉ từ tọa độ
  const updateAddressFromCoordinates = async (lng, lat) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      const address = data.features[0]?.place_name || "";
      setFormData((prev) => ({
        ...prev,
        address,
        longitude: lng,
        latitude: lat,
      }));
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  };

  // Xử lý autocomplete địa chỉ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "address" && value.length > 2) {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddressSuggestions(data.features || []);
        });
    } else if (name === "address") {
      setAddressSuggestions([]);
    }
  };

  // Chọn địa chỉ từ gợi ý
  const handleSelectSuggestion = (suggestion) => {
    const [lng, lat] = suggestion.geometry.coordinates;
    setFormData((prev) => ({
      ...prev,
      address: suggestion.place_name,
      latitude: lat,
      longitude: lng,
    }));
    setAddressSuggestions([]);

    if (markerRef.current && mapRef.current) {
      markerRef.current.setLngLat([lng, lat]);
      mapRef.current.flyTo({ center: [lng, lat] });
    }
  };

  // Lấy vị trí GPS
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`
          );
          const data = await res.json();
          const place = data.features?.[0]?.place_name || "";
          setFormData((prev) => ({
            ...prev,
            address: place,
            latitude: lat,
            longitude: lon,
          }));

          if (markerRef.current && mapRef.current) {
            markerRef.current.setLngLat([lon, lat]);
            mapRef.current.flyTo({ center: [lon, lat] });
          }
          alert("📍 Đã lấy vị trí và địa chỉ!");
        } catch (err) {
          console.error("Không thể lấy địa chỉ:", err);
          alert("❌ Lỗi khi lấy địa chỉ từ tọa độ");
        }
      },
      (error) => {
        let errorMessage = "❌ Không thể lấy vị trí";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối quyền truy cập vị trí";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Thông tin vị trí không khả dụng";
            break;
          case error.TIMEOUT:
            errorMessage = "Yêu cầu vị trí đã hết thời gian";
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Xử lý ảnh/video
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...previews],
    }));
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, ...files],
    }));
  };

  // Gửi báo cáo
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("SenderName", formData.senderName);
    form.append("ContactPhone", formData.contactPhone);
    form.append("Address", formData.address);
    form.append("Description", formData.description);
    form.append("HealthStatus", formData.healthStatus);
    if (formData.latitude && formData.longitude) {
      form.append("Latitude", formData.latitude);
      form.append("Longitude", formData.longitude);
    }
    formData.images.forEach((image) => {
      form.append("ImageFiles", image);
    });
    formData.videos.forEach((video) => {
      form.append("VideoUrls", video);
    });

    try {
      await api.post("/EmergencyReport/create-with-files", form);
      alert("✅ Gửi báo cáo thành công!");
      setShowEmergencyForm(false);
      setFormData({
        senderName: "",
        contactPhone: "",
        address: "",
        description: "",
        healthStatus: "",
        images: [],
        videos: [],
        imagePreviews: [],
        latitude: null,
        longitude: null,
      });
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ Gửi thất bại.");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowEmergencyForm(true)}
        className="emergency-button-trigger"
      >
        🚨 KHẨN CẤP
      </button>

      {showEmergencyForm && (
        <div className="emergency-overlay">
          <form className="emergency-modal" onSubmit={handleSubmit}>
            <h2 className="emergency-title">Tạo báo cáo khẩn cấp</h2>

            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Họ tên người gửi"
              className="emergency-input"
              required
            />

            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="Số điện thoại liên hệ"
              className="emergency-input"
            />

            <div className="address-autocomplete-wrapper">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Địa chỉ"
                className="emergency-input"
              />
              {addressSuggestions.length > 0 && (
                <ul className="address-suggestions">
                  {addressSuggestions.map((sug, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(sug)}
                      className="address-suggestion-item"
                    >
                      {sug.place_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả tình huống"
              className="emergency-textarea"
              rows={3}
            />

            <select
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              className="emergency-input"
            >
              <option value="">Tình trạng sức khỏe</option>
              <option value="Ổn định">Ổn định</option>
              <option value="Bị thương nhẹ">Bị thương nhẹ</option>
              <option value="Bị thương nặng">Bị thương nặng</option>
              <option value="Nguy kịch">Nguy kịch</option>
            </select>

            <label htmlFor="image-upload" className="custom-file-upload">
              📷 Chọn ảnh
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

            {formData.imagePreviews.length > 0 && (
              <div className="image-preview-list">
                {formData.imagePreviews.map((preview, idx) => (
                  <img
                    key={idx}
                    src={preview}
                    alt={`Ảnh ${idx}`}
                    className="image-preview"
                  />
                ))}
              </div>
            )}

            <label htmlFor="video-upload" className="custom-file-upload">
              🎥 Chọn video
            </label>
            <input
              id="video-upload"
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
            />

            {formData.videos.length > 0 && (
              <div className="video-preview-list">
                {formData.videos.map((video, idx) => (
                  <video
                    key={idx}
                    src={URL.createObjectURL(video)}
                    controls
                    className="video-preview"
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={requestLocation}
              className="emergency-button gps"
            >
              📍 Lấy vị trí hiện tại
            </button>

            <div
              ref={mapContainerRef}
              id="map-container"
              className="map-container"
              style={{ height: "200px", marginTop: "10px" }}
            />

            <div className="emergency-actions">
              <button
                type="button"
                onClick={() => setShowEmergencyForm(false)}
                className="emergency-button cancel"
              >
                Hủy
              </button>
              <button type="submit" className="emergency-button send">
                Gửi
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowEmergencyForm(false)}
              className="emergency-close"
            >
              ×
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EmergencyReportPopup;
