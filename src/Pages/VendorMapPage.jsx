import React, { useState, useEffect } from 'react';
import Map from 'react-map-gl';
import { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import api from '../configs/axios';
import { FaMapMarkerAlt, FaPhone, FaBuilding, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import '../Style/VendorMapPage.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVzdGNvZGVhcGkyNzExIiwiYSI6ImNtYjB6dG9wZjAxc2syd3B5Ym5rcW83YTIifQ.l72aVvo0Vxa5LyJNUU4Tkg';

const VendorMapPage = () => {
  const [geocodedVendors, setGeocodedVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 10.8231,
    longitude: 106.6297,
    zoom: 12,
    width: '100%',
    height: '100%'
  });
  const [loading, setLoading] = useState(true);
  const [geocodingProgress, setGeocodingProgress] = useState(0);

  // Hàm geocode địa chỉ sang tọa độ
  const geocodeAddress = async (address) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;
      const params = {
        access_token: MAPBOX_TOKEN,
        limit: 1,
        country: 'VN'
      };
      
      const response = await fetch(`${url}?${new URLSearchParams(params)}`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Xử lý geocoding cho tất cả vendors
  const processGeocoding = async (vendorsList) => {
    const results = [];
    let processed = 0;
    const total = vendorsList.length;
    
    for (const vendor of vendorsList) {
      if (vendor.address) {
        const coords = await geocodeAddress(vendor.address);
        if (coords) {
          results.push({ ...vendor, ...coords });
        }
      }
      processed++;
      setGeocodingProgress(Math.round((processed / total) * 100));
    }
    
    return results;
  };

  // Lấy danh sách vendors và xử lý geocoding
  useEffect(() => {
    const fetchAndProcessVendors = async () => {
      try {
        const response = await api.get('/User/vendors');
        if (response.data.isSuccess && response.data.result.length > 0) {
          // Lọc vendor có địa chỉ
          const validVendors = response.data.result.filter(v => 
            v.bussinessName && v.address
          );
          
          // Xử lý geocoding
          const geocoded = await processGeocoding(validVendors);
          setGeocodedVendors(geocoded);
          
          // Cập nhật viewport nếu có kết quả
          if (geocoded.length > 0) {
            setViewport(v => ({
              ...v,
              latitude: geocoded[0].latitude,
              longitude: geocoded[0].longitude
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessVendors();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner-icon" />
        <p>Đang tải dữ liệu trạm cứu hộ...</p>
        {geocodingProgress > 0 && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${geocodingProgress}%` }}>
              {geocodingProgress}%
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="vendor-map-container">
      <div className="header-section">
        <h1 className="page-title">
          <FaBuilding className="title-icon" /> Bản đồ trạm cứu hộ
        </h1>
        <p className="page-subtitle">
          Tìm kiếm các trạm cứu hộ thú cưng gần bạn
        </p>
      </div>

      <div className="map-wrapper">
        <Map
          {...viewport}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={setViewport}
        >
          <NavigationControl position="top-right" />

          {geocodedVendors.map((vendor) => (
            <Marker
              key={vendor.userId}
              latitude={vendor.latitude}
              longitude={vendor.longitude}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div 
                className="marker" 
                onClick={() => setSelectedVendor(vendor)}
                role="button"
                tabIndex={0}
                aria-label={`Xem thông tin ${vendor.bussinessName}`}
              >
                <FaMapMarkerAlt className="marker-icon" />
              </div>
            </Marker>
          ))}

          {selectedVendor && (
            <Popup
              latitude={selectedVendor.latitude}
              longitude={selectedVendor.longitude}
              onClose={() => setSelectedVendor(null)}
              closeButton={true}
              closeOnClick={false}
              anchor="bottom"
            >
              <div className="vendor-popup">
                <h3 className="vendor-name">
                  <FaBuilding className="icon" /> {selectedVendor.bussinessName}
                </h3>
                
                {selectedVendor.phoneNumber && (
                  <p className="vendor-info">
                    <FaPhone className="icon" /> {selectedVendor.phoneNumber}
                  </p>
                )}
                
                <p className="vendor-info">
                  <FaMapMarkerAlt className="icon" /> {selectedVendor.address}
                </p>
                
                {selectedVendor.bussinessNumber && (
                  <p className="vendor-info">
                    <FaInfoCircle className="icon" /> Mã số: {selectedVendor.bussinessNumber}
                  </p>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {geocodedVendors.length > 0 ? (
        <div className="vendor-list">
          <h2 className="list-title">Danh sách trạm cứu hộ</h2>
          <div className="vendor-cards">
            {geocodedVendors.map(vendor => (
              <div 
                key={vendor.userId} 
                className="vendor-card"
                onClick={() => {
                  setSelectedVendor(vendor);
                  setViewport(v => ({
                    ...v,
                    latitude: vendor.latitude,
                    longitude: vendor.longitude,
                    zoom: 14
                  }));
                }}
                role="button"
                tabIndex={0}
                aria-label={`Xem vị trí ${vendor.bussinessName}`}
              >
                <h3 className="card-title">{vendor.bussinessName}</h3>
                <p className="card-address">{vendor.address}</p>
                {vendor.phoneNumber && (
                  <p className="card-phone">{vendor.phoneNumber}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-vendors-message">
          <p>Không tìm thấy trạm cứu hộ nào có địa chỉ hợp lệ.</p>
        </div>
      )}
    </div>
  );
};

export default VendorMapPage;
