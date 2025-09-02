export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword?: string;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    requires2FA: boolean;
    token: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      // add other user fields you return from backend
      [key: string]: any;
    };
  };
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}
