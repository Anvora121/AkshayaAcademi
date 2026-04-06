import { useState } from "react";
import { Star, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackCard, { StarRating } from "./FeedbackCard";
import FeedbackForm from "./FeedbackForm";
import { getFeedbackForUniversity, getAverageRating, UniversityFeedback } from "@/data/mockFeedback";

interface FeedbackListProps {
  universityId: string;
  universityName: string;
}

const RatingBar = ({ label, count, total }: { label: string; count: number; total: number }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right text-muted-foreground">{label}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-full rounded-full bg-amber-400"
        />
      </div>
      <span className="w-4 text-muted-foreground">{count}</span>
    </div>
  );
};

const FeedbackList = ({ universityId, universityName }: FeedbackListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [localFeedback] = useState<UniversityFeedback[]>(
    getFeedbackForUniversity(universityId)
  );

  const avgRating = getAverageRating(universityId);
  const totalReviews = localFeedback.length;

  // Count per star rating
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: localFeedback.filter((f) => f.rating === star).length,
  }));

  return (
    <div>
      {/* Header & Summary */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Average Rating Block */}
        <div className="flex items-center gap-4 p-5 rounded-xl bg-secondary/50 min-w-[160px]">
          <div className="text-center">
            <p className="text-5xl font-bold text-foreground">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</p>
            <StarRating rating={Math.round(avgRating)} />
            <p className="text-xs text-muted-foreground mt-1">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          {ratingCounts.map(({ star, count }) => (
            <RatingBar key={star} label={String(star)} count={count} total={totalReviews} />
          ))}
        </div>
      </div>

      {/* Review Cards */}
      {totalReviews === 0 ? (
        <div className="py-10 text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {localFeedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
        </div>
      )}

      {/* Write a Review Toggle */}
      <div className="border-t border-border pt-6">
        <Button
          variant="outline"
          onClick={() => setShowForm((v) => !v)}
          className="w-full flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {showForm ? "Hide Form" : "Write a Review"}
          {showForm ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
        </Button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-5">
                <FeedbackForm
                  universityId={universityId}
                  universityName={universityName}
                  onSubmitSuccess={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedbackList;
