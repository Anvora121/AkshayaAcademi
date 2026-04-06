import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { UniversityFeedback } from "@/data/mockFeedback";

interface FeedbackCardProps {
  feedback: UniversityFeedback;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={cn(
          "w-4 h-4",
          n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
        )}
      />
    ))}
  </div>
);

const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-secondary/50 border border-border hover:border-accent/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-semibold text-foreground text-sm">{feedback.reviewerName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                feedback.reviewerType === "alumni"
                  ? "bg-primary/10 text-primary"
                  : "bg-teal/10 text-teal-600"
              )}
            >
              {feedback.reviewerType === "alumni" ? "Alumni" : "Current Student"}
            </span>
            <span className="text-xs text-muted-foreground">Intake {feedback.intakeYear}</span>
          </div>
        </div>
        <div className="shrink-0">
          <StarRating rating={feedback.rating} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{feedback.reviewText}</p>
      <p className="text-xs text-muted-foreground/50 mt-3">
        {new Date(feedback.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </motion.div>
  );
};

export { StarRating };
export default FeedbackCard;
