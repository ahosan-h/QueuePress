"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Search, Bell } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sidebar } from "./sidebar";

export function Navbar() {
  const { isSignedIn } = useUser();
  return (
    <header className="sticky top-0 lg:z-50 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-2 md:px-6">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 pl-2 ">
          <div className="lg:hidden">
            <Sidebar />
          </div>

          <Image src="/logo-app.png" alt="QueuePress" width={140} height={32} />
        </div>
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input placeholder="Search blogs..." className="w-[320px] pl-9" />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <ThemeToggle />

          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 border border-border",
                },
              }}
            />
          ) : (
            <SignInButton mode="modal">
              <Button>Login</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
