import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useNews, useRecommendedNews, type NewsArticle } from "@/hooks/useNews";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Newspaper,
  Calendar,
  Eye,
  Star,
  ChevronRight,
  ChevronLeft,
  Tag,
  Globe,
  ArrowRight,
  Sparkles,
  Rss,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const CATEGORIES = [
  "all",
  "Admission Updates",
  "Scholarships",
  "University Rankings",
  "Placements",
  "Visa & Immigration",
  "Campus Updates",
  "General Education",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "Admission Updates": "bg-blue-500/10 text-blue-600 border-blue-200",
  "Scholarships": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  "University Rankings": "bg-amber-500/10 text-amber-600 border-amber-200",
  "Placements": "bg-purple-500/10 text-purple-600 border-purple-200",
  "Visa & Immigration": "bg-orange-500/10 text-orange-600 border-orange-200",
  "Campus Updates": "bg-teal-500/10 text-teal-600 border-teal-200",
  "General Education": "bg-gray-500/10 text-gray-600 border-gray-200",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=800&q=80";

const NewsCard = ({ article, featured = false }: { article: NewsArticle; featured?: boolean }) => {
  const dateStr = article.publishDate || article.createdAt;
  const formattedDate = dateStr ? format(new Date(dateStr), "MMM d, yyyy") : "";

  return (
    <Link to={`/news/${article.slug}`} className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={cn(
          "premium-card overflow-hidden h-full flex flex-col",
          featured && "md:flex-row"
        )}
      >
        {/* Image */}
        <div className={cn("relative overflow-hidden shrink-0", featured ? "md:w-1/2 h-48 md:h-auto" : "h-48")}>
          <img
            src={article.featuredImage || FALLBACK_IMAGE}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {article.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
              <Star className="w-3 h-3" /> Featured
            </div>
          )}
          <span className={cn(
            "absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold border",
            CATEGORY_COLORS[article.category] || "bg-secondary text-foreground border-border"
          )}>
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className={cn(
            "font-bold text-foreground group-hover:text-accent transition-colors leading-snug mb-2",
            featured ? "text-xl md:text-2xl" : "text-base"
          )}>
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
            {article.summary}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
              )}
              {article.country && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {article.country}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.views.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const NewsPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  usePageMeta({
    title: "University News & Updates",
    description: "Stay updated with the latest university news, scholarship opportunities, admission updates, visa changes, and placement reports.",
    canonicalPath: "/news",
  });

  const { data, isLoading } = useNews({
    page,
    limit: 9,
    category: activeCategory,
    search: debouncedSearch,
  });

  const { data: featuredData } = useNews({ featured: true, limit: 3 });
  const { data: recommendedArticles } = useRecommendedNews(6);

  const articles = data?.articles || [];
  const pagination = data?.pagination;
  const featuredArticles = featuredData?.articles || [];

  const handleSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout((window as any)._newsSearchTimer);
    (window as any)._newsSearchTimer = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-28 pb-16 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-5 border border-accent/20">
                <Newspaper className="w-4 h-4" />
                University News & Updates
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Stay Ahead with Global<br className="hidden md:block" /> University Insights
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Rankings, scholarships, admission deadlines, visa updates, and placement news — all in one place.
              </p>

              {/* Search */}
              <div className="max-w-lg mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search news..."
                  className="pl-12 h-12 text-base rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Recommended For You — shown when logged in and results differ from generic feed */}
        {user && recommendedArticles && recommendedArticles.length > 0 && !debouncedSearch && activeCategory === "all" && (
          <section className="py-8 container mx-auto px-4">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Recommended For You
              </h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Rss className="w-3 h-3" />
                Personalised based on your profile
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedArticles.slice(0, 6).map((a) => (
                <NewsCard key={a._id} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* Featured News */}
        {featuredArticles.length > 0 && !debouncedSearch && activeCategory === "all" && (
          <section className="py-10 container mx-auto px-4">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" /> Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredArticles.slice(0, 3).map((a) => (
                <NewsCard key={a._id} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filters */}
        <section className="py-4 sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                    activeCategory === cat
                      ? "bg-accent text-white border-accent shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                  )}
                >
                  {cat === "all" ? "All News" : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="premium-card animate-pulse">
                    <div className="h-48 bg-secondary/60 rounded-t-xl" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-secondary/60 rounded w-3/4" />
                      <div className="h-3 bg-secondary/40 rounded w-full" />
                      <div className="h-3 bg-secondary/40 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-24">
                <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-foreground font-semibold mb-2">No articles found</p>
                <p className="text-muted-foreground text-sm">
                  {debouncedSearch ? `No results for "${debouncedSearch}"` : "Check back soon for updates"}
                </p>
                {(debouncedSearch || activeCategory !== "all") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => { handleSearchChange(""); handleCategoryChange("all"); }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    {pagination && (
                      <>Showing <span className="font-semibold text-foreground">{articles.length}</span> of <span className="font-semibold text-foreground">{pagination.total}</span> articles</>
                    )}
                  </p>
                  {pagination && pagination.total > 0 && (
                    <p className="text-xs text-muted-foreground">Page {pagination.page} of {pagination.pages}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <NewsCard key={article._id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setPage(p)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                            p === page ? "bg-accent text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= pagination.pages}
                      onClick={() => setPage((p) => p + 1)}
                      className="flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;
