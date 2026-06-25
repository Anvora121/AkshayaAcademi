import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/contexts/ComparisonContext";
import type { University } from "@/hooks/useUniversities";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  Scale,
  X,
  Plus,
  GraduationCap,
  MapPin,
  TrendingUp,
  DollarSign,
  BookOpen,
  Briefcase,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { universitiesData } from "@/data/universities";
import { cn } from "@/lib/utils";

const NA = "N/A";

const getValue = (val: string | number | undefined | null) =>
  val !== undefined && val !== null && val !== "" ? String(val) : NA;

interface Row {
  label: string;
  icon: React.ReactNode;
  getValue: (u: University) => string;
  highlight?: boolean;
}

const ROWS: Row[] = [
  {
    label: "Global Ranking",
    icon: <TrendingUp className="w-4 h-4" />,
    getValue: (u) => u.ranking ? `#${u.ranking}` : NA,
    highlight: true,
  },
  {
    label: "Type",
    icon: <GraduationCap className="w-4 h-4" />,
    getValue: (u) => getValue(u.type),
  },
  {
    label: "Location",
    icon: <MapPin className="w-4 h-4" />,
    getValue: (u) => getValue(u.location),
  },
  {
    label: "Founded",
    icon: <BookOpen className="w-4 h-4" />,
    getValue: (u) => getValue(u.founded),
  },
  {
    label: "Total Students",
    icon: <GraduationCap className="w-4 h-4" />,
    getValue: (u) => getValue(u.students),
  },
  {
    label: "Acceptance Rate",
    icon: <CheckCircle className="w-4 h-4" />,
    getValue: (u) => getValue(u.acceptanceRate),
    highlight: true,
  },
  {
    label: "Tuition Range",
    icon: <DollarSign className="w-4 h-4" />,
    getValue: (u) => getValue(u.tuitionRange),
    highlight: true,
  },
  {
    label: "Min. GPA",
    icon: <BookOpen className="w-4 h-4" />,
    getValue: (u) => getValue(u.requirements?.gpa),
  },
  {
    label: "IELTS Required",
    icon: <BookOpen className="w-4 h-4" />,
    getValue: (u) => getValue(u.requirements?.ielts),
  },
  {
    label: "TOEFL Required",
    icon: <BookOpen className="w-4 h-4" />,
    getValue: (u) => getValue(u.requirements?.toefl),
  },
  {
    label: "GRE Required",
    icon: <BookOpen className="w-4 h-4" />,
    getValue: (u) => getValue(u.requirements?.gre),
  },
  {
    label: "Employment Rate",
    icon: <Briefcase className="w-4 h-4" />,
    getValue: (u) => getValue(u.careerOutcomes?.employmentRate),
    highlight: true,
  },
  {
    label: "Avg. Salary",
    icon: <DollarSign className="w-4 h-4" />,
    getValue: (u) => getValue(u.careerOutcomes?.avgSalary),
    highlight: true,
  },
];

const UniversityComparisonPage = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare, addToCompare, isFull } = useComparison();

  usePageMeta({
    title: "Compare Universities",
    description: "Side-by-side comparison of rankings, fees, eligibility, and career outcomes.",
    canonicalPath: "/compare",
  });

  // Suggestions: universities NOT already in the list, same countries
  const suggestions = (universitiesData as unknown as University[])
    .filter((u) => !compareList.find((c) => c.id === u.id))
    .slice(0, 6);

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 text-center max-w-xl">
            <Scale className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-3">No Universities Selected</h1>
            <p className="text-muted-foreground mb-8">
              Browse universities and click the <strong>+ compare</strong> button on any card to start comparing.
            </p>
            <Button onClick={() => navigate("/universities")} className="bg-accent hover:bg-accent/90">
              <GraduationCap className="w-4 h-4 mr-2" />
              Browse Universities
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Go back"
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Scale className="w-6 h-6 text-accent" />
                  University Comparison
                </h1>
                <p className="text-sm text-muted-foreground">
                  Comparing {compareList.length} {compareList.length === 1 ? "university" : "universities"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearCompare}
                className="text-muted-foreground"
              >
                Clear All
              </Button>
              {!isFull && (
                <Button
                  type="button"
                  size="sm"
                  className="bg-accent hover:bg-accent/90"
                  onClick={() => navigate("/universities")}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add University
                </Button>
              )}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-secondary/40">
                  <th className="text-left p-4 font-semibold text-muted-foreground text-sm w-40 border-b border-border/50">
                    Criteria
                  </th>
                  {compareList.map((uni) => (
                    <th key={uni.id} className="p-4 border-b border-border/50 text-center min-w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-white shadow border border-border/50 overflow-hidden flex items-center justify-center p-1">
                          {uni.logo?.startsWith("http") ? (
                            <img src={uni.logo} alt={uni.name} loading="lazy" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-primary font-bold text-xs">{uni.logo}</span>
                          )}
                        </div>
                        <Link
                          to={`/universities/${uni.id}`}
                          className="font-semibold text-foreground hover:text-accent transition-colors text-sm leading-tight line-clamp-2"
                        >
                          {uni.name}
                        </Link>
                        <button
                          type="button"
                          aria-label={`Remove ${uni.name} from comparison`}
                          onClick={() => removeFromCompare(uni.id)}
                          className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                  {/* Empty slot placeholder */}
                  {!isFull && (
                    <th className="p-4 border-b border-border/50 text-center min-w-[160px]">
                      <button
                        type="button"
                        onClick={() => navigate("/universities")}
                        className="flex flex-col items-center gap-2 mx-auto text-muted-foreground hover:text-accent transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl border-2 border-dashed border-border group-hover:border-accent flex items-center justify-center transition-colors">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs">Add University</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, rowIndex) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-b border-border/30 transition-colors hover:bg-secondary/20",
                      row.highlight && "bg-accent/5",
                      rowIndex % 2 === 0 && !row.highlight && "bg-background"
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <span className="text-accent">{row.icon}</span>
                        {row.label}
                      </div>
                    </td>
                    {compareList.map((uni) => {
                      const val = row.getValue(uni);
                      return (
                        <td key={uni.id} className="p-4 text-center">
                          <span className={cn(
                            "text-sm font-medium",
                            val === NA ? "text-muted-foreground/40" : row.highlight ? "text-foreground font-semibold" : "text-foreground"
                          )}>
                            {val}
                          </span>
                        </td>
                      );
                    })}
                    {!isFull && <td className="p-4" />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA row */}
          <div className="mt-2 overflow-x-auto">
            <div
              className="grid gap-4 min-w-[600px]"
              style={{ gridTemplateColumns: `160px repeat(${compareList.length}, 1fr)${!isFull ? " 160px" : ""}` }}
            >
              <div />
              {compareList.map((uni) => (
                <div key={uni.id} className="p-2 text-center">
                  <Link to={`/universities/${uni.id}`}>
                    <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-foreground mb-4">Add More Universities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {suggestions.map((uni) => (
                  <motion.button
                    key={uni.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    disabled={isFull}
                    onClick={() => addToCompare(uni)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border border-border/50 text-center transition-all",
                      isFull
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-accent hover:shadow-sm bg-card"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow border border-border/30 overflow-hidden flex items-center justify-center p-1">
                      {uni.logo?.startsWith("http") ? (
                        <img src={uni.logo} alt={uni.name} loading="lazy" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-primary font-bold text-xs">{uni.logo}</span>
                      )}
                    </div>
                    <span className="text-xs text-foreground font-medium line-clamp-2 leading-tight">{uni.name}</span>
                    <span className="text-xs text-accent flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityComparisonPage;
