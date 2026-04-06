import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface FeaturedBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

/**
 * "Featured for Indian Students" pill badge.
 * Shown on university cards and detail pages for the 10 featured universities per country.
 */
const FeaturedBadge = ({ size = "md", className }: FeaturedBadgeProps) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        "bg-gradient-to-r from-amber-500/20 to-yellow-500/20",
        "border border-amber-400/40 text-amber-600 dark:text-amber-400",
        sizeClasses[size],
        className
      )}
    >
      <Sparkles className={cn(iconSizes[size], "shrink-0")} />
      <span>Featured for Indian Students</span>
    </div>
  );
};

export default FeaturedBadge;
