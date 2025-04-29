export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: string;
}
