import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.username) {
      config.data = {
        ...config.data,
        username: user.username,
      };
    }
    // Log request để debug
    console.log("Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Log response để debug
    console.log("Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error("Axios error:", error);
    if (error.response) {
      // Server trả về response với status code nằm ngoài range 2xx
      console.error("Response error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      // Xử lý các lỗi cụ thể
      switch (error.response.status) {
        case 401:
          // Xóa thông tin user và chuyển về trang login
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Không có quyền truy cập");
          break;
        case 404:
          console.error("Không tìm thấy tài nguyên");
          break;
        case 500:
          console.error("Lỗi server");
          break;
        default:
          console.error("Lỗi không xác định");
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("Request error:", {
        request: error.request,
        message: "Không nhận được phản hồi từ server",
      });
    } else {
      // Có lỗi khi setting up request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
