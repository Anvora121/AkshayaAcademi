import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  Search,
  MapPin,
  GraduationCap,
  Star,
  ChevronRight,
  ChevronLeft,
  Users,
  TrendingUp,
  Filter,
  SortAsc,
  SortDesc,
  Scale,
  Plus,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { universitiesData, countryImages, countries } from "@/data/universities";
import { usePaginatedUniversities } from "@/hooks/useUniversities";
import type { University } from "@/hooks/useUniversities";
import { getAverageRating } from "@/data/mockFeedback";
import RankingBadge from "@/components/ui/RankingBadge";
import FeaturedBadge from "@/components/ui/FeaturedBadge";
import { useComparison } from "@/contexts/ComparisonContext";

type RankFilter = "all" | "top10" | "top50" | "top100";
type SortOrder = "default" | "rank-asc" | "rank-desc";

const PAGE_SIZE = 12;

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const range: (number | "...")[] = [];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  range.push(1);
  if (start > 2) range.push("...");
  for (let i = start; i <= end; i++) range.push(i);
  if (end < total - 1) range.push("...");
  range.push(total);
  return range;
}

const UniversityCardSkeleton = () => (
  <div className="university-card animate-pulse">
    <div className="h-48 bg-secondary/60 rounded-t-xl" />
    <div className="p-5 space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-secondary/60 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary/60 rounded w-3/4" />
          <div className="h-3 bg-secondary/40 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-secondary/40 rounded w-1/4" />
      <div className="h-9 bg-secondary/60 rounded-lg mt-auto" />
    </div>
  </div>
);

