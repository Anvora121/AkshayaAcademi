import { motion } from "framer-motion";
import { Star, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RankingBadgeProps {
  rank: number;
  source?: "QS" | "THE";
  updatedAt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Whether to apply the animated floating effect */
  animate?: boolean;
}

/**
 * Animated ranking badge with source and last-updated tooltip.
 * Shows QS/THE source and the date the ranking was last updated.
 */
const RankingBadge = ({
  rank,
  source = "QS",
  updatedAt,
  size = "md",
  className,
  animate = true,
}: RankingBadgeProps) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const badge = (
    <motion.div
      animate={
        animate
          ? {
              y: [0, -3, 0],
              boxShadow: [
                "0 0 8px rgba(255, 107, 44, 0.3)",
                "0 0 16px rgba(255, 107, 44, 0.6)",
                "0 0 8px rgba(255, 107, 44, 0.3)",
              ],
            }
          : {}
      }
      transition={
        animate
          ? {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {}
      }
      className={cn(
        "inline-flex items-center rounded-lg font-bold",
        "bg-gradient-to-r from-accent to-orange-500 text-white",
        "shadow-md cursor-default",
        sizeClasses[size],
        className
      )}
    >
      <Star className={cn(iconSizes[size], "fill-white shrink-0")} />
      <span>{source} #{rank}</span>
      {updatedAt && (
        <Info className={cn(iconSizes[size], "opacity-70 shrink-0")} />
      )}
    </motion.div>
  );

  if (!updatedAt) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-semibold">{source} World University Rankings</p>
          <p className="text-muted-foreground">Last updated: {updatedAt}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RankingBadge;
