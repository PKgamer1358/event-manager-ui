import axios from "axios";
import { AuthResponse, LoginRequest, SignupRequest, User } from "../types";
import { decodeToken } from "../utils/auth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const authService = {
  async login(
    credentials: LoginRequest
  ): Promise<{ token: string; user: User }> {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/api/auth/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = response.data.access_token;
    const decoded = decodeToken(token);

    const user: User = {
      id: parseInt(decoded?.sub || "0"),
      email: credentials.username,
      full_name: "",
      is_admin: decoded?.is_admin || false,
    };

    return { token, user };
  },

  async signup(data: SignupRequest): Promise<User> {
    const response = await axios.post<User>(
      `${API_BASE_URL}/api/auth/signup`,
      data
    );
    return response.data;
  },
};
