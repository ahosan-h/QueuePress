"use client";

import { useAuthAction } from "@/hooks/use-auth-action";
import { Button } from "../ui/button";
import { CalendarDays } from "lucide-react";

interface Props {
  onSchedule: () => void;
}

export function SheduleBlogButton({ onSchedule }: Props) {
  const { requireAuth } = useAuthAction();

  return (
    <Button onClick={() => requireAuth(onSchedule)}>
      <CalendarDays className="mr-2 h-4 w-4" />
      Schedule
    </Button>
  );
}
