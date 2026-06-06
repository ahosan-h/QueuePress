import { Navbar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 w-72" />
      </div>

      <div>
        <Navbar />

        <main className="min-h-[calc(100vh-64px)] p-6">{children}</main>
      </div>
    </>
  );
}
