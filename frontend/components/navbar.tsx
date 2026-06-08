"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notification-bell";
import Image from "next/image";
import { Sidebar } from "./sidebar";

export function Navbar() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobileSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const handleCloseMobileSearch = () => {
    setMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 lg:z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* Desktop Navbar */}
      <div className="hidden md:flex h-16 items-center justify-between px-6 gap-5">
        <div className="flex items-center gap-4">
          <Image src="/logo-app.png" alt="QueuePress" width={140} height={32} />
        </div>

        {/* Desktop Search - Centered */}
        <div className="flex-1 flex justify-center">
          <div className="flex w-75 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search blogs..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background hover:border-primary/50 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-colors"
              />
            </div>
            <Button onClick={handleSearch} className="h-11 px-4">
              Search
            </Button>
          </div>
        </div>

        {/* Desktop Right */}
        <div className="flex items-center gap-3">
          <NotificationBell />
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

      {/* Mobile Navbar */}
      <div className="md:hidden">
        <div className="flex h-16 items-center justify-between px-2 gap-2">
          <div className="flex items-center gap-2">
            <Sidebar />
            <Image
              src="/logo-app.png"
              alt="QueuePress"
              width={120}
              height={28}
            />
          </div>

          <div className="flex items-center gap-2">
            {!mobileSearchOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {mobileSearchOpen && (
          <div className="border-t px-2 py-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    } else if (e.key === "Escape") {
                      handleCloseMobileSearch();
                    }
                  }}
                  placeholder="Search blogs..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background hover:border-primary/50 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-colors"
                />
              </div>
              <Button onClick={handleSearch} className="h-11 px-4">
                Search
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseMobileSearch}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
