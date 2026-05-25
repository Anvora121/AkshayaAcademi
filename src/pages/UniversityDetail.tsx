import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";
import { universitiesData } from "@/data/universities";
import { cn } from "@/lib/utils";
import RankingBadge from "@/components/ui/RankingBadge";
import { useUniversity } from "@/hooks/useUniversities";

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
import UniversityAICounselor from "@/components/university/UniversityAICounselor";

type Tab = "overview" | "programs" | "finance" | "outcomes" | "apply";

const UniversityDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

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

  const handlePremiumApply = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
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
              
              {/* Left Column - Main Content (9 cols) */}
              <div className="xl:col-span-8 space-y-12">
                
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <UniversityWhyChoose university={university} />
                    <UniversityLocation university={university} />
                  </motion.div>
                )}

                {/* PROGRAMS TAB */}
                {activeTab === "programs" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <UniversityEligibilityChecker university={university} />
                    <UniversityCourses university={university} />
                    <UniversityRequirements university={university} />
                  </motion.div>
                )}

                {/* FINANCE TAB */}
                {activeTab === "finance" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <UniversityCosts university={university} />
                    <UniversityScholarships university={university} />
                  </motion.div>
                )}

                {/* OUTCOMES TAB */}
                {activeTab === "outcomes" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <UniversityPlacements university={university} />
                    <UniversityReviews university={university} />
                  </motion.div>
                )}

                {/* APPLY TAB */}
                {activeTab === "apply" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <UniversityApplicationTracker university={university} />
                    <UniversityComparisonCTA university={university} />
                  </motion.div>
                )}

              </div>

              {/* Right Column - Sticky Sidebar (3 cols) */}
              <div className="xl:col-span-4">
                <div className="sticky top-28 space-y-6">
                  
                  {/* Apply CTA */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="premium-card p-6 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
                    <h3 className="text-xl font-bold mb-2 relative z-10">Premium Admission</h3>
                    <p className="text-sm text-white/80 mb-6 relative z-10">
                      Let our expert advisors manage your entire application journey to {university.name}.
                    </p>
                    
                    {(!user || user.role === "user") ? (
                      <div className="space-y-3 relative z-10">
                        <Button
                          variant="outline"
                          className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-not-allowed"
                          size="lg"
                          disabled
                        >
                          Premium Members Only
                        </Button>
                        {!user ? (
                          <Button onClick={() => navigate("/login")} className="w-full bg-white text-primary hover:bg-white/90 font-bold" size="sm">
                            Log in to Unlock
                          </Button>
                        ) : (
                          <Button onClick={() => navigate("/premium-plans")} className="w-full bg-accent text-white hover:bg-accent/90 font-bold" size="sm">
                            Upgrade to Premium
                          </Button>
                        )}
                      </div>
                    ) : isSubmitted ? (
                      <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-center backdrop-blur-sm relative z-10">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                        <p className="font-bold text-white mb-1">Application Sent to Advisor</p>
                        <p className="text-xs text-white/80">We will contact you within 24 hours.</p>
                      </div>
                    ) : (
                      <Button
                        onClick={handlePremiumApply}
                        className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 relative z-10"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Initiating..." : "Start Guaranteed Application"}
                        {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    )}
                  </motion.div>

                  {/* AI Counselor */}
                  <UniversityAICounselor university={university} />

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Related Universities Footer */}
        <section className="py-16 bg-secondary/20 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Explore Similar Options</h2>
              <Link to="/universities">
                <Button variant="link" className="text-accent">View all <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universitiesData
                .filter((u) => u.country === university.country && u.id !== university.id)
                .slice(0, 3)
                .map((uni) => (
                  <Link key={uni.id} to={`/universities/${uni.id}`} className="block">
                    <div className="premium-card p-0 group overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={uni.image}
                          alt={uni.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-xl overflow-hidden flex items-center justify-center p-1">
                            {uni.logo.startsWith('http') ? (
                              <img src={uni.logo} alt={uni.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-primary font-bold">{uni.logo}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-white line-clamp-1">{uni.name}</h3>
                            <p className="text-xs text-white/70">{uni.location}</p>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <RankingBadge rank={uni.ranking} source={uni.rankingSource} updatedAt={uni.rankingUpdatedAt} size="sm" animate={false} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityDetailPage;
