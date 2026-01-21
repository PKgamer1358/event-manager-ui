import axiosInstance from "../utils/axios";
import { AuthResponse, LoginRequest, SignupRequest, User } from "../types";
import { decodeToken } from "../utils/auth";


export const authService = {
  async login(
    credentials: LoginRequest
  ): Promise<{ token: string; user: User }> {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await axiosInstance.post<AuthResponse>(
      "/api/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("LOGIN RESPONSE FULL:", response.data);
    const token = response.data.access_token;
    console.log("TOKEN:", token);
    const decoded = decodeToken(token);

    const user: User = {
      id: parseInt(decoded?.sub || "0"),
      username: decoded?.username || credentials.username,
      email: decoded?.email || credentials.username,
      first_name: decoded?.first_name || "",
      last_name: decoded?.last_name || "",
      // college_id: decoded?.college_id || 0,
      roll_number: decoded?.roll_number || "",
      branch: decoded?.branch || "",
      year_of_study: decoded?.year || 1,
      is_admin: decoded?.is_admin || false,
      is_super_admin: decoded?.is_super_admin || false,
       is_active: true, // ✅ ADD THIS
    };

    return { token, user };
  },

  async signup(data: SignupRequest): Promise<User> {
    const response = await axiosInstance.post<User>(
      "/api/auth/signup",
      data
    );
    return response.data;
  },
};

export const adminService = {
  async getAllUsers(): Promise<User[]> {
    const res = await axiosInstance.get("/api/users");
    return res.data;
  },

  async activateUser(userId: number): Promise<void> {
    await axiosInstance.patch(`/api/users/${userId}/activate`);
  },

  async deactivateUser(userId: number): Promise<void> {
    await axiosInstance.patch(`/api/users/${userId}/deactivate`);
  },
};

