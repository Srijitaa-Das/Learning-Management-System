import React, { useState } from "react";
import { registerService, loginService } from "@/services/index";  // ✅ Fixed import
import CommonForm from "@/components/common-form";
import {
  signUpFormControls,
  signInFormControls,
  initialSignInFormData,
  initialSignUpFormData,
} from "@/config";

function AuthPage() {
  const [formData, setFormData] = useState(initialSignInFormData);
  const [isSignUp, setIsSignUp] = useState(false);

  const formControls = isSignUp ? signUpFormControls : signInFormControls;

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form Submitted:", formData);

    if (isSignUp) {
      // Handle Sign-Up
      try {
        const response = await registerService(formData);
        console.log("Registration Response:", response);

        if (response.success) {
          alert("✅ Sign-up successful! Please log in.");
          setIsSignUp(false);
          setFormData(initialSignInFormData);
        } else {
          alert("❌ Registration failed: " + (response.message || "Unknown error"));
        }
      } catch (error) {
        console.error("⚠️ Registration error:", error);
        alert("⚠️ Registration failed. Please try again.");
      }
    } else {
      // Handle Sign-In
      try {
        const response = await loginService(formData);
        console.log("Login Response:", response);

        if (response.success) {
          alert("✅ Login successful!");
          // Handle user login state here (e.g., store token, redirect)
        } else {
          alert("❌ Login failed: " + (response.message || "Unknown error"));
        }
      } catch (error) {
        console.error("⚠️ Login error:", error);
        alert("⚠️ Login failed. Please try again.");
      }
    }
  };

  const handleToggleForm = () => {
    setIsSignUp((prevState) => !prevState);
    setFormData(isSignUp ? initialSignInFormData : initialSignUpFormData);
  };

  const isSignInValid = formData.userEmail && formData.password;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-black text-center mb-6">IntelliLearn</h2>

        <CommonForm
          handleSubmit={handleSubmit} // ✅ Fixed function reference
          buttonText={isSignUp ? "Sign Up" : "Sign In"}
          formControls={formControls}
          formData={formData}
          setFormData={setFormData}
          loginService={loginService}
          isButtonDisabled={isSignUp ? Object.values(formData).some((value) => value === "") : !isSignInValid}
        />

        <div className="mt-4 text-center">
          {isSignUp ? (
            <button
              onClick={handleToggleForm} // ✅ Correct function
              className="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-300"
            >
              Already have an account? Sign In
            </button>
          ) : (
            <button
              onClick={handleToggleForm}
              className="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-300"
            >
              Don't have an account? Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
