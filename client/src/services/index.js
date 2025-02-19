import axiosInstance from "@/api/axiosInstance";

// ✅ User Registration Service
export async function registerService(formData) {
    try {
        const { data } = await axiosInstance.post("/auth/register", formData);
        return data;
    } catch (error) {
        console.error("❌ Registration failed:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Registration error" };
    }
}

// ✅ User Login Service
export async function loginService(formData) {
    try {
        const { data } = await axiosInstance.post("/auth/login", formData);

        if (data.success && data.data.accessToken) {
            console.log("✅ Storing token:", data.data.accessToken);
            sessionStorage.setItem("accessToken", data.data.accessToken);  // Or use localStorage if needed
            return data;
        } else {
            console.warn("❌ Login failed, no token received");
            return { success: false, message: "Login failed: No token received" };
        }
    } catch (error) {
        console.error("❌ Login error:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Login error" };
    }
}

// ✅ Authentication Check Service
import {jwtDecode} from "jwt-decode";

export async function checkAuthService() {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        console.warn("⚠️ No access token found in sessionStorage");
        return { success: false, message: "No token provided" };
    }

    // Decode and check expiration
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            console.warn("⚠️ Token has expired, clearing session storage.");
            sessionStorage.removeItem("accessToken");
            return { success: false, message: "Token expired" };
        }
    } catch (error) {
        console.error("❌ Failed to decode token:", error.message);
        sessionStorage.removeItem("accessToken");
        return { success: false, message: "Invalid token" };
    }

    console.log("🔹 Sending valid token in request:", token);

    try {
        const { data } = await axiosInstance.get("/auth/check-auth", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (error) {
        console.error("❌ Auth check failed:", error.response?.data || error.message);

        if (error.response?.status === 401) {
            console.warn("⚠️ Token expired or invalid, clearing session storage.");
            sessionStorage.removeItem("accessToken");
        }

        return { success: false, message: "Authentication failed" };
    }
}

