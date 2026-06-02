import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { Briefcase, TrendingUp, DollarSign, Award, Building2 } from "lucide-react";
import PlacementOffersTable from "./PlacementOffersTable";
import { getPlacementsForUniversity, getUniversityCTCStats, getCountryBenchmark } from "@/data/mockPlacements";

interface UniversityPlacementsProps {
  university: University;
}

const UniversityPlacements = ({ university }: UniversityPlacementsProps) => {
  const placements = getPlacementsForUniversity(university.id);
  const ctcStats = getUniversityCTCStats(university.id);
  const benchmark = getCountryBenchmark(university.country);
  
  // Logos for top recruiters (generic map for UI premium feel)
  const companyLogos: Record<string, string> = {
    "Google": "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
    "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "Amazon": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "Apple": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "Tesla": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
    "Goldman Sachs": "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
    "McKinsey": "https://upload.wikimedia.org/wikipedia/commons/7/77/McKinsey_%26_Company_Logo.svg"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-accent" />
          Placements & Career Outcomes
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Discover where graduates from {university.name} are working today.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="p-6 rounded-2xl bg-success/10 border border-success/20 text-center hover:bg-success/20 transition-colors">
          <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
          <p className="text-3xl font-bold text-foreground mb-1">{university.careerOutcomes?.employmentRate || "92%"}</p>
          <p className="text-sm font-medium text-muted-foreground">Employment Rate</p>
        </div>
        <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 text-center hover:bg-accent/20 transition-colors">
          <DollarSign className="w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-3xl font-bold text-foreground mb-1">
            {ctcStats.currency} {ctcStats.average.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-muted-foreground">Average Salary</p>
        </div>
        <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center hover:bg-purple-500/20 transition-colors">
          <Award className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-foreground mb-1">
            {ctcStats.currency} {ctcStats.highest.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-muted-foreground">Highest Package</p>
        </div>
        <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center hover:bg-blue-500/20 transition-colors">
          <Building2 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-foreground mb-1">95%</p>
          <p className="text-sm font-medium text-muted-foreground">Internship Rate</p>
        </div>
      </div>

      {/* Top Recruiters Marquee style or grid */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-foreground mb-4">Top Recruiting Companies</h3>
        <div className="flex flex-wrap gap-4 items-center">
          {university.careerOutcomes?.topEmployers?.map((employer, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 bg-secondary/50 rounded-xl border border-border/50">
              {companyLogos[employer] && (
                <img src={companyLogos[employer]} alt={employer} className="h-6 object-contain filter dark:invert" />
              )}
              <span className="font-semibold text-foreground">{employer}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Placement Table component already existing in the project */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Recent Placement Offers</h3>
        <div className="bg-background rounded-2xl border border-border/50 overflow-hidden">
          <PlacementOffersTable
            universityId={university.id}
            offers={placements}
            medianCTC={ctcStats.median}
            averageCTC={ctcStats.average}
            currency={ctcStats.currency}
            benchmark={benchmark}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityPlacements;
