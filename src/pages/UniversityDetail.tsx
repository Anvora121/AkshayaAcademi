import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowLeft, CheckCircle, ArrowRight, HeadphonesIcon, Scale, Check } from "lucide-react";
import { universitiesData } from "@/data/universities";
import { cn } from "@/lib/utils";
import RankingBadge from "@/components/ui/RankingBadge";
import { useUniversity } from "@/hooks/useUniversities";
import { API_BASE_URL } from "@/config";
import { useComparison } from "@/contexts/ComparisonContext";
import type { University } from "@/hooks/useUniversities";

// Import all the new premium components
import UniversityHero from "@/components/university/UniversityHero";
import UniversityWhyChoose from "@/components/university/UniversityWhyChoose";
import UniversityCourses from "@/components/university/UniversityCourses";
import UniversityEligibilityChecker from "@/components/university/UniversityEligibilityChecker";
import UniversityRequirements from "@/components/university/UniversityRequirements";
import UniversityCosts from "@/components/university/UniversityCosts";
import UniversityPlacements from "@/components/university/UniversityPlacements";
import UniversityScholarships from "@/components/university/UniversityScholarships";
import UniversityReviews from "@/components/university/UniversityReviews";
import UniversityLocation from "@/components/university/UniversityLocation";
import UniversityComparisonCTA from "@/components/university/UniversityComparisonCTA";
import UniversityApplicationTracker from "@/components/university/UniversityApplicationTracker";
import CounselorModal from "@/components/university/CounselorModal";
import SimilarUniversities from "@/components/university/SimilarUniversities";

type Tab = "overview" | "programs" | "finance" | "outcomes" | "apply";

const UniversityDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showCounselorModal, setShowCounselorModal] = useState(false);

  const { compareList, addToCompare, removeFromCompare, isInCompare, isFull } = useComparison();

  const { data: apiUniversity, isLoading, error } = useUniversity(id || "");
  const localUniversity = universitiesData.find(u => u.id === id);
  const university = apiUniversity || localUniversity;

  const isActuallyLoading = isLoading && !localUniversity;

  usePageMeta({
    title: university ? university.name : "University Not Found",
    description: university
      ? `Explore ${university.name} — rankings, programs, placement offers, and student reviews.`
      : "",
  });

  const handleApply = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/universities/${id}` } });
      return;
    }
    setIsSubmitting(true);
    setApplyError("");
    try {
      const res = await fetch(`${API_BASE_URL}/universities/${university!.id}/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok || res.status === 409) {
        setIsSubmitted(true);
      } else {
        const data = await res.json();
        setApplyError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setApplyError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniAsCompareType = university as unknown as University;
  const inCompare = university ? isInCompare(university.id) : false;

  const handleCompareToggle = () => {
    if (!university) return;
    if (inCompare) {
      removeFromCompare(university.id);
    } else {
      addToCompare(uniAsCompareType);
    }
  };

  if (isActuallyLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-32 pb-20">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
             <p className="text-muted-foreground font-medium">Analyzing university intelligence...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">University Not Found</h1>
            <p className="text-muted-foreground mb-8">The university you're looking for doesn't exist.</p>
            <Link to="/universities">
              <Button>Browse All Universities</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview & Campus" },
    { id: "programs", label: "Programs & Eligibility" },
    { id: "finance", label: "Costs & Scholarships" },
    { id: "outcomes", label: "Placements & Reviews" },
    { id: "apply", label: "Application Journey" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <UniversityHero university={university} />

        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm mt-8">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide py-3">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

              {/* Left Column - Main Content */}
              <div className="xl:col-span-8 space-y-12">

                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <UniversityWhyChoose university={university} />
                    <UniversityLocation university={university} />
                  </motion.div>
                )}

                {activeTab === "programs" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <UniversityEligibilityChecker university={university} />
                    <UniversityCourses university={university} />
                    <UniversityRequirements university={university} />
                  </motion.div>
                )}

                {activeTab === "finance" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <UniversityCosts university={university} />
                    <UniversityScholarships university={university} />
                  </motion.div>
                )}

                {activeTab === "outcomes" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <UniversityPlacements university={university} />
                    <UniversityReviews university={university} />
                  </motion.div>
                )}

                {activeTab === "apply" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <UniversityApplicationTracker university={university} />
                    <UniversityComparisonCTA university={university} />
                  </motion.div>
                )}

              </div>

              {/* Right Column - Sticky Sidebar */}
              <div className="xl:col-span-4">
                <div className="sticky top-28 space-y-4">

                  {/* Apply Now Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="premium-card p-6 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
                    <h3 className="text-xl font-bold mb-1 relative z-10">Apply Now</h3>
                    <p className="text-sm text-white/80 mb-5 relative z-10">
                      Start your application to {university.name}.
                    </p>

                    {isSubmitted ? (
                      <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-center backdrop-blur-sm relative z-10">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                        <p className="font-bold text-white mb-1">Application Submitted!</p>
                        <p className="text-xs text-white/80">We will contact you within 24 hours.</p>
                        <Button
                          type="button"
                          size="sm"
                          className="mt-3 bg-white/20 hover:bg-white/30 text-white border-0"
                          onClick={() => navigate("/dashboard/user")}
                        >
                          View My Applications
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 relative z-10">
                        <Button
                          type="button"
                          onClick={handleApply}
                          className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
                              Submitting...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              {user ? "Apply Now" : "Login to Apply"}
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </Button>
                        {applyError && (
                          <p className="text-xs text-red-300 text-center">{applyError}</p>
                        )}
                        {!user && (
                          <p className="text-xs text-white/60 text-center">
                            Free to apply. No subscription required.
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Talk to Counselor Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="premium-card p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <HeadphonesIcon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Talk to a Counselor</h3>
                        <p className="text-xs text-muted-foreground">Free expert guidance</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Have questions about admission requirements, scholarships, or visa process? Our counselors are here to help.
                    </p>
                    <Button
                      type="button"
                      onClick={() => setShowCounselorModal(true)}
                      variant="outline"
                      className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                    >
                      Request a Callback
                    </Button>
                  </motion.div>

                  {/* Add to Compare */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      type="button"
                      onClick={handleCompareToggle}
                      disabled={!inCompare && isFull}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all",
                        inCompare
                          ? "bg-accent/10 border-accent text-accent"
                          : isFull
                          ? "bg-secondary/30 border-border text-muted-foreground cursor-not-allowed"
                          : "bg-secondary/40 border-border text-foreground hover:border-accent hover:text-accent"
                      )}
                    >
                      {inCompare ? (
                        <><Check className="w-4 h-4" /> Added to Compare</>
                      ) : (
                        <><Scale className="w-4 h-4" /> {isFull ? "Compare List Full" : "Add to Compare"}</>
                      )}
                    </button>
                    {compareList.length >= 2 && (
                      <Button
                        type="button"
                        size="sm"
                        className="w-full mt-2 bg-accent hover:bg-accent/90"
                        onClick={() => navigate("/compare")}
                      >
                        Compare {compareList.length} Universities
                      </Button>
                    )}
                  </motion.div>

                </div>
              </div>
            </div>
          </div>
        </section>

        <SimilarUniversities university={uniAsCompareType} />
      </main>

      <Footer />

      {/* Counselor Modal */}
      {showCounselorModal && (
        <CounselorModal
          universityName={university.name}
          onClose={() => setShowCounselorModal(false)}
        />
      )}
    </div>
  );
};

export default UniversityDetailPage;
