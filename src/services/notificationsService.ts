import axiosInstance from "../utils/axios";

export const fetchNotifications = async () => {
  return axiosInstance.get("/api/notifications/my");
};

export const clearAllNotifications = async () => {
  return axiosInstance.delete("/api/notifications");
};

export const deleteNotification = async (id: number) => {
  return axiosInstance.delete(`/api/notifications/${id}`);
};
