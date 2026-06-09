"use client";

import dynamic from "next/dynamic";

const SearchContent = dynamic(() => import("./search-content"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  ),
  ssr: true,
});

export default function SearchPage() {
  return <SearchContent />;
}
