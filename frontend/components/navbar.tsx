import { UserButton } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-end border-b border-border px-6">
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
