import { post } from "./api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export const register = (data: RegisterRequest) =>
  post<AuthResponse>("/Auth/register", data);

export const login = (data: LoginRequest) =>
  post<AuthResponse>("/Auth/login", data);