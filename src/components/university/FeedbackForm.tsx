import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const feedbackSchema = z.object({
  reviewerName: z.string().min(2, "Name must be at least 2 characters"),
  reviewerType: z.enum(["student", "alumni"], { required_error: "Please select your status" }),
  rating: z.number({ required_error: "Rating is required" }).min(1).max(5),
  intakeYear: z
    .number({ required_error: "Intake year is required" })
    .min(1990, "Year must be after 1990")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  reviewText: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be under 1000 characters"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  universityId: string;
  universityName: string;
  onSubmitSuccess?: () => void;
}

const FeedbackForm = ({ universityName, onSubmitSuccess }: FeedbackFormProps) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const selectedRating = watch("rating") || 0;

  const onSubmit = async (_data: FeedbackFormData) => {
    // In production, this would call POST /api/feedback
    // For now, simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitted(true);
    onSubmitSuccess?.();
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-7 h-7 text-success" />
        </div>
        <h3 className="font-semibold text-foreground text-lg mb-2">Review Submitted!</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Thank you for sharing your experience. Your review will be visible after our team
          moderates it (usually within 24 hours).
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Share your experience at <strong>{universityName}</strong>
      </p>

      {/* Rating Stars */}
      <div>
        <Label className="text-sm font-medium">Your Rating *</Label>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setValue("rating", n as 1 | 2 | 3 | 4 | 5, { shouldValidate: true })}
              onMouseEnter={() => setHoveredStar(n)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  n <= (hoveredStar || selectedRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30 hover:text-amber-300"
                )}
              />
            </button>
          ))}
          {selectedRating > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][selectedRating]}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="text-xs text-destructive mt-1">{errors.rating.message}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <Label htmlFor="reviewerName" className="text-sm font-medium">
          Your Name *
        </Label>
        <Input
          id="reviewerName"
          placeholder="e.g. Arjun Sharma"
          {...register("reviewerName")}
          className="mt-1.5"
        />
        {errors.reviewerName && (
          <p className="text-xs text-destructive mt-1">{errors.reviewerName.message}</p>
        )}
      </div>

      {/* Reviewer Type & Intake Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">I am a *</Label>
          <Select
            onValueChange={(v) =>
              setValue("reviewerType", v as "student" | "alumni", { shouldValidate: true })
            }
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Current Student</SelectItem>
              <SelectItem value="alumni">Alumni</SelectItem>
            </SelectContent>
          </Select>
          {errors.reviewerType && (
            <p className="text-xs text-destructive mt-1">{errors.reviewerType.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="intakeYear" className="text-sm font-medium">
            Intake Year *
          </Label>
          <Input
            id="intakeYear"
            type="number"
            min={1990}
            max={new Date().getFullYear()}
            placeholder={String(new Date().getFullYear())}
            onChange={(e) =>
              setValue("intakeYear", Number(e.target.value), { shouldValidate: true })
            }
            className="mt-1.5"
          />
          {errors.intakeYear && (
            <p className="text-xs text-destructive mt-1">{errors.intakeYear.message}</p>
          )}
        </div>
      </div>

      {/* Review Text */}
      <div>
        <Label htmlFor="reviewText" className="text-sm font-medium">
          Your Review *
        </Label>
        <Textarea
          id="reviewText"
          placeholder="Share your experience — academics, campus life, career support, etc."
          rows={4}
          {...register("reviewText")}
          className="mt-1.5 resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          {errors.reviewText ? (
            <p className="text-xs text-destructive">{errors.reviewText.message}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground">
            {watch("reviewText")?.length || 0}/1000
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 text-white"
        disabled={isSubmitting}
      >
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            <motion.span key="loading" className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Submitting...
            </motion.span>
          ) : (
            <motion.span key="default" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Submit Review
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Reviews are moderated before being published. Only honest, experience-based reviews are accepted.
      </p>
    </form>
  );
};

export default FeedbackForm;
