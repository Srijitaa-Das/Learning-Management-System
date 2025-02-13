import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
    const { data } = await axiosInstance.post("/auth/register", formData);
    return data;
}

export async function loginService(formData) {
    const { data } = await axiosInstance.post("/auth/login", formData);

    if (data.success && data.data.accessToken) {
        console.log("✅ Storing token in sessionStorage:", data.data.accessToken);
        sessionStorage.setItem("accessToken", data.data.accessToken);
    } else {
        console.warn("❌ Login failed, no token received");
    }

    return data;
}

export async function checkAuthService() {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        console.warn("⚠️ No access token found in sessionStorage");
        return { success: false, message: "No token provided" };
    }

    console.log("🔹 Sending token in request:", token);

    try {
        const { data } = await axiosInstance.get("/auth/check-auth", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (error) {
        console.error("❌ Auth check failed:", error.response?.data || error.message);
        return { success: false, message: "Authentication failed" };
    }
}
