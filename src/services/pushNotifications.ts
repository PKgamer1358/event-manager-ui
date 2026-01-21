// src/services/pushNotifications.ts
import { Capacitor } from "@capacitor/core";
import axiosInstance from "../utils/axios";

let initialized = false;

export async function initPushNotifications() {
  // 🚫 Never run on web
  if (!Capacitor.isNativePlatform()) {
    console.log("Push notifications skipped (web)");
    return;
  }

  // 🔒 Prevent double init
  if (initialized) return;
  initialized = true;

  // ✅ Native-only dynamic import
  const { PushNotifications } = await import(
    "@capacitor/push-notifications"
  );

  const permStatus = await PushNotifications.requestPermissions();
  if (permStatus.receive !== "granted") {
    console.warn("Push permission denied");
    return;
  }

  await PushNotifications.register();

  PushNotifications.addListener("registration", async (token) => {
    console.log("FCM Token:", token.value);

    try {
      await axiosInstance.post("/notifications/token", {
        token: token.value,
      });
    } catch (err) {
      console.error("Failed to send FCM token", err);
    }
  });

  PushNotifications.addListener("registrationError", (err) => {
    console.error("Push registration error:", err);
  });
}
