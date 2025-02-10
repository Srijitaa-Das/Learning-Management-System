import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        console.warn("⚠️ No access token found in sessionStorage"); // Debugging log
        return { success: false, message: "No token provided" };
    }

    console.log("🔹 Sending token in request:", token); // Debugging log

    try {
        const { data } = await axiosInstance.get("/auth/check-auth", {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
        });
        return data;
    } catch (error) {
        console.error("❌ Auth check failed:", error.response?.data || error.message);
        return { success: false, message: "Authentication failed" };
    }
}

  