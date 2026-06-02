import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { Star, MessageSquareQuote, ThumbsUp, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import FeedbackList from "./FeedbackList";
import { getAverageRating } from "@/data/mockFeedback";

interface UniversityReviewsProps {
  university: University;
}

const UniversityReviews = ({ university }: UniversityReviewsProps) => {
  const avgRating = getAverageRating(university.id) || 4.5;
  
  // Mock breakdown for visual premium UI
  const ratingBreakdown = {
    academics: 4.8,
    faculty: 4.7,
    placements: 4.5,
    campusLife: 4.2,
    diversity: 4.9,
    safety: 4.6,
    affordability: 3.5,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MessageSquareQuote className="w-8 h-8 text-accent" />
          Reviews & Student Experience
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Authentic insights from alumni and current international students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Overall Rating Box */}
        <div className="lg:col-span-1">
          <div className="p-8 rounded-3xl bg-secondary/30 border border-border/50 text-center h-full flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <h3 className="text-6xl font-bold text-foreground mb-4">{avgRating.toFixed(1)}</h3>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-6 h-6 ${star <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} 
                />
              ))}
            </div>
            <p className="font-medium text-foreground mb-1">Excellent overall experience</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Verified Student Reviews
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-secondary/10 border border-border/50">
          <h4 className="font-bold text-foreground mb-6">Detailed Rating Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(ratingBreakdown).map(([key, val]) => (
              <div key={key} className="flex items-center gap-4">
                <span className="w-28 text-sm font-medium capitalize text-muted-foreground">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <Progress value={(val / 5) * 100} className="h-2 flex-1 bg-background" indicatorColor="bg-amber-500" />
                <span className="text-sm font-bold w-6 text-right">{val.toFixed(1)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-xl">
            <ThumbsUp className="w-4 h-4 text-accent shrink-0" />
            <p className="text-sm font-medium text-accent">92% of students recommend studying here.</p>
          </div>
        </div>
      </div>

      {/* Actual Feedback List Component */}
      <div className="mt-8">
        <FeedbackList universityId={university.id} universityName={university.name} />
      </div>
    </motion.div>
  );
};

export default UniversityReviews;
