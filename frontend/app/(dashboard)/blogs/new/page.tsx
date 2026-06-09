import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CreateBlogView } from "@/components/blogs/create-blog-view";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Create Blog</h1>

      <CreateBlogView />
    </div>
  );
}
