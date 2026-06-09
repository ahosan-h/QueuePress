"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createBlogSocket } from "@/lib/socket";
import { useNotificationStore } from "@/stores/notification-store";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );

  useEffect(() => {
    const socket = createBlogSocket();

    const handleBlogPublished = (blog: { title: string }) => {
      addNotification({
        title: "Blog published",
        description: `${blog.title} is now live.`,
        type: "success",
      });
    };

    const handleBlogUpdated = (blog: { title: string }) => {
      addNotification({
        title: "Blog updated",
        description: `${blog.title} was updated.`,
        type: "info",
      });
    };

    socket.on("blogPublished", handleBlogPublished);
    socket.on("blogUpdated", handleBlogUpdated);

    socket.connect();

    return () => {
      socket.off("blogPublished", handleBlogPublished);
      socket.off("blogUpdated", handleBlogUpdated);
      socket.disconnect();
    };
  }, [addNotification]);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute right-0 top-0 inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
        )}
      </Button>

      {open && (
        <Card className="absolute right-0 z-50 mt-2 w-[320px] border shadow-lg">
          <CardHeader className="flex items-center justify-between px-4 py-3">
            <div>
              <CardTitle>Notifications</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-3 px-4">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <span className="text-[11px] text-muted-foreground">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              ))
            )}
          </CardContent>

          {notifications.length > 0 && (
            <CardFooter className="justify-end">
              <Button variant="ghost" size="sm" onClick={clearNotifications}>
                Clear
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
