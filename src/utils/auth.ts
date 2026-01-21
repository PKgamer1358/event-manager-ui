import { jwtDecode } from "jwt-decode";
import { User } from "../types";
import { Storage } from "./storage";

interface DecodedToken {
  sub: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  roll_number?: string;
  branch?: string;
  year?: number;
  is_admin: boolean;
  is_super_admin?: boolean;
  exp: number;
}

/* =======================
   TOKEN DECODE
======================= */

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

/* =======================
   STORAGE (ASYNC)
======================= */

export const getStoredToken = async (): Promise<string | null> => {
  return await Storage.get("token");
};

export const getStoredUser = async (): Promise<User | null> => {
  const userStr = await Storage.get("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setAuthData = async (
  token: string,
  user: User
): Promise<void> => {
  await Storage.set("token", token);
  await Storage.set("user", JSON.stringify(user));
};

export const clearAuthData = async (): Promise<void> => {
  await Storage.remove("token");
  await Storage.remove("user");
};

/* =======================
   TOKEN VALIDATION
======================= */

export const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  return decoded.exp * 1000 > Date.now();
};
