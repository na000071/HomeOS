import { post } from "./api";
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

export const register = (data: RegisterRequest) =>
  post<AuthResponse>("/Auth/register", data);

export const login = (data: LoginRequest) =>
  post<AuthResponse>("/Auth/login", data);

export const changePassword = (data: ChangePasswordRequest) =>
  post<void>("/Auth/change-password", data);