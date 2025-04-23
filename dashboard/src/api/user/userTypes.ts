export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface UserPayload {
  name: string;
  email?: string;
  password?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
