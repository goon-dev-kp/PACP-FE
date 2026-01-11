import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import connection from "../utils/signalr.js";
import "../Style/EmergencyFeed.css";
import api from "../configs/axios";

// Thiết lập token Mapbox
const MAPBOX_TOKEN = "pk.eyJ1IjoidGVzdGNvZGVhcGkyNzExIiwiYSI6ImNtYjB6dG9wZjAxc2syd3B5Ym5rcW83YTIifQ.l72aVvo0Vxa5LyJNUU4Tkg";
mapboxgl.accessToken = MAPBOX_TOKEN;

// Component con hiển thị bản đồ và chức năng tìm đường
const EmergencyMap = ({ lng, lat, address }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const directions = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (!lng || !lat) return;

    // Xóa bản đồ cũ nếu tồn tại (an toàn)
    if (mapInstance.current) {
      try {
        if (directions.current) {
          mapInstance.current.removeControl(directions.current);
          directions.current = null;
        }
        mapInstance.current.remove();
      } catch (e) {
        // Có thể đã bị unmount, bỏ qua lỗi
        console.warn("Map cleanup warning:", e);
      }
      mapInstance.current = null;
    }

    // Khởi tạo bản đồ mới
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",

      center: [lng, lat],
      zoom: 14,
    });

    map.on('load', () => {
      if (!isMountedRef.current) return;
      new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat([lng, lat])
        .addTo(map);
      mapInstance.current = map;
      setMapReady(true);
    });

    return () => {
      isMountedRef.current = false;
      setMapReady(false);
      if (mapInstance.current) {
        try {
          if (directions.current) {
            mapInstance.current.removeControl(directions.current);
            directions.current = null;
          }
          mapInstance.current.remove();
        } catch (e) {
          // ignore
          console.warn("Map cleanup warning:", e);
        }
        mapInstance.current = null;
      }
    };
  }, [lng, lat]);

  const handleFindRoute = () => {
    if (!mapReady || !mapInstance.current) {
      alert("Bản đồ chưa sẵn sàng, vui lòng đợi...");
      return;
    }

    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLng = position.coords.longitude;
        const userLat = position.coords.latitude;

        // Xóa directions cũ nếu tồn tại
        if (directions.current) {
          mapInstance.current.removeControl(directions.current);
          directions.current = null;
        }

        // Khởi tạo directions mới
        const dirControl = new MapboxDirections({
          accessToken: MAPBOX_TOKEN,
          unit: "metric",
          profile: "mapbox/driving",
          controls: { inputs: false, instructions: true },
        });

        mapInstance.current.addControl(dirControl, "top-left");

        // Thiết lập điểm đi và đến
        dirControl.setOrigin([userLng, userLat]);
        dirControl.setDestination([lng, lat]);

        
        

        dirControl.on('route', (e) => {
  console.log("📦 Route received:", e.route);
});

directions.current = dirControl;

      },
      (error) => {
        alert("Không thể lấy vị trí hiện tại: " + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="emergency-map-container">
      <div ref={mapRef} className="emergency-map" />
      
      {mapReady ? (
        <button className="btn-find-route" onClick={handleFindRoute}>
          🗺️ Tìm đường từ vị trí của tôi
        </button>
      ) : (
        <div className="map-loading">Đang tải bản đồ...</div>
      )}
      <div className="map-address">{address}</div>
    </div>
  );
};

function EmergencyFeed() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⛔ Không có token, không kết nối SignalR");
      return;
    }

    if (connection.state === "Disconnected") {
      connection
        .start()
        .then(() => {
          console.log("✅ SignalR connected.");
          connection.on("ReceiveEmergencyReport", (report) => {
            console.log("📢 New emergency report:", report);
            setReports((prev) => [report, ...prev]);
          });
        })
        .catch((err) => {
          console.error("❌ SignalR error:", err);
          console.log("📡 Connection state:", connection.state);
        });
    }

    return () => {
      if (connection.state === "Connected") {
        connection.stop();
      }
    };
  }, []);

  const handleConfirm = async (index) => {
    const confirmedReport = reports[index];
    console.log("✅ Confirmed report:", confirmedReport);

    try {
      await api.post(`/EmergencyReport/accept/${confirmedReport.emergencyReportId}`);
      alert("✅ Đã xác nhận báo cáo!");
    } catch (err) {
      console.error("❌ Lỗi xác nhận:", err);
      alert("❌ Xác nhận thất bại.");
      return;
    }

    setReports((prev) => prev.filter((_, i) => i !== index));
  };

  if (reports.length === 0) return null;

  return (
    <div className="emergency-feed-overlay">
      <div className="emergency-feed-container">
        <h2 className="feed-title">🚨 Báo cáo khẩn cấp mới</h2>
        {reports.map((r, i) => (
          <div key={i} className="feed-card">
            <p><strong>📍 Địa chỉ:</strong> {r.address}</p>
            <p><strong>📝 Mô tả:</strong> {r.description}</p>
            <p><strong>📞 Liên hệ:</strong> {r.contactPhone}</p>
            <p><strong>🆘 Tình trạng:</strong> {r.healthStatus}</p>

            {/* Hiển thị media */}
            {r.imageUrls?.length > 0 && (
              <img src={r.imageUrls[0]} alt="Ảnh báo cáo" className="feed-image" />
            )}
            {r.videoUrls?.length > 0 && (
              <video controls src={r.videoUrls[0]} className="feed-video" />
            )}

            {/* Hiển thị bản đồ nếu có tọa độ */}
            {r.longitude && r.latitude && (
              <EmergencyMap 
                lng={r.longitude} 
                lat={r.latitude} 
                address={r.address} 
              />
            )}

            <div className="feed-actions">
              <button className="btn-confirm" onClick={() => handleConfirm(i)}>
                ✅ Xác nhận
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmergencyFeed;