const PaginationBar = ({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) => {
  if (total <= 1) return null;
  const pages = getPageRange(current, total);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-sm font-medium hover:border-accent hover:text-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm select-none"
          >
            ···
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p as number)}
            aria-label={`Page ${p}`}
            aria-current={current === p ? "page" : undefined}
            className={cn(
              "w-9 h-9 rounded-lg border text-sm font-medium transition-all",
              current === p
                ? "bg-accent text-white border-accent"
                : "border-border hover:border-accent hover:text-accent"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Next page"
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-sm font-medium hover:border-accent hover:text-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const UniversitiesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCountry = searchParams.get("country") || "all";
  const [activeCountry, setActiveCountry] = useState(initialCountry);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [rankFilter, setRankFilter] = useState<RankFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const { compareList, addToCompare, removeFromCompare, isInCompare, isFull } = useComparison();

  usePageMeta({
    title: "Explore Universities",
    description: "Discover 330+ top-ranked universities across 11 countries. Filter by country, rank, and more to find your perfect match.",
    canonicalPath: "/universities",
  });

  // Reset to page 1 whenever server-side filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCountry, searchQuery]);

  // Also reset to page 1 when client-side filters change (rank filter, sort)
  useEffect(() => {
    setCurrentPage(1);
  }, [rankFilter, sortOrder]);

  const countryKeys = Object.keys(countryImages).filter((k) => k !== "all");
  useEffect(() => {
    if (activeCountry === "all") {
      const interval = setInterval(() => {
        setCurrentBgIndex((prev) => (prev + 1) % countryKeys.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeCountry]);

  const currentBackground =
    activeCountry === "all"
      ? countryImages[countryKeys[currentBgIndex]]
      : countryImages[activeCountry] || countryImages.all;

  const { data, isLoading, isFetching, error } = usePaginatedUniversities(
    { country: activeCountry, search: searchQuery },
    currentPage,
    PAGE_SIZE
  );

  const apiUniversities: University[] = data?.universities || [];
  const pagination = data?.pagination;

  const shouldFallback = !!error || (!isLoading && !isFetching && apiUniversities.length === 0);

  // Local pagination for fallback (API down)
  const localFiltered = (universitiesData as unknown as University[]).filter((uni) => {
    const matchesCountry = activeCountry === "all" || uni.country === activeCountry;
    const matchesSearch =
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });
  const localSorted = [...localFiltered].sort((a, b) => {
    if (sortOrder === "rank-asc") return a.ranking - b.ranking;
    if (sortOrder === "rank-desc") return b.ranking - a.ranking;
    return 0;
  });
  const localTotal = localSorted.length;
  const localPages = Math.ceil(localTotal / PAGE_SIZE) || 1;
  const localPageData = localSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Apply client-side rank filter + sort on the page's data
  const sourceData = shouldFallback ? localPageData : apiUniversities;
  const filteredUniversities = sourceData
    .filter((uni) => {
      if (rankFilter === "all") return true;
      if (rankFilter === "top10") return uni.ranking <= 10;
      if (rankFilter === "top50") return uni.ranking <= 50;
      return uni.ranking <= 100;
    })
    .sort((a, b) => {
      if (sortOrder === "rank-asc") return a.ranking - b.ranking;
      if (sortOrder === "rank-desc") return b.ranking - a.ranking;
      return 0;
    });

  const totalPages = shouldFallback ? localPages : pagination?.pages || 1;
  const totalUniversities = shouldFallback ? localTotal : pagination?.total || 0;

  const pageStart = (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, totalUniversities);

  const featuredCount = filteredUniversities.filter((u) => u.featured).length;

  const getCountryFlag = (countryId: string) => {
    const country = countries.find((c) => c.id === countryId);
    return country?.flag || "🌍";
  };

  const clearFilters = () => {
    setRankFilter("all");
    setSortOrder("default");
    setSearchQuery("");
    setActiveCountry("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    rankFilter !== "all" || sortOrder !== "default" || searchQuery !== "" || activeCountry !== "all";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCompareToggle = (e: React.MouseEvent, uni: University) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(uni.id)) {
      removeFromCompare(uni.id);
    } else {
      addToCompare(uni);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section with Dynamic Background */}
        <section className="pt-20 relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBackground}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentBackground})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="container mx-auto px-4 relative z-10 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center mb-10"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                University Explorer
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gradient mb-4">
                Find Your Dream University
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Explore {universitiesData.length}+ top universities across 11 countries
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search universities or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-5 h-14 text-base bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/40 rounded-2xl focus:bg-white/15 focus:border-white/30"
                />
              </div>
            </motion.div>

            {/* Country Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-6"
            >
              {countries.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setActiveCountry(c.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                    activeCountry === c.id
                      ? "bg-accent text-white shadow-accent scale-105"
                      : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/10"
                  )}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="hidden sm:inline">{c.name}</span>
                </button>
              ))}
            </motion.div>

            {/* Rank + Sort Filter Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap justify-center items-center gap-3"
            >
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-white/60 shrink-0" />
                {(["all", "top10", "top50", "top100"] as RankFilter[]).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRankFilter(r)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                      rankFilter === r
                        ? "bg-accent text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {r === "all" ? "All Ranks" : r === "top10" ? "Top 10" : r === "top50" ? "Top 50" : "Top 100"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5">
                {([
                  { id: "default", label: "Default", Icon: null },
                  { id: "rank-asc", label: "Rank ↑", Icon: SortAsc },
                  { id: "rank-desc", label: "Rank ↓", Icon: SortDesc },
                ] as { id: SortOrder; label: string; Icon: React.ComponentType<{ className?: string }> | null }[]).map(
                  ({ id, label, Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSortOrder(id)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                        sortOrder === id
                          ? "bg-accent text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {label}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path
                d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H0Z"
                fill="hsl(var(--background))"
              />
            </svg>
          </div>
        </section>

        {/* Universities Grid */}
        <section className="py-12" ref={gridRef}>
          <div className="container mx-auto px-4">
            {!!error && (
              <div className="mb-6 rounded-xl border border-amber-200/40 bg-amber-50/40 px-4 py-3 text-sm text-amber-900">
                Couldn't load universities from the server. Showing offline data instead.
              </div>
            )}

            {/* Results bar */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <p className="text-muted-foreground">
                  {isLoading || (isFetching && totalUniversities === 0) ? (
                    <span className="text-muted-foreground">Loading universities...</span>
                  ) : totalUniversities > 0 ? (
                    <>
                      Showing{" "}
                      <span className="font-semibold text-foreground">
                        {pageStart}–{pageEnd}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-foreground">{totalUniversities}</span>{" "}
                      universities
                    </>
                  ) : null}
                  {featuredCount > 0 && (
                    <span className="ml-2 text-amber-500 font-medium text-sm">· {featuredCount} featured</span>
                  )}
                  {activeCountry !== "all" && (
                    <span className="ml-1">
                      {" "}in{" "}
                      <span className="font-semibold text-foreground">
                        {countries.find((c) => c.id === activeCountry)?.name}
                      </span>
                    </span>
                  )}
                </p>
                {isFetching && !isLoading && (
                  <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                )}
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-accent transition-colors underline underline-offset-2"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <UniversityCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredUniversities.length === 0 ? (
              <div className="text-center py-24">
                <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-foreground font-semibold mb-2">No universities found</p>
                <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or search query</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUniversities.map((uni, index) => {
                    const avgRating = getAverageRating(uni.id);
                    const inCompare = isInCompare(uni.id);
                    return (
                      <motion.div
                        key={`${uni.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                      >
                        <Link to={`/universities/${uni.id}`} className="block h-full">
                          <div className="university-card group h-full flex flex-col">
                            {/* Campus Image */}
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={uni.image}
                                alt={uni.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                              <div className="absolute top-3 right-3">
                                <RankingBadge
                                  rank={uni.ranking}
                                  source={uni.rankingSource}
                                  updatedAt={uni.rankingUpdatedAt}
                                  size="sm"
                                  animate={true}
                                />
                              </div>

                              {uni.featured && (
                                <div className="absolute top-3 left-3">
                                  <FeaturedBadge size="sm" />
                                </div>
                              )}

                              {/* Compare toggle */}
                              <button
                                type="button"
                                onClick={(e) => handleCompareToggle(e, uni)}
                                title={inCompare ? "Remove from compare" : isFull ? "Compare list full (max 4)" : "Add to compare"}
                                aria-label={inCompare ? `Remove ${uni.name} from compare` : `Add ${uni.name} to compare`}
                                className={cn(
                                  "absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg border",
                                  inCompare
                                    ? "bg-accent text-white border-accent"
                                    : isFull
                                    ? "bg-black/40 text-white/40 border-white/20 cursor-not-allowed"
                                    : "bg-black/40 text-white border-white/30 hover:bg-accent hover:border-accent"
                                )}
                              >
                                {inCompare ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              </button>

                              <div className="absolute bottom-4 left-4 w-14 h-14 rounded-xl bg-white shadow-lg overflow-hidden flex items-center justify-center">
                                {uni.logo.startsWith('http') ? (
                                  <img
                                    src={uni.logo}
                                    alt={`${uni.name} logo`}
                                    loading="lazy"
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <span
                                  className={cn(
                                    "text-primary font-bold text-xs",
                                    uni.logo.startsWith('http') ? 'hidden' : 'flex'
                                  )}
                                >
                                  {uni.logo}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-grow flex flex-col">
                              <div className="flex items-start gap-2 mb-3">
                                <span className="text-lg">{getCountryFlag(uni.country)}</span>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-accent transition-colors line-clamp-2">
                                    {uni.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {uni.location}
                                  </p>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-3">{uni.type}</p>

                              {avgRating > 0 && (
                                <div className="flex items-center gap-1.5 mb-3">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span className="text-sm font-medium text-foreground">{avgRating.toFixed(1)}</span>
                                  <span className="text-xs text-muted-foreground">student rating</span>
                                </div>
                              )}

                              <div className="mt-auto pt-4 border-t border-border">
                                <Button variant="outline" size="sm" className="w-full group/btn">
                                  View Details
                                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <PaginationBar
                  current={currentPage}
                  total={totalPages}
                  onChange={handlePageChange}
                />

                {totalPages > 1 && (
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Page {currentPage} of {totalPages}
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { Icon: GraduationCap, value: `${universitiesData.length}+`, label: "Partner Universities", color: "accent" },
                { Icon: Users, value: "10,000+", label: "Students Placed", color: "teal" },
                { Icon: MapPin, value: "11", label: "Countries", color: "success" },
                { Icon: TrendingUp, value: "95%", label: "Visa Success Rate", color: "primary" },
              ].map(({ Icon, value, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-${color}/10 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-7 h-7 text-${color}`} />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Comparison Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4"
          >
            <Scale className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">
              {compareList.length} {compareList.length === 1 ? "university" : "universities"} selected
            </span>
            <div className="flex gap-1.5">
              {compareList.map((u) => (
                <span key={u.id} className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                  {u.name.split(" ")[0]}
                  <button
                    type="button"
                    aria-label={`Remove ${u.name} from comparison`}
                    onClick={() => removeFromCompare(u.id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {compareList.length >= 2 && (
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-white rounded-xl h-8 px-4 text-xs"
                onClick={() => navigate("/compare")}
              >
                Compare Now
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default UniversitiesPage;
