import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
});

// Automatically attach token to requests
axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
