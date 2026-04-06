import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  MapPin,
  Users,
  Trophy,
  CheckCircle,
  GraduationCap,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  ArrowLeft,
  Building,
  TrendingUp,
  BookOpen,
  Award,
} from "lucide-react";
import { universitiesData } from "@/data/universities";
import { getPlacementsForUniversity, getUniversityCTCStats, getCountryBenchmark } from "@/data/mockPlacements";
import { getAverageRating } from "@/data/mockFeedback";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import RankingBadge from "@/components/ui/RankingBadge";
import FeaturedBadge from "@/components/ui/FeaturedBadge";
import FeedbackList from "@/components/university/FeedbackList";
import PlacementOffersTable from "@/components/university/PlacementOffersTable";

type Tab = "overview" | "placements" | "reviews";

const UniversityDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const university = universitiesData.find((u) => u.id === id);

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

  if (!university) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
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

  const placements = getPlacementsForUniversity(university.id);
  const ctcStats = getUniversityCTCStats(university.id);
  const benchmark = getCountryBenchmark(university.country);
  const avgRating = getAverageRating(university.id);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "placements", label: `Placements${placements.length > 0 ? ` (${placements.length})` : ""}` },
    { id: "reviews", label: `Reviews${avgRating > 0 ? ` · ★ ${avgRating.toFixed(1)}` : ""}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 h-[600px]">
            <img
              src={university.image}
              alt={university.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-slate-900/30 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              {/* Back Button */}
              <Link
                to="/universities"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Back to Universities</span>
              </Link>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-white/80 mb-6">
                <Link to="/universities" className="hover:text-white transition-colors">Universities</Link>
                <span>/</span>
                <span className="text-white font-medium">{university.name}</span>
              </div>

              {/* Logo & Title */}
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-xl overflow-hidden flex items-center justify-center shrink-0">
                  {university.logo.startsWith('http') ? (
                    <img
                      src={university.logo}
                      alt={`${university.name} logo`}
                      className="w-full h-full object-contain p-1.5"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex'; }}
                    />
                  ) : null}
                  <span
                    className="text-primary font-bold text-lg"
                    style={{ display: university.logo.startsWith('http') ? 'none' : 'flex' }}
                  >
                    {university.logo.startsWith('http') ? university.name.split(' ').map(w => w[0]).join('').slice(0, 4) : university.logo}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <RankingBadge
                      rank={university.ranking}
                      source={university.rankingSource}
                      updatedAt={university.rankingUpdatedAt}
                      size="md"
                      animate={true}
                    />
                    {university.featured && <FeaturedBadge size="sm" />}
                    {avgRating > 0 && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {avgRating.toFixed(1)} student rating
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-2">
                    {university.name}
                  </h1>
                  <div className="flex items-center gap-4 text-white/90 font-medium flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-white" />
                      {university.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-white" />
                      {university.type}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-white/90 max-w-3xl mb-8 leading-relaxed">
                {university.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-dark rounded-xl p-4">
                  <p className="text-sm text-white/50 mb-1">Founded</p>
                  <p className="text-xl font-bold text-white">{university.founded}</p>
                </div>
                <div className="glass-dark rounded-xl p-4">
                  <p className="text-sm text-white/50 mb-1">Students</p>
                  <p className="text-xl font-bold text-white">{university.students}</p>
                </div>
                <div className="glass-dark rounded-xl p-4">
                  <p className="text-sm text-white/50 mb-1">Acceptance Rate</p>
                  <p className="text-xl font-bold text-white">{university.acceptanceRate}</p>
                </div>
                <div className="glass-dark rounded-xl p-4">
                  <p className="text-sm text-white/50 mb-1">Tuition</p>
                  <p className="text-xl font-bold text-white">{university.tuitionRange}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border -mt-1">
          <div className="container mx-auto px-4">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <>
                    {/* Why This University */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="premium-card p-8"
                    >
                      <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-3">
                        <Award className="w-6 h-6 text-accent" />
                        Why {university.name}?
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">World-Class Faculty</p>
                            <p className="text-sm text-muted-foreground">Learn from Nobel laureates and industry leaders</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">Research Excellence</p>
                            <p className="text-sm text-muted-foreground">Cutting-edge research facilities and funding</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">Global Network</p>
                            <p className="text-sm text-muted-foreground">Access to {university.students} alumni worldwide</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">Career Support</p>
                            <p className="text-sm text-muted-foreground">{university.careerOutcomes.employmentRate} employment rate</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Popular Programs */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="premium-card p-8"
                    >
                      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-accent" />
                        Popular Programs
                      </h2>
                      <div className="space-y-4">
                        {university.popularPrograms.map((program, index) => (
                          <div key={index} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-foreground">{program.name}</h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {program.duration}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                                    {program.type}
                                  </span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Learn More</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">All Available Courses</h4>
                        <div className="flex flex-wrap gap-2">
                          {university.courses.map((course, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Admission Requirements */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="premium-card p-8"
                    >
                      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-accent" />
                        Admission Requirements
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground mb-1">Minimum GPA</p>
                          <p className="text-2xl font-bold text-foreground">{university.requirements.gpa}</p>
                          <Progress value={parseFloat(university.requirements.gpa) / 4 * 100} className="mt-2 h-2" />
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground mb-1">IELTS Score</p>
                          <p className="text-2xl font-bold text-foreground">{university.requirements.ielts}</p>
                          <Progress value={parseFloat(university.requirements.ielts) / 9 * 100} className="mt-2 h-2" />
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground mb-1">TOEFL Score</p>
                          <p className="text-2xl font-bold text-foreground">{university.requirements.toefl}</p>
                          <Progress value={parseFloat(university.requirements.toefl) / 120 * 100} className="mt-2 h-2" />
                        </div>
                        {university.requirements.gre && (
                          <div className="p-4 rounded-xl bg-secondary/50">
                            <p className="text-sm text-muted-foreground mb-1">GRE Score</p>
                            <p className="text-2xl font-bold text-foreground">{university.requirements.gre}</p>
                            <Progress value={parseFloat(university.requirements.gre.replace('+', '')) / 340 * 100} className="mt-2 h-2" />
                          </div>
                        )}
                        {university.requirements.gmat && (
                          <div className="p-4 rounded-xl bg-secondary/50">
                            <p className="text-sm text-muted-foreground mb-1">GMAT Score</p>
                            <p className="text-2xl font-bold text-foreground">{university.requirements.gmat}</p>
                            <Progress value={parseFloat(university.requirements.gmat.replace('+', '')) / 800 * 100} className="mt-2 h-2" />
                          </div>
                        )}
                      </div>
                      {university.requirements.other && (
                        <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
                          <p className="text-sm font-medium text-accent">{university.requirements.other}</p>
                        </div>
                      )}
                    </motion.div>

                    {/* Career Outcomes */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="premium-card p-8"
                    >
                      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <Briefcase className="w-6 h-6 text-accent" />
                        Career Outcomes
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="p-6 rounded-xl bg-success/10 border border-success/20 text-center">
                          <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                          <p className="text-3xl font-bold text-foreground">{university.careerOutcomes.employmentRate}</p>
                          <p className="text-sm text-muted-foreground">Employment Rate</p>
                        </div>
                        <div className="p-6 rounded-xl bg-accent/10 border border-accent/20 text-center">
                          <DollarSign className="w-8 h-8 text-accent mx-auto mb-2" />
                          <p className="text-3xl font-bold text-foreground">{university.careerOutcomes.avgSalary}</p>
                          <p className="text-sm text-muted-foreground">Average Starting Salary</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Employers</h4>
                        <div className="flex flex-wrap gap-2">
                          {university.careerOutcomes.topEmployers.map((employer, i) => (
                            <span key={i} className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium text-foreground">
                              {employer}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}

                {/* PLACEMENTS TAB */}
                {activeTab === "placements" && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <PlacementOffersTable
                      universityId={university.id}
                      offers={placements}
                      medianCTC={ctcStats.median}
                      averageCTC={ctcStats.average}
                      currency={ctcStats.currency}
                      benchmark={benchmark}
                    />
                  </motion.div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === "reviews" && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <FeedbackList universityId={university.id} universityName={university.name} />
                  </motion.div>
                )}
              </div>

              {/* Right Column - Sticky CTA */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Eligibility CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="premium-card p-6"
                  >
                    <h3 className="text-lg font-bold text-foreground mb-4">Check Your Eligibility</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Find out if you qualify for admission to {university.name} based on your profile.
                    </p>
                    <Link to="/enquiry">
                      <Button className="w-full bg-accent hover:bg-accent/90 text-white" size="lg">
                        Check Eligibility
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Apply CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="premium-card p-6 bg-gradient-to-br from-primary to-primary/90 text-white"
                  >
                    <h3 className="text-lg font-bold mb-2">Ready to Apply?</h3>
                    <p className="text-sm text-white/70 mb-4">
                      Get personalized guidance and priority processing as a Premium Member.
                    </p>
                    {(!user || user.role === "user") ? (
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-not-allowed"
                          size="lg"
                          disabled
                        >
                          Premium Members Only
                        </Button>
                        {!user ? (
                          <Button onClick={() => navigate("/login")} className="w-full bg-white text-primary hover:bg-white/90" size="sm">
                            Log in to Unlock
                          </Button>
                        ) : (
                          <Button onClick={() => navigate("/premium-plans")} className="w-full bg-accent text-white hover:bg-accent/90" size="sm">
                            Upgrade to Premium
                          </Button>
                        )}
                      </div>
                    ) : isSubmitted ? (
                      <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-center backdrop-blur-sm">
                        <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                        <p className="font-bold text-white mb-1">Application Submitted!</p>
                        <p className="text-xs text-white/80">Our premium advisors will contact you shortly.</p>
                      </div>
                    ) : (
                      <Button
                        onClick={handlePremiumApply}
                        className="w-full bg-white text-primary hover:bg-white/90"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Start Premium Application"}
                        {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    )}
                  </motion.div>

                  {/* Quick Contact */}
                  <div className="premium-card p-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Need Help?</h4>
                    <div className="space-y-3 text-sm">
                      <a href="tel:+1234567890" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
                        <span>📞</span> +1 (234) 567-890
                      </a>
                      <a href="mailto:info@akshayaakademics.com" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
                        <span>✉️</span> info@akshayaakademics.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Universities */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Similar Universities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universitiesData
                .filter((u) => u.country === university.country && u.id !== university.id)
                .slice(0, 3)
                .map((uni) => (
                  <Link key={uni.id} to={`/universities/${uni.id}`} className="block">
                    <div className="university-card group">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={uni.image}
                          alt={uni.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-white shadow overflow-hidden flex items-center justify-center">
                            {uni.logo.startsWith('http') ? (
                              <img
                                src={uni.logo}
                                alt={`${uni.name} logo`}
                                className="w-full h-full object-contain p-0.5"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex'; }}
                              />
                            ) : null}
                            <span
                              className="text-primary font-bold text-xs"
                              style={{ display: uni.logo.startsWith('http') ? 'none' : 'flex' }}
                            >
                              {uni.logo.startsWith('http') ? uni.name.split(' ').map(w => w[0]).join('').slice(0, 3) : uni.logo}
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <RankingBadge rank={uni.ranking} source={uni.rankingSource} updatedAt={uni.rankingUpdatedAt} size="sm" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                          {uni.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{uni.location}</p>
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
