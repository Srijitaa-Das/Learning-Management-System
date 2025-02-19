import { Skeleton } from "@/components/ui/skeleton";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const signUpData = Object.fromEntries(formData.entries()); // ✅ Fix: Extract signup data properly

    try {
      const data = await registerService(signUpData);
      if (data.success) {
        alert("✅ Registration successful! Please log in.");
      } else {
        alert(`❌ Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error.message);
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData.entries());

    try {
      const data = await loginService(loginData);

      if (data.success) {
        console.log("✅ Login successful:", data);
        sessionStorage.setItem("accessToken", data.data.accessToken); // ✅ Use sessionStorage for consistency

        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        console.warn("❌ Login failed:", data.message);
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
    }
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("⚠️ Auth check error:", error);
    } finally {
      setLoading(false);
    }
  }

  function logoutUser() {
    sessionStorage.removeItem("accessToken"); // ✅ Keep sessionStorage consistent
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        handleRegisterUser,
        handleLoginUser,
        auth,
        logoutUser,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}