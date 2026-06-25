import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { University } from "@/data/universities";
import {
  Cpu,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Sparkles,
  RotateCcw,
  ChevronDown,
  Info,
  Target,
  BookOpen,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UniversityEligibilityCheckerProps {
  university: University;
}

type TestType = "IELTS" | "TOEFL" | "PTE";

interface CriterionResult {
  label: string;
  userValue: number | null;
  required: number | null;
  score: number;
  maxScore: number;
  gap: number | null; // positive = gap to close, negative = surplus
  unit: string;
}

const TEST_TYPES: TestType[] = ["IELTS", "TOEFL", "PTE"];

// Convert IELTS to TOEFL and PTE equivalents (approximate)
const TOEFL_EQUIV: Record<string, number> = { "6.0": 79, "6.5": 90, "7.0": 100, "7.5": 110, "8.0": 114 };
const PTE_EQUIV: Record<string, number>   = { "6.0": 50, "6.5": 58, "7.0": 65, "7.5": 73, "8.0": 79 };

function computeEligibility(
  cgpa: string,
  englishScore: string,
  testType: TestType,
  greScore: string,
  gmatScore: string,
  experience: string,
  selectedProgram: string,
  university: University
): { totalScore: number; status: "Safe" | "Moderate" | "Ambitious" | null; criteria: CriterionResult[] } {
  const reqGpa4 = university.requirements?.gpa ? parseFloat(university.requirements.gpa) : 3.0;
  const reqGpa10 = (reqGpa4 / 4) * 10;
  const reqIelts = university.requirements?.ielts ? parseFloat(university.requirements.ielts) : 6.5;
  const reqToefl = TOEFL_EQUIV[String(reqIelts)] ?? Math.round(reqIelts * 15 - 11);
  const reqPte = PTE_EQUIV[String(reqIelts)] ?? Math.round(reqIelts * 9.5 - 7);
  const reqGre = university.requirements?.gre ? parseFloat(university.requirements.gre.replace("+", "")) : 310;
  const reqGmat = university.requirements?.gmat ? parseFloat(university.requirements.gmat.replace("+", "")) : 650;

  const parsedCgpa = cgpa ? parseFloat(cgpa) : null;
  const parsedEnglish = englishScore ? parseFloat(englishScore) : null;
  const parsedGre = greScore ? parseFloat(greScore) : null;
  const parsedGmat = gmatScore ? parseFloat(gmatScore) : null;
  const parsedExp = experience ? parseFloat(experience) : null;

  let reqEnglish = reqIelts;
  let unit = "band";
  if (testType === "TOEFL") { reqEnglish = reqToefl; unit = "pts"; }
  if (testType === "PTE")   { reqEnglish = reqPte;   unit = "pts"; }

  const criteria: CriterionResult[] = [];

  // ── CGPA (40 pts) ─────────────────────────────────────────
  let cgpaScore = 0;
  if (parsedCgpa !== null) {
    if (parsedCgpa >= reqGpa10)       cgpaScore = 40;
    else if (parsedCgpa >= reqGpa10 - 0.5) cgpaScore = 28;
    else if (parsedCgpa >= reqGpa10 - 1.0) cgpaScore = 16;
    else if (parsedCgpa >= reqGpa10 - 1.5) cgpaScore = 8;
  }
  criteria.push({
    label: "CGPA",
    userValue: parsedCgpa,
    required: reqGpa10,
    score: cgpaScore,
    maxScore: 40,
    gap: parsedCgpa !== null ? reqGpa10 - parsedCgpa : null,
    unit: "/ 10",
  });

  // ── English (25 pts) ──────────────────────────────────────
  let englishScore2 = 0;
  const slack = testType === "IELTS" ? 0.5 : testType === "TOEFL" ? 4 : 6;
  if (parsedEnglish !== null) {
    if (parsedEnglish >= reqEnglish)          englishScore2 = 25;
    else if (parsedEnglish >= reqEnglish - slack)   englishScore2 = 15;
    else if (parsedEnglish >= reqEnglish - slack * 2) englishScore2 = 5;
  }
  criteria.push({
    label: testType,
    userValue: parsedEnglish,
    required: reqEnglish,
    score: englishScore2,
    maxScore: 25,
    gap: parsedEnglish !== null ? reqEnglish - parsedEnglish : null,
    unit,
  });

  // ── GRE / GMAT (20 pts) ───────────────────────────────────
  const hasGre = parsedGre !== null;
  const hasGmat = parsedGmat !== null;
  const testScore = hasGre ? parsedGre : hasGmat ? parsedGmat : null;
  const testReq   = hasGre ? reqGre : reqGmat;
  const testSlack = hasGre ? 5 : 30;
  let aptScore = 0;
  if (testScore !== null) {
    if (testScore >= testReq)              aptScore = 20;
    else if (testScore >= testReq - testSlack)  aptScore = 12;
    else if (testScore >= testReq - testSlack * 3) aptScore = 5;
  }
  criteria.push({
    label: hasGmat ? "GMAT" : "GRE",
    userValue: testScore,
    required: hasGre ? reqGre : hasGmat ? reqGmat : reqGre,
    score: aptScore,
    maxScore: 20,
    gap: testScore !== null ? (hasGre ? reqGre : reqGmat) - testScore : null,
    unit: "pts",
  });

  // ── Work Experience (15 pts) ─────────────────────────────
  let expScore = 0;
  if (parsedExp !== null) {
    if (parsedExp >= 3)    expScore = 15;
    else if (parsedExp >= 2) expScore = 12;
    else if (parsedExp >= 1) expScore = 8;
    else if (parsedExp >= 0.5) expScore = 4;
  }
  criteria.push({
    label: "Work Exp.",
    userValue: parsedExp,
    required: null,
    score: expScore,
    maxScore: 15,
    gap: null,
    unit: "yrs",
  });

  // ── Ranking adjustment ────────────────────────────────────
  let rankPenalty = 0;
  if (university.ranking <= 10)  rankPenalty = 8;
  else if (university.ranking <= 25) rankPenalty = 5;
  else if (university.ranking <= 50) rankPenalty = 3;

  const raw = cgpaScore + englishScore2 + aptScore + expScore - rankPenalty;
  const totalScore = Math.min(Math.max(raw, 0), 100);

  if (parsedCgpa === null) return { totalScore: 0, status: null, criteria };

  const status: "Safe" | "Moderate" | "Ambitious" =
    totalScore >= 80 ? "Safe" : totalScore >= 60 ? "Moderate" : "Ambitious";

  return { totalScore, status, criteria };
}

const CriterionBar = ({ c }: { c: CriterionResult }) => {
  const pct = Math.round((c.score / c.maxScore) * 100);
  const color =
    pct === 100 ? "bg-emerald-500" :
    pct >= 60   ? "bg-amber-500"   :
    pct > 0     ? "bg-rose-500"    :
                  "bg-border";
  const textColor =
    pct === 100 ? "text-emerald-600 dark:text-emerald-400" :
    pct >= 60   ? "text-amber-600  dark:text-amber-400"    :
    pct > 0     ? "text-rose-600   dark:text-rose-400"     :
                  "text-muted-foreground";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-foreground/80">{c.label}</span>
        <span className={cn("font-semibold", textColor)}>
          {c.userValue !== null
            ? `${c.userValue} ${c.unit}`
            : "—"}
          {c.required !== null && (
            <span className="text-muted-foreground font-normal ml-1">
              / req {c.required}
            </span>
          )}
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      {c.gap !== null && c.userValue !== null && (
        <p className={cn("text-[11px]", textColor)}>
          {c.gap <= 0
            ? `✓ +${Math.abs(c.gap).toFixed(1)} ${c.unit} above requirement`
            : `↑ Need ${c.gap.toFixed(1)} more ${c.unit}`}
        </p>
      )}
    </div>
  );
};

