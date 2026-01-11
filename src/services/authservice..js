import axios from "axios";

const Api_Login = "https://pacpproject.onrender.com/api/Auth/login";
const Api_register_customer =
  "https://pacpproject.onrender.com/api/Auth/register-customer";
const Api_register_business =
  "https://pacpproject.onrender.com/api/Auth/register-business";
// Hàm login nhận vào email và password, trả về kết quả từ API
export const login = async (email, password) => {
  try {
    const response = await axios.post(Api_Login, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Hàm đăng ký customer
export const registerCustomer = async (customerData) => {
  try {
    const response = await axios.post(Api_register_customer, customerData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Hàm đăng ký business
export const registerBusiness = async (businessData) => {
  try {
    const response = await axios.post(Api_register_business, businessData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
