import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { useUniversities } from "@/hooks/useUniversities";
import { universitiesData } from "@/data/universities";
import { MapPin, Trophy, Wallet, Percent, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import RankingBadge from "@/components/ui/RankingBadge";
import { cn } from "@/lib/utils";

interface SimilarUniversitiesProps {
  university: University;
}

type FilterTab = "best" | "country" | "ranking" | "budget";

interface ScoredUniversity {
  university: University;
  score: number;
  reasons: string[];
}

// ── Tuition tier ──────────────────────────────────────────────────────────────
function tuitionTier(range: string | undefined): number {
  if (!range) return -1;
  const match = range.match(/\$?([\d,]+)/);
  if (!match) return -1;
  const val = parseInt(match[1].replace(/,/g, ""), 10);
  if (val < 15_000) return 0;
  if (val < 25_000) return 1;
  if (val < 40_000) return 2;
  if (val < 60_000) return 3;
  return 4;
}

const TUITION_LABEL = ["< $15K/yr", "$15–25K/yr", "$25–40K/yr", "$40–60K/yr", "> $60K/yr"];

// ── Acceptance rate tier ──────────────────────────────────────────────────────
function acceptanceTier(rate: string | undefined): number {
  if (!rate) return -1;
  const val = parseFloat(rate);
  if (isNaN(val)) return -1;
  if (val < 10) return 0;
  if (val < 20) return 1;
  if (val < 35) return 2;
  return 3;
}

// ── GPA proximity ─────────────────────────────────────────────────────────────
function gpaVal(uni: University): number {
  const v = uni.requirements?.gpa;
  if (!v) return -1;
  return parseFloat(v);
}

// ── Core similarity scorer ────────────────────────────────────────────────────
function scoreSimilarity(ref: University, candidate: University): { score: number; reasons: string[] } {
  if (candidate.id === ref.id) return { score: -1, reasons: [] };

  let score = 0;
  const reasons: string[] = [];

  // Ranking proximity (30 pts)
  const diff = Math.abs(ref.ranking - candidate.ranking);
  if (diff <= 10)       { score += 30; reasons.push(`#${candidate.ranking} (±${diff} ranks)`); }
  else if (diff <= 25)  { score += 22; reasons.push(`#${candidate.ranking} (±${diff} ranks)`); }
  else if (diff <= 50)  { score += 15; reasons.push(`#${candidate.ranking} (similar tier)`); }
  else if (diff <= 100) { score += 8;  }

  // Country match (25 pts)
  if (candidate.country === ref.country) {
    score += 25;
    reasons.push(candidate.countryName || candidate.country);
  }

  // University type (15 pts)
  if (candidate.type && ref.type && candidate.type === ref.type) {
    score += 15;
    reasons.push(candidate.type);
  }

  // Tuition tier (15 pts)
  const tRef = tuitionTier(ref.tuitionRange);
  const tCand = tuitionTier(candidate.tuitionRange);
  if (tRef >= 0 && tCand >= 0) {
    const tierDiff = Math.abs(tRef - tCand);
    if (tierDiff === 0) { score += 15; reasons.push(TUITION_LABEL[tCand]); }
    else if (tierDiff === 1) { score += 7; }
  }

  // Acceptance rate tier (10 pts)
  const aRef = acceptanceTier(ref.acceptanceRate);
  const aCand = acceptanceTier(candidate.acceptanceRate);
  if (aRef >= 0 && aCand >= 0) {
    const aDiff = Math.abs(aRef - aCand);
    if (aDiff === 0)      { score += 10; reasons.push(`${candidate.acceptanceRate} admit rate`); }
    else if (aDiff === 1) { score += 4;  }
  }

  // GPA requirement proximity (5 pts)
  const gRef  = gpaVal(ref);
  const gCand = gpaVal(candidate);
  if (gRef >= 0 && gCand >= 0) {
    const gDiff = Math.abs(gRef - gCand);
    if (gDiff < 0.3)      score += 5;
    else if (gDiff < 0.6) score += 2;
  }

  return { score, reasons: reasons.slice(0, 3) };
}

// ── Filter helpers ────────────────────────────────────────────────────────────
function applyFilter(list: ScoredUniversity[], tab: FilterTab, ref: University): ScoredUniversity[] {
  switch (tab) {
    case "country":
      return list.filter((s) => s.university.country === ref.country);
    case "ranking":
      return list.filter((s) => Math.abs(s.university.ranking - ref.ranking) <= 50);
    case "budget":
      return list.filter((s) => tuitionTier(s.university.tuitionRange) === tuitionTier(ref.tuitionRange));
    default:
      return list;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
const FILTER_TABS: { id: FilterTab; label: string; icon: React.ElementType }[] = [
  { id: "best",    label: "Best Match",      icon: Sparkles },
  { id: "country", label: "Same Country",    icon: MapPin   },
  { id: "ranking", label: "Similar Ranking", icon: Trophy   },
  { id: "budget",  label: "Similar Budget",  icon: Wallet   },
];

const SimilarUniversities = ({ university }: SimilarUniversitiesProps) => {
  const [activeTab, setActiveTab] = useState<FilterTab>("best");
  const { data: apiList } = useUniversities();
  const allUniversities = (apiList && apiList.length > 0 ? apiList : universitiesData) as University[];

  const ranked = useMemo<ScoredUniversity[]>(() => {
    return allUniversities
      .map((u) => {
        const { score, reasons } = scoreSimilarity(university, u);
        return { university: u, score, reasons };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [allUniversities, university]);

  const visible = useMemo(() => {
    const filtered = applyFilter(ranked, activeTab, university);
    return filtered.slice(0, 6);
  }, [ranked, activeTab, university]);

  if (ranked.length === 0) return null;

  const scoreColor = (score: number) =>
    score >= 70 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
    score >= 45 ? "text-amber-600  dark:text-amber-400  bg-amber-500/10  border-amber-500/20"  :
                  "text-blue-600   dark:text-blue-400   bg-blue-500/10   border-blue-500/20";

  const scoreLabel = (score: number) =>
    score >= 70 ? "Strong Match" : score >= 45 ? "Good Match" : "Possible Match";

  return (
    <section className="py-16 bg-secondary/20 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Similar Universities
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Matched by ranking, country, type, budget, and requirements.
            </p>
          </div>
          <Link to="/universities">
            <Button variant="link" className="text-accent gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-7">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const count = applyFilter(ranked, tab.id, university).length;
            if (count === 0 && tab.id !== "best") return null;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all",
                  activeTab === tab.id
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground bg-background"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={cn(
                  "ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
                )}>
                  {count > 6 ? "6+" : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No universities match this filter. Try "Best Match" instead.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(({ university: uni, score, reasons }, idx) => (
              <motion.div
                key={uni.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
              >
                <Link to={`/universities/${uni.id}`} className="block h-full group">
                  <div className="premium-card p-0 overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={uni.image}
                        alt={uni.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Ranking badge */}
                      <div className="absolute top-3 right-3">
                        <RankingBadge rank={uni.ranking} source={uni.rankingSource} updatedAt={uni.rankingUpdatedAt} size="sm" animate={false} />
                      </div>

                      {/* Match score badge */}
                      <div className={cn(
                        "absolute top-3 left-3 px-2 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-sm",
                        scoreColor(score)
                      )}>
                        {scoreLabel(score)}
                      </div>

                      {/* Logo + name */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-lg overflow-hidden flex items-center justify-center p-1 shrink-0">
                          {uni.logo.startsWith("http") ? (
                            <img src={uni.logo} alt={uni.name} loading="lazy" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-primary font-bold text-xs">{uni.logo}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-sm leading-tight line-clamp-1 group-hover:text-accent/90 transition-colors">{uni.name}</h3>
                          <p className="text-xs text-white/70 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {uni.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 space-y-3">
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-secondary/50 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Type</p>
                          <p className="text-xs font-semibold text-foreground line-clamp-1">{uni.type ?? "—"}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center justify-center gap-0.5"><Percent className="w-2.5 h-2.5" />Admit</p>
                          <p className="text-xs font-semibold text-foreground">{uni.acceptanceRate ?? "—"}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Tuition</p>
                          <p className="text-xs font-semibold text-foreground line-clamp-1">{uni.tuitionRange?.split(" ")[0] ?? "—"}</p>
                        </div>
                      </div>

                      {/* Why similar tags */}
                      {reasons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {reasons.map((r) => (
                            <span key={r} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold border border-accent/20">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SimilarUniversities;
