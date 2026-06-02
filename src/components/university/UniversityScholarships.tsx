import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { getScholarships } from "@/data/universityDetailsExtension";
import { Award, Calendar, CheckCircle2, DollarSign, Filter, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UniversityScholarshipsProps {
  university: University;
}

const UniversityScholarships = ({ university }: UniversityScholarshipsProps) => {
  const scholarships = getScholarships(university.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Award className="w-8 h-8 text-accent" />
            Scholarship Discovery
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Explore funding opportunities available for international students at {university.name}.
          </p>
        </div>
        
        <Button variant="outline" className="shrink-0 bg-secondary/30">
          <Filter className="w-4 h-4 mr-2" />
          Filter Scholarships
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {scholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-6 rounded-2xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 hover:border-accent/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-accent/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
            
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {scholarship.fundingType}
                  </Badge>
                  {scholarship.probability === "High" && (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> High Probability
                    </Badge>
                  )}
                  {scholarship.probability === "Medium" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Medium Probability
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {scholarship.name}
                </h3>
                
                <p className="text-sm font-medium text-foreground/80 flex items-start gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {scholarship.eligibility}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Deadline: {scholarship.deadline}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" /> {scholarship.applicationProcess}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col lg:items-end gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-border/50 pt-4 lg:pt-0 lg:pl-6 mt-2 lg:mt-0">
                <div className="text-left lg:text-right">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Award Amount</p>
                  <p className="text-2xl font-bold text-success flex items-center lg:justify-end">
                    <DollarSign className="w-5 h-5" />
                    {scholarship.amount.replace('$', '')}
                  </p>
                </div>
                <Button className="w-full lg:w-auto bg-foreground text-background hover:bg-foreground/90">
                  Check Eligibility
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">There may be additional departmental or country-specific scholarships available.</p>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
          Talk to a Counselor for More Grants
        </Button>
      </div>
    </motion.div>
  );
};

export default UniversityScholarships;
