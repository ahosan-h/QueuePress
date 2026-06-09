"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your profile, manage your account, and update your
          preferences.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              View your Clerk user details and account information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSignedIn && user ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-base">{user.fullName || "No name set"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-base">
                    {user.primaryEmailAddress?.emailAddress ?? "No email"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">User ID</p>
                  <p className="text-base break-all">{user.id}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sign in to manage your settings and account preferences.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Sign out of your current session or manage your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">
                Signing out will close your current session and return you to
                the login screen.
              </p>
              <div className="mt-4">
                <SignOutButton>
                  <Button variant="outline">Sign out</Button>
                </SignOutButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
