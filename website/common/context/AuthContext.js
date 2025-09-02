"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "@/utility/firebase";

import { authApi, userApi } from "@/common/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
let logoutTimer = null;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const [otpState, setOtpState] = useState({
    email: null,
    isNewUser: false,
    needsProfileCompletion: false,
    temporaryToken: null,
    otpSent: false,
  });

  const router = useRouter();

  const startAutoLogout = (token) => {
    try {
      const decoded = jwtDecode(token);
      const expiresInMs = decoded.exp * 1000 - Date.now();

      if (logoutTimer) clearTimeout(logoutTimer);

      logoutTimer = setTimeout(() => {
        logout();
        toast.error("Session expired. Please log in again.");
      }, expiresInMs - 5000);
    } catch {
      logout();
    }
  };

  const checkLoggedIn = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      logout(false);
      setIsAuthLoading(false);
      return;
    }

    try {
      const response = await userApi.me();
      const user = response.data.user;
      if (user) {
        setIsAuthenticated(true);
        setUserInfo(user);
        startAutoLogout(token);
      } else {
        throw new Error("No user found");
      }
    } catch (err) {
      console.error("checkLoggedIn error:", err);
      logout(false);
      toast.error("Session expired. Please log in again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const sendOTP = async (email) => {
    try {
      const response = await authApi.sendOTP(email.toLowerCase().trim());

      if (response.success) {
        setOtpState({
          email: email.toLowerCase().trim(),
          isNewUser: response.data.isNewUser,
          needsProfileCompletion: false,
          temporaryToken: null,
          otpSent: true,
        });

        toast.success("OTP sent to your email");
        return {
          success: true,
          isNewUser: response.data.isNewUser,
          expiresIn: response.data.expiresIn,
        };
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP";
      toast.error(message);
      throw error;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await authApi.verifyOTP(email.toLowerCase().trim(), otp);

      if (response.success) {
        const { data } = response;

        // Update OTP state
        setOtpState((prev) => ({
          ...prev,
          needsProfileCompletion: data.needsProfileCompletion,
          temporaryToken: data.temporaryToken,
        }));

        if (data.needsProfileCompletion) {
          // User needs to complete profile
          toast.success("OTP verified! Please complete your profile.");
          return {
            success: true,
            needsProfileCompletion: true,
            temporaryToken: data.temporaryToken,
            isNewUser: data.isNewUser,
          };
        } else {
          // Existing user with complete profile - login directly
          localStorage.setItem("access_token", data.token);
          localStorage.setItem("refresh_token", data.refreshToken);

          setIsAuthenticated(true);
          setUserInfo(data.user);
          startAutoLogout(data.token);

          // Clear OTP state
          setOtpState({
            email: null,
            isNewUser: false,
            needsProfileCompletion: false,
            temporaryToken: null,
            otpSent: false,
          });

          toast.success("Login successful");
          return {
            success: true,
            needsProfileCompletion: false,
            user: data.user,
          };
        }
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid or expired OTP";
      toast.error(message);
      throw error;
    }
  };

  const completeProfile = async (profileData) => {
    try {
      if (!otpState.temporaryToken) {
        throw new Error("No temporary token found");
      }

      const response = await authApi.completeProfile(
        profileData,
        otpState.temporaryToken
      );

      if (response.success) {
        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("refresh_token", response.data.refreshToken);

        setIsAuthenticated(true);
        setUserInfo(response.data.user);
        startAutoLogout(response.data.token);

        // Clear OTP state
        setOtpState({
          email: null,
          isNewUser: false,
          needsProfileCompletion: false,
          temporaryToken: null,
          otpSent: false,
        });

        toast.success("Profile completed successfully!");
        return { success: true, user: response.data.user };
      } else {
        throw new Error("Profile completion failed");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to complete profile";
      toast.error(message);
      throw error;
    }
  };

  const resetOtpState = () => {
    setOtpState({
      email: null,
      isNewUser: false,
      needsProfileCompletion: false,
      temporaryToken: null,
      otpSent: false,
    });
  };

  const login = async (data) => {
    try {
      const response = await authApi.login(data);
      console.log("Response:", response);
      if (response.status) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        await checkLoggedIn();
        toast.success("Login successful");
      } else {
        throw new Error("Token not received");
      }
    } catch (error) {
      console.log("Error:", error);
      console.log(error?.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authApi.register(data);
      if (response.status === "success") {
        toast.success(response.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed.";
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setUserInfo(null);
    if (logoutTimer) clearTimeout(logoutTimer);
    if (showToast) toast.success("Logged out");
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authApi.forgotPassword(email);
      if (response.status === "success") {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send reset email."
      );
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await authApi.googleSignIn(idToken);

      if (response.status === "success") {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        await checkLoggedIn();
        router.push("/dashboard");
        toast.success("login successful");
      } else {
        throw new Error("login failed");
      }
    } catch (err) {
      console.error("Google Login Failed:", err);
      toast.error("Google Sign-In failed");
    }
  };

  const appleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const idToken = await result.user.getIdToken();

      const response = await authApi.appleSignIn(idToken);

      if (response.status === "success") {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        await checkLoggedIn();
        router.push("/dashboard");
        toast.success("Apple Sign-In successful");
      } else {
        throw new Error("Apple Sign-In failed");
      }
    } catch (err) {
      console.error("Apple Login Failed:", err);
      toast.error("Apple Sign-In failed");
    }
  };

  const resetPassword = async (data) => {
    try {
      const response = await authApi.resetPassword(data);
      if (response.status === "success") {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to reset password."
      );
      throw error;
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await authApi.resendVerificationEmail(email);
      if (response.success) {
        Swal.fire({
          icon: "info",
          title: "Check Your Email",
          text: response.message,
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not resend verification email.",
      });
    }
  };

  const verifyEmail = async (verificationCode) => {
    try {
      const response = await authApi.verifyEmail(verificationCode);
      if (response.status === "success") {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed.");
      throw error;
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        userInfo,

        otpState,
        sendOTP,
        verifyOTP,
        completeProfile,
        resetOtpState,

        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        resendVerification,
        verifyEmail,
        googleLogin,
        appleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
