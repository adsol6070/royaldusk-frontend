import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import { AuthResponse, LoginPayload, RegisterPayload } from "./authTypes";

export const authApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
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
};
