export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserPayload {
  name: string;
  email?: string;
  role?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
