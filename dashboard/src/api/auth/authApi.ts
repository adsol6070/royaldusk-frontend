import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
} from "./authTypes";

export const authApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
      { withCredentials: true }
    );
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await httpClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordPayload
  ): Promise<ForgotPasswordResponse> => {
    const response = await httpClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  logout: async (): Promise<{ status: string }> => {
    const response = await httpClient.post<{ status: string }>(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data;
  },
};
