"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { BarChart3, FileText, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";

import { BlogService } from "@/services/blog.service";
import { useBlogStore } from "@/stores/blog-store";
import { useNotificationStore } from "@/stores/notification-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const blogs = useBlogStore((state) => state.blogs);
  const setBlogs = useBlogStore((state) => state.setBlogs);
  const setLoading = useBlogStore((state) => state.setLoading);
  const notifications = useNotificationStore((state) => state.notifications);
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);

        const token = await getToken();

        if (!token) {
          return;
        }

        const data = await BlogService.getAll(token);
        setBlogs(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, [getToken, setBlogs, setLoading]);

  const totalBlogs = blogs.length;
  const publishedCount = blogs.filter(
    (blog) => blog.status === "published",
  ).length;
  const scheduledCount = blogs.filter(
    (blog) => blog.status === "scheduled",
  ).length;
  const draftCount = blogs.filter((blog) => blog.status === "draft").length;

  const recentBlogs = useMemo(() => blogs.slice(0, 5), [blogs]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <CardTitle>Blogs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{totalBlogs}</p>
            <p className="text-sm text-muted-foreground">
              Total posts in your workspace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <CardTitle>Published</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{publishedCount}</p>
            <p className="text-sm text-muted-foreground">
              Live posts now available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <CardTitle>Scheduled</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{scheduledCount}</p>
            <p className="text-sm text-muted-foreground">
              Upcoming scheduled posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <CardTitle>Drafts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{draftCount}</p>
            <p className="text-sm text-muted-foreground">
              Posts still in draft state
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Your latest blog posts and their current publishing status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent posts yet. Create a blog to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="rounded-xl border p-4 transition hover:border-primary/50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{blog.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {blog.summary || blog.content.slice(0, 80)}
                        </p>
                      </div>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        {blog.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span>{blog.readingTime ?? 0} min</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Recent publish activity captured from your app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notifications yet. Notifications appear when blogs are
                published or updated.
              </p>
            ) : (
              notifications.slice(0, 6).map((notification) => (
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
                Clear notifications
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
