import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Welcome to My App 🚀</h1>

      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="rounded bg-blue-600 px-6 py-2 text-white"
        >
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="rounded bg-gray-800 px-6 py-2 text-white"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}