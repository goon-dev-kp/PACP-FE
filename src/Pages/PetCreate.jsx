import React, {useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


import {FaArrowLeft , FaHeart, FaUpload } from 'react-icons/fa';
import '../Style/PetCreateForm.css';

import api from "../configs/axios";


export default function PetCreate() {
    const [images, setImages] = useState([]);
    const [petTypes, setPetTypes] = useState([]);
    const [formData, setFormData] = useState({
        petName: '',
        petTypeId: '', // Tạm gán cứng ID loại
        petBreed: '',
        petAge: '',
        petGender: '',
        description: '',
        additionalInfo: '',
        foundLocation: '',
        healthStatus: '',


    });

    const navigate = useNavigate();


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderSelect = (gender) => {
        setFormData(prev => ({ ...prev, petGender: gender }));
    };

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        fileInputRef.current.value = ''; // reset input để có thể chọn lại cùng file nếu cần
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length < 1) {
            alert("Vui lòng tải lên ít nhất 1 hình ảnh.");
            return;
        }

        try {
            const form = new FormData();

            // Gán các field văn bản
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value);
            });

            // Gán ảnh (giả sử API chấp nhận nhiều file dưới cùng key "images")
            images.forEach((file) => {
                form.append("ImageFiles", file);
            });

            const response = await api.post('/Pet', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.isSuccess) {
                alert("Đăng tải thú cưng thành công!");
                // Reset form nếu muốn:
                setFormData({
                    petName: '',
                    petTypeId: '',
                    petBreed: '',
                    petAge: '',
                    petGender: '',
                    description: '',
                    additionalInfo: '',
                    foundLocation: '',
                    healthStatus: '',

                });
                setImages([]);
            } else {
                alert("Thất bại: " + response.data.message);
            }

        } catch (err) {
            console.error("Lỗi khi đăng tải:", err);
            alert("Đã xảy ra lỗi khi gửi dữ liệu.");
        }
    };



    // Fetch pet types từ API khi load trang
    useEffect(() => {
        const fetchPetTypes = async () => {
            try {
                const res = await api.get('/PetType'); // đổi URL nếu khác
                if (res.data.isSuccess) {
                    setPetTypes(res.data.result);
                } else {
                    console.error('Không lấy được loại thú:', res.data.message);
                }
            } catch (error) {
                console.error('Lỗi khi fetch loại thú:', error);
            }
        };
        fetchPetTypes();
    }, []);

    return (

        
        <div className="form-container">
            <button
    onClick={() => navigate('/manage-pet')}
    className="back-button"
>
    <FaArrowLeft />
</button>


            <h1 className="form-title">Đăng tải thông tin thú cưng</h1>

            <div className="form-grid">
                <div className="form-left">
                    <label className="form-label">Tên thú cưng</label>
                    <input
                        className="form-input"
                        placeholder="Nhập tên thú cưng"
                        name="petName"
                        value={formData.petName}
                        onChange={handleInputChange}
                    />

                    <label className="form-label">Loại</label>
                    <select
                        className="form-input"
                        name="petTypeId"
                        value={formData.petTypeId}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn loại</option>
                        {petTypes.map((type) => (
                            <option key={type.petTypeId} value={type.petTypeId}>
                                {type.petTypeName}
                            </option>
                        ))}
                    </select>


                    <label className="form-label">Giống</label>
                    <input
                        className="form-input"
                        placeholder="Nhập giống thú cưng VD: Corgi"
                        name="petBreed"
                        value={formData.petBreed}
                        onChange={handleInputChange}
                    />

                    <label className="form-label">Tuổi</label>
                    <input
                        className="form-input"
                        placeholder="Nhập tuổi ước tính VD: 5 tháng tuổi"
                        name="petAge"
                        value={formData.petAge}
                        onChange={handleInputChange}
                    />

                    <label className="form-label">Giới tính</label>
                    <div className="gender-select">
                        <label
                            className={`gender-option ${formData.petGender === 'Duc' ? 'selected' : ''}`}
                            onClick={() => handleGenderSelect('Duc')}
                        >
                            <FaHeart className="gender-icon" />
                            Đực
                        </label>
                        <label
                            className={`gender-option ${formData.petGender === 'Cai' ? 'selected' : ''}`}
                            onClick={() => handleGenderSelect('Cai')}
                        >
                            <FaHeart className="gender-icon" />
                            Cái
                        </label>
                    </div>


                    <label className="form-label">Thông tin thêm</label>
                    <input
                        className="form-input"
                        placeholder="Thói quen, tính cách của thú cưng"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                    />
                    

                </div>

                <div className="form-right">
                    <label className="form-label">Địa điểm được tìm thấy</label>
                    <input
                        className="form-input"
                        placeholder="Nhập địa điểm cụ thể đã tìm thấy thú cưng"
                        name="foundLocation"
                        value={formData.foundLocation}
                        onChange={handleInputChange}
                    />

                    <label className="form-label">Hình ảnh</label>
                    <label htmlFor="image-upload" className="image-upload-box">
                        <FaUpload className="upload-icon" />
                        <p>Kéo thả hoặc click để tải ảnh lên (Tối thiểu 5 ảnh)</p>
                        <p>Hỗ trợ: PNG, JPG (Tối đa 6MB)</p>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/png, image/jpeg"
                            multiple
                            hidden
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />

                    </label>

                    {images.length > 0 && (
                        <div className="image-preview">
                            {images.map((img, index) => (
                                <div key={index} className="image-thumb">
                                    <img src={URL.createObjectURL(img)} alt={`preview-${index}`} />
                                </div>
                            ))}
                        </div>
                    )}

                    <label className="form-label">Tình trạng hiện tại của thú cưng</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Tình trạng sức khoẻ VD: Khoẻ mạnh/ Gãy 1 bên chân,..."
                        name="healthStatus"
                        value={formData.healthStatus}
                        onChange={handleInputChange}
                    ></textarea>

                    <label className="form-label">Mô tả</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Mô tả về thú cưng"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-button-wrapper">
                <button className="form-submit-button" onClick={handleSubmit}>
                    Đăng tải
                </button>

            </div>
        </div>
    );
}
