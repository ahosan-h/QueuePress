"use client";

import { useAuth } from "@clerk/nextjs";

export default function TestToken() {
  const { getToken } = useAuth();

  const handleClick = async () => {
    const token = await getToken();

    console.log(token);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Get Token
    </button>
  );
}
