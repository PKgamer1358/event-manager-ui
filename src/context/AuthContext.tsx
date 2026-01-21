import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "../types";
import {
  getStoredToken,
  getStoredUser,
  setAuthData,
  clearAuthData,
  isTokenValid,
} from "../utils/auth";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import axiosInstance from "../utils/axios";
import { StatusBar, Style } from "@capacitor/status-bar";

/* =======================
   TYPES
======================= */

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =======================
   GLOBAL FLAG (IMPORTANT)
======================= */

let pushListenersRegistered = false;

/* =======================
   PROVIDER
======================= */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     RESTORE SESSION
  ======================= */
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = await getStoredToken();
      const storedUser = await getStoredUser();

      if (storedToken && storedUser && isTokenValid(storedToken)) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        await clearAuthData();
        setToken(null);
        setUser(null);
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  /* =======================
     STATUS BAR (MOBILE)
  ======================= */
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setStyle({ style: Style.Light });
    }
  }, []);

  /* =======================
     PUSH NOTIFICATIONS
  ======================= */
  useEffect(() => {
    if (!user || !token) return;
    if (!Capacitor.isNativePlatform()) return;
    if (pushListenersRegistered) return;

    pushListenersRegistered = true;

    const registerPush = async () => {
      try {
        const perm = await PushNotifications.requestPermissions();
        if (perm.receive !== "granted") return;

        await PushNotifications.register();

        PushNotifications.addListener("registration", async (t) => {
          await axiosInstance.post("/api/notifications/token", {
            token: t.value,
          });
        });

        PushNotifications.addListener("registrationError", (err) => {
          console.error("Push registration error:", err);
        });
      } catch (err) {
        console.error("Push setup failed:", err);
      }
    };

    registerPush();
  }, [user, token]);

  /* =======================
     AUTH ACTIONS
  ======================= */

  const login = async (newToken: string, newUser: User) => {
    await setAuthData(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await clearAuthData();
    setToken(null);
    setUser(null);
  };

  /* =======================
     CONTEXT VALUE
  ======================= */

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: !!user?.is_admin,
    isSuperAdmin: !!user?.is_super_admin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* =======================
   HOOK
======================= */

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
