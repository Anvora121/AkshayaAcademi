import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, ChevronLeft, ChevronRight, Clock, TrendingUp, Award, Globe, ArrowRight } from "lucide-react";
import { useNews, type NewsArticle } from "@/hooks/useNews";
import { format } from "date-fns";

const NEWS_INTERVAL = 5000;

interface NewsItem {
  id: string;
  category: string;
  categoryIcon: React.ElementType;
  categoryColor: string;
  headline: string;
  summary: string;
  university: string;
  country: string;
  date: string;
  image: string;
  slug?: string;
}

// Static fallback data shown when the API has no published news yet
const STATIC_NEWS: NewsItem[] = [
  {
    id: "static-1",
    category: "University Rankings",
    categoryIcon: Award,
    categoryColor: "text-amber-400",
    headline: "MIT Retains #1 Spot in QS World University Rankings 2025",
    summary:
      "MIT has maintained its top position for the 13th consecutive year, excelling in employer reputation and research output across engineering disciplines.",
    university: "Massachusetts Institute of Technology",
    country: "USA",
    date: "May 2025",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&q=80",
  },
  {
    id: "static-2",
    category: "Scholarships",
    categoryIcon: TrendingUp,
    categoryColor: "text-emerald-400",
    headline: "Oxford Launches £50M Global Scholarship Fund for 2026 Intake",
    summary:
      "University of Oxford announces an unprecedented scholarship programme supporting 500 international students annually in STEM, humanities, and social sciences.",
    university: "University of Oxford",
    country: "UK",
    date: "May 2025",
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80",
  },
  {
    id: "static-3",
    category: "Admission Updates",
    categoryIcon: Globe,
    categoryColor: "text-blue-400",
    headline: "Canada Opens New 3-Year Post-Study Work Permit for Graduates",
    summary:
      "Immigration Canada expands post-graduation work permit eligibility, allowing graduates from 200+ designated institutions to work for up to 3 years after completing their degree.",
    university: "University of Toronto",
    country: "Canada",
    date: "Apr 2025",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
  },
  {
    id: "static-4",
    category: "Campus Updates",
    categoryIcon: Newspaper,
    categoryColor: "text-violet-400",
    headline: "TU Munich Partners with Google DeepMind for AI Research Centre",
    summary:
      "Technical University of Munich secures a landmark €200M partnership establishing Europe's largest university-based AI research centre, offering 300 fully funded PhD positions.",
    university: "TU Munich",
    country: "Germany",
    date: "Apr 2025",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80",
  },
  {
    id: "static-5",
    category: "Admission Updates",
    categoryIcon: TrendingUp,
    categoryColor: "text-rose-400",
    headline: "ANU Introduces Guaranteed Entry Scores for Indian Students",
    summary:
      "Australian National University launches a dedicated pathway for Indian students with a streamlined application process and guaranteed scholarship consideration.",
    university: "Australian National University",
    country: "Australia",
    date: "Mar 2025",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
  },
  {
    id: "static-6",
    category: "University Rankings",
    categoryIcon: Award,
    categoryColor: "text-sky-400",
    headline: "ETH Zürich Tops Europe in Engineering & Technology 2025",
    summary:
      "ETH Zürich secures its position as Europe's #1 engineering university, with its interdisciplinary programs and industry collaboration driving unmatched graduate employment rates.",
    university: "ETH Zürich",
    country: "Switzerland",
    date: "Mar 2025",
    image: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=1200&q=80",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Admission Updates": "text-blue-400",
  "Scholarships": "text-emerald-400",
  "University Rankings": "text-amber-400",
  "Placements": "text-purple-400",
  "Visa & Immigration": "text-orange-400",
  "Campus Updates": "text-violet-400",
  "General Education": "text-sky-400",
};

const mapApiArticle = (article: NewsArticle): NewsItem => ({
  id: article._id,
  category: article.category,
  categoryIcon: Award,
  categoryColor: CATEGORY_COLORS[article.category] || "text-accent",
  headline: article.title,
  summary: article.summary,
  university: article.universityName || "Akshaya Akademics",
  country: article.country || "",
  date: article.publishDate
    ? format(new Date(article.publishDate), "MMM yyyy")
    : format(new Date(article.createdAt), "MMM yyyy"),
  image:
    article.featuredImage ||
    "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=1200&q=80",
  slug: article.slug,
});

const UniversityNews = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { data } = useNews({ featured: true, limit: 6, page: 1 });
  const apiArticles = data?.articles ?? [];
  const newsItems: NewsItem[] =
    apiArticles.length > 0 ? apiArticles.map(mapApiArticle) : STATIC_NEWS;

  const totalItems = newsItems.length;

  const resetProgress = useCallback(() => {
    setProgress(0);
    if (progressBarRef.current) {
      progressBarRef.current.style.width = "0%";
    }
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index);
      resetProgress();
    },
    [resetProgress]
  );

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
    resetProgress();
  }, [totalItems, resetProgress]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    resetProgress();
  }, [totalItems, resetProgress]);

  // Reset index when newsItems length changes (API data loads)
  useEffect(() => {
    setActiveIndex(0);
    resetProgress();
  }, [totalItems, resetProgress]);

  // Auto-advance with progress bar
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + (50 / NEWS_INTERVAL) * 100, 100);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${next}%`;
        }
        return next;
      });
    }, 50);

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
      setProgress(0);
      if (progressBarRef.current) progressBarRef.current.style.width = "0%";
    }, NEWS_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [paused, activeIndex, totalItems]);

  if (newsItems.length === 0) return null;

  const active = newsItems[activeIndex] ?? newsItems[0];
  const CategoryIcon = active.categoryIcon;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern-light opacity-30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4 border border-accent/20">
            <Newspaper className="w-4 h-4" />
            University News & Updates
          </span>
          <h2 className="text-foreground mb-4">Stay Ahead with Global University Insights</h2>
          <p className="text-lg text-muted-foreground">
            Breaking news on rankings, scholarships, admissions, and research from the world's top universities — updated regularly.
          </p>
        </motion.div>

        {/* Flash Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-card min-h-[420px] md:min-h-[360px]">
            {/* Background image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`bg-${active.id}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${active.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col h-full min-h-[420px] md:min-h-[360px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${active.id}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col h-full"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider ${active.categoryColor}`}>
                        <CategoryIcon className="w-3.5 h-3.5" />
                        {active.category}
                      </span>
                      {active.date && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground font-medium">
                          <Clock className="w-3 h-3" />
                          {active.date}
                        </span>
                      )}
                    </div>
                    {active.country && (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80">
                        <Globe className="w-4 h-4" />
                        {active.country}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-snug mb-4 max-w-2xl">
                    {active.headline}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-xl mb-6 flex-grow">
                    {active.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Source University</p>
                        <p className="text-sm font-semibold text-foreground">{active.university}</p>
                      </div>
                    </div>

                    {active.slug ? (
                      <Link
                        to={`/news/${active.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors group"
                      >
                        Read More
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ) : (
                      <Link
                        to="/news"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors group"
                      >
                        View All News
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/30">
              <div ref={progressBarRef} className="h-full bg-accent w-0" />
            </div>

            {/* Paused pill */}
            <AnimatePresence>
              {paused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-background/80 border border-border text-xs font-bold text-muted-foreground backdrop-blur-sm"
                >
                  ⏸ Paused
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <button
              type="button"
              onClick={goPrev}
              className="w-10 h-10 rounded-2xl bg-secondary hover:bg-accent/10 border border-border hover:border-accent/30 flex items-center justify-center text-muted-foreground hover:text-accent transition-all duration-200"
              aria-label="Previous news"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {newsItems.map((item, idx) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to news ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-7 h-2.5 bg-accent"
                      : "w-2.5 h-2.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="w-10 h-10 rounded-2xl bg-secondary hover:bg-accent/10 border border-border hover:border-accent/30 flex items-center justify-center text-muted-foreground hover:text-accent transition-all duration-200"
              aria-label="Next news"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* View All News CTA */}
          <div className="text-center mt-8">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white transition-all duration-200"
            >
              <Newspaper className="w-4 h-4" />
              View All News
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityNews;
