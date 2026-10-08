import { post } from "./api";
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "../types/auth";

export const register = (data: RegisterRequest) =>
  post<AuthResponse>("/Auth/register", data);

export const login = (data: LoginRequest) =>
  post<AuthResponse>("/Auth/login", data);

export const changePassword = (data: ChangePasswordRequest) =>
  post<void>("/Auth/change-password", data);

export const forgotPassword = (data: ForgotPasswordRequest) =>
  post<{ message: string }>("/Auth/forgot-password", data);

export const resetPassword = (data: ResetPasswordRequest) =>
  post<void>("/Auth/reset-password", data);