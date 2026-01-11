// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ActiveAccount = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Hàm lấy query param
//   const getQueryParams = (search) => {
//     return new URLSearchParams(search);
//   };

//   useEffect(() => {
//     const params = getQueryParams(location.search);
//     const email = params.get('email');
//     const token = params.get('token');

//     if (!email || !token) {
//       navigate('/login', { state: { message: 'Thông tin kích hoạt không hợp lệ.' } });
//       return;
//     }

//     const activate = async () => {
//       try {
//         const response = await axios.post('https://localhost:7226/api/Auth/active-account', {
//           email,
//           token,
//         });

//         if (response.status === 200) {
//           navigate('/login', { state: { message: 'Kích hoạt tài khoản thành công. Vui lòng đăng nhập.' } });
//         } else {
//           navigate('/login', { state: { message: 'Kích hoạt thất bại. Vui lòng thử lại.' } });
//         }
//       } catch (error) {
//         const msg = error.response?.data || 'Lỗi kết nối đến máy chủ kích hoạt.';
//         navigate('/login', { state: { message: Kích hoạt thất bại: ${msg} } });
//       }
//     };

//     activate();
//   }, [location.search, navigate]);

//   return (
//     <div>
//       <h3>Đang kích hoạt tài khoản...</h3>
//       <p>Nếu bạn không được chuyển hướng tự động, vui lòng <a href="/login">bấm vào đây</a> để đăng nhập.</p>
//     </div>
//   );
// };

// export default ActiveAccount;