const UniversityEligibilityChecker = ({ university }: UniversityEligibilityCheckerProps) => {
  const [cgpa, setCgpa] = useState("");
  const [englishScore, setEnglishScore] = useState("");
  const [testType, setTestType] = useState<TestType>("IELTS");
  const [greScore, setGreScore] = useState("");
  const [gmatScore, setGmatScore] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("any");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<{
    totalScore: number;
    status: "Safe" | "Moderate" | "Ambitious" | null;
    criteria: CriterionResult[];
  } | null>(null);

  const programs = university.popularPrograms?.map((p) => p.name) ?? [];

  // Recalculate whenever any input changes (live)
  useEffect(() => {
    if (!cgpa) { setResult(null); return; }
    const r = computeEligibility(cgpa, englishScore, testType, greScore, gmatScore, experience, selectedProgram, university);
    setResult(r);
  }, [cgpa, englishScore, testType, greScore, gmatScore, experience, selectedProgram, university]);

  const handleReset = () => {
    setCgpa(""); setEnglishScore(""); setGreScore(""); setGmatScore(""); setExperience(""); setSelectedProgram("any"); setResult(null);
  };

  const { status, totalScore, criteria } = result ?? { status: null, totalScore: 0, criteria: [] };

  const statusConfig = {
    Safe:      { color: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-500/30", bg10: "bg-emerald-500/10", icon: ShieldCheck, ring: "text-emerald-500", tip: "Strong profile. Apply early with a standout SOP.", action: "Apply in Round 1 for best chances" },
    Moderate:  { color: "text-amber-500",   bg: "bg-amber-500",   border: "border-amber-500/30",   bg10: "bg-amber-500/10",   icon: AlertTriangle, ring: "text-amber-500",   tip: "Fair chance. Strong LORs and SOP can tip the scale.",      action: "Strengthen your SOP & get strong LORs" },
    Ambitious: { color: "text-rose-500",    bg: "bg-rose-500",    border: "border-rose-500/30",    bg10: "bg-rose-500/10",    icon: XCircle,       ring: "text-rose-500",    tip: "Highly competitive. Apply alongside safer backups.",       action: "Include 2-3 safe universities in your list" },
  };
  const cfg = status ? statusConfig[status] : null;
  const StatusIcon = cfg?.icon ?? Cpu;

  const reqGpaDisplay = (() => {
    const v = university.requirements?.gpa;
    if (!v) return "3.0 / 4.0";
    const n = parseFloat(v);
    return `${((n / 4) * 10).toFixed(1)} / 10`;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl premium-card p-8 lg:p-10 border border-border/50"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-1">
              <Cpu className="w-6 h-6 text-accent" />
              Eligibility Intelligence
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter your profile to see your admission chances at {university.name}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Requirements quick reference */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/60 border border-border/50 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Min. GPA {reqGpaDisplay} · IELTS {university.requirements?.ielts ?? "6.5"} · {university.requirements?.gre ? `GRE ${university.requirements.gre}` : "GRE optional"}</span>
            </div>
            {result && (
              <button type="button" onClick={handleReset} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="Reset form">
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Input Form ─────────────────────────────── */}
          <div className="space-y-5">
            {/* Program selector */}
            {programs.length > 0 && (
              <div className="space-y-2">
                <Label className="text-foreground/80 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Target Program
                </Label>
                <div className="relative">
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    title="Select target program"
                    aria-label="Select target program"
                    className="w-full h-10 px-3 pr-8 rounded-lg border border-border bg-background text-sm text-foreground appearance-none focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="any">Any Program</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}

            {/* CGPA */}
            <div className="space-y-2">
              <Label htmlFor="cgpa" className="text-foreground/80">CGPA <span className="text-muted-foreground font-normal">(out of 10)</span></Label>
              <Input
                id="cgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="e.g. 8.5"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-accent"
              />
            </div>

            {/* English Test */}
            <div className="space-y-2">
              <Label className="text-foreground/80">English Proficiency</Label>
              <div className="flex gap-2 mb-2">
                {TEST_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTestType(t)}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                      testType === t
                        ? "bg-accent text-white border-accent"
                        : "border-border text-muted-foreground hover:border-accent/40"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                step={testType === "IELTS" ? "0.5" : "1"}
                min="0"
                max={testType === "IELTS" ? "9" : testType === "TOEFL" ? "120" : "90"}
                placeholder={testType === "IELTS" ? "e.g. 7.5" : testType === "TOEFL" ? "e.g. 105" : "e.g. 68"}
                value={englishScore}
                onChange={(e) => setEnglishScore(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-accent"
              />
            </div>

            {/* GRE */}
            <div className="space-y-2">
              <Label htmlFor="gre" className="text-foreground/80">
                GRE Score <span className="text-muted-foreground font-normal">(optional, 260–340)</span>
              </Label>
              <Input
                id="gre"
                type="number"
                min="260"
                max="340"
                placeholder="e.g. 320"
                value={greScore}
                onChange={(e) => { setGreScore(e.target.value); if (e.target.value) setGmatScore(""); }}
                className="bg-background/50 border-border/50 focus:border-accent"
              />
            </div>

            {/* Advanced: GMAT + Work Exp */}
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-2 text-xs text-accent font-medium hover:opacity-80 transition-opacity"
            >
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAdvanced && "rotate-180")} />
              {showAdvanced ? "Hide" : "Show"} GMAT & Work Experience
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="gmat" className="text-foreground/80">
                      GMAT <span className="text-muted-foreground font-normal">(optional, 200–800)</span>
                    </Label>
                    <Input
                      id="gmat"
                      type="number"
                      min="200"
                      max="800"
                      placeholder="e.g. 680"
                      value={gmatScore}
                      onChange={(e) => { setGmatScore(e.target.value); if (e.target.value) setGreScore(""); }}
                      className="bg-background/50 border-border/50 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-foreground/80">Work Experience <span className="text-muted-foreground font-normal">(years)</span></Label>
                    <Input
                      id="experience"
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="e.g. 2"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-accent"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Result Panel ──────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Score ring */}
            <div className="glass-dark rounded-2xl p-6 text-center border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <AnimatePresence mode="wait">
                {status ? (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative z-10">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <svg className="w-28 h-28 transform -rotate-90">
                          <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="7" fill="transparent" className="text-white/10" />
                          <motion.circle
                            cx="56" cy="56" r="50"
                            stroke="currentColor" strokeWidth="7" fill="transparent"
                            strokeDasharray={314}
                            initial={{ strokeDashoffset: 314 }}
                            animate={{ strokeDashoffset: 314 - (314 * totalScore) / 100 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className={cfg?.ring ?? "text-accent"}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-3xl font-bold text-white">{totalScore}%</span>
                          <span className="text-[10px] text-white/50 font-medium uppercase tracking-widest">score</span>
                        </div>
                      </div>
                    </div>
                    <div className={cn("px-4 py-1.5 rounded-full border mb-3 font-bold text-sm inline-flex items-center gap-2", cfg?.bg10, cfg?.color, cfg?.border)}>
                      <StatusIcon className="w-4 h-4" />
                      {status} Match
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed mb-4">{cfg?.tip}</p>
                    <div className={cn("flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg", cfg?.bg10, cfg?.color)}>
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      {cfg?.action}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="relative z-10 flex flex-col items-center py-4">
                    <Target className="w-14 h-14 text-white mb-3" />
                    <p className="text-sm text-white/70 font-medium">Enter your CGPA to see your match score.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Per-criterion breakdown */}
            {criteria.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-secondary/40 border border-border/50 p-5 space-y-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Score Breakdown
                </div>
                {criteria.map((c) => (
                  <CriterionBar key={c.label} c={c} />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Boost Tips banner — always shown */}
        <div className="rounded-2xl bg-accent/5 border border-accent/20 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">How to strengthen your application</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-1.5"><span className="text-accent mt-0.5">→</span>Tailor your SOP to align with {university.name}'s research focus</li>
                <li className="flex items-start gap-1.5"><span className="text-accent mt-0.5">→</span>Request LORs from professors or senior managers who know your work well</li>
                <li className="flex items-start gap-1.5"><span className="text-accent mt-0.5">→</span>Apply in the earliest available round — admit rates drop in later rounds</li>
                <li className="flex items-start gap-1.5"><span className="text-accent mt-0.5">→</span>Retake GRE/IELTS if you're within 5–10 points of the required score</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityEligibilityChecker;
