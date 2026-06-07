import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export function useAuthAction() {
  const { isSignedIn } = useUser();

  const requireAuth = (callback: () => void) => {
    if (!isSignedIn) {
      toast.error("Please login first to continue");
      return;
    }
    callback();
  };
  return {
    requireAuth,
    isSignedIn,
  };
}
