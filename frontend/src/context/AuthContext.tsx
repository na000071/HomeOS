import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { login as loginRequest, register as registerRequest } from "../services/authApi";
import type {
  AuthenticatedUser,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

const TOKEN_STORAGE_KEY = "homeos.auth.token";
const USER_STORAGE_KEY = "homeos.auth.user";

type AuthContextValue = {
  user: AuthenticatedUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
};

type StoredAuth = {
  user: AuthenticatedUser;
  token: string;
};

const isStoredUser = (value: unknown): value is AuthenticatedUser => {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.email === "string";
};

const readStoredAuth = (): StoredAuth | null => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!token || !storedUser) return null;

    const user = JSON.parse(storedUser) as unknown;
    return isStoredUser(user) ? { token, user } : null;
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const toStoredAuth = (response: AuthResponse): StoredAuth => ({
  token: response.token,
  user: {
    id: response.userId,
    email: response.email,
  },
});

const persistAuth = ({ token, user }: StoredAuth): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => readStoredAuth());
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    setIsRestoring(false);
  }, []);

  const applyAuthResponse = (response: AuthResponse): void => {
    const nextAuth = toStoredAuth(response);
    persistAuth(nextAuth);
    setAuth(nextAuth);
  };

  const login = async (request: LoginRequest): Promise<void> => {
    const response = await loginRequest(request);
    applyAuthResponse(response);
  };

  const register = async (request: RegisterRequest): Promise<void> => {
    const response = await registerRequest(request);
    applyAuthResponse(response);
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setAuth(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isAuthenticated: auth !== null,
      isRestoring,
      login,
      register,
      logout,
    }),
    [auth, isRestoring],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);