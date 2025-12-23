import { jwtDecode } from "jwt-decode";
import { User } from "../types";

interface DecodedToken {
  sub: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  // college_id?: number;
  roll_number?: string;
  branch?: string;
  year?: number;
  is_admin: boolean;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setAuthData = (token: string, user: User): void => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  return decoded.exp * 1000 > Date.now();
};
