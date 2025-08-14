import Link from "next/link";
import { Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 text-foreground", className)}
    >
      <Mountain className="h-6 w-6 text-primary" />
      <span className="text-lg font-bold">CarbonTrack</span>
    </Link>
  );
}
