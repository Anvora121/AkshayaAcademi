import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, User, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/config";

interface CounselorModalProps {
  universityName: string;
  onClose: () => void;
}

const CounselorModal = ({ universityName, onClose }: CounselorModalProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in name, email, and phone.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries/counselor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, universityName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit");
      }
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-border/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-secondary/20">
            <div>
              <h2 className="text-lg font-bold text-foreground">Talk to a Counselor</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                About <span className="font-medium text-accent">{universityName}</span>
              </p>
            </div>
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Request Received!</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Our counselor will reach out to you within 24 hours.
              </p>
              <Button type="button" onClick={onClose} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  name="message"
                  placeholder="What would you like to know? (optional)"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Request Callback
                  </span>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                We typically respond within 24 hours on business days.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CounselorModal;
