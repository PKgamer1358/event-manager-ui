export const initWebNotifications = async () => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export const showWebNotification = (
  title: string,
  body: string
) => {
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/logo192.png",
  });
};

