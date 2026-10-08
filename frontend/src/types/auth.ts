export const AUTH_TOKEN_STORAGE_KEY = "homeos.auth.token";
export const AUTH_USER_STORAGE_KEY = "homeos.auth.user";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  userId: string;
  email: string;
  token: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
};