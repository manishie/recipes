import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-gray-900 text-white": variant === "default",
          "bg-gray-100 text-gray-900": variant === "secondary",
          "border border-gray-300": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
