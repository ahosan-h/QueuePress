import { create } from "zustand";

export type NotificationType = "success" | "info" | "warning";

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: NotificationType;
}

type NotificationStore = {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          ...notification,
        },
        ...state.notifications,
      ].slice(0, 10),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
