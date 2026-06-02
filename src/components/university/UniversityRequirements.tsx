import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { GraduationCap, CheckCircle2, FileText, FileBadge, Calendar, CalendarClock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface UniversityRequirementsProps {
  university: University;
}

const UniversityRequirements = ({ university }: UniversityRequirementsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-accent" />
          Admission Requirements
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Everything you need to prepare for a successful application to {university.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Academic Scores */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border/50 pb-2">Academic Criteria</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 transition-colors">
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Min GPA</p>
              <p className="text-3xl font-bold text-foreground mb-3">{university.requirements?.gpa || "N/A"}</p>
              <Progress value={university.requirements ? (parseFloat(university.requirements.gpa) / 4 * 100) : 0} className="h-2 bg-background" indicatorColor="bg-accent" />
            </div>
            
            <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 transition-colors">
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">IELTS</p>
              <p className="text-3xl font-bold text-foreground mb-3">{university.requirements?.ielts || "N/A"}</p>
              <Progress value={university.requirements ? (parseFloat(university.requirements.ielts) / 9 * 100) : 0} className="h-2 bg-background" indicatorColor="bg-primary" />
            </div>
            
            <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 transition-colors">
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">TOEFL</p>
              <p className="text-3xl font-bold text-foreground mb-3">{university.requirements?.toefl || "N/A"}</p>
              <Progress value={university.requirements ? (parseFloat(university.requirements.toefl) / 120 * 100) : 0} className="h-2 bg-background" indicatorColor="bg-blue-500" />
            </div>
            
            {(university.requirements?.gre || university.requirements?.gmat) ? (
              <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 transition-colors">
                <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                  {university.requirements.gre ? "GRE" : "GMAT"}
                </p>
                <p className="text-3xl font-bold text-foreground mb-3">
                  {university.requirements.gre || university.requirements.gmat}
                </p>
                <Progress 
                  value={
                    university.requirements.gre 
                      ? (parseFloat(university.requirements.gre.replace('+', '')) / 340 * 100) 
                      : (parseFloat(university.requirements.gmat!.replace('+', '')) / 800 * 100)
                  } 
                  className="h-2 bg-background" 
                  indicatorColor="bg-purple-500" 
                />
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-success/10 border border-success/20 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-8 h-8 text-success mb-2" />
                <p className="text-sm font-bold text-success">GRE/GMAT Not Mandatory</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Document Checklist & Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border/50 pb-2">Document Checklist</h3>
          
          <div className="bg-secondary/20 rounded-2xl p-6 border border-border/50">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Statement of Purpose (SOP)</p>
                  <p className="text-sm text-muted-foreground">Required for all Masters and PhD programs (1000 words max).</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Letters of Recommendation</p>
                  <p className="text-sm text-muted-foreground">2-3 LORs required (Academic or Professional).</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Updated Resume / CV</p>
                  <p className="text-sm text-muted-foreground">Highlighting relevant work experience and projects.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <FileBadge className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Portfolio (Optional)</p>
                  <p className="text-sm text-muted-foreground">Required only for Design, Arts, or Architecture programs.</p>
                </div>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border/50 pb-2 mt-8">Application Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="font-medium text-foreground">Fall Intake (September)</span>
              </div>
              <span className="text-sm font-bold bg-secondary px-3 py-1 rounded-full text-muted-foreground">Jan 15 - Mar 1</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <CalendarClock className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Spring Intake (January)</span>
              </div>
              <span className="text-sm font-bold bg-secondary px-3 py-1 rounded-full text-muted-foreground">Sep 1 - Oct 15</span>
            </div>
          </div>
        </div>
      </div>
      
      {university.requirements?.other && (
        <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-start gap-3">
          <FileText className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-accent leading-relaxed">{university.requirements.other}</p>
        </div>
      )}
    </motion.div>
  );
};

export default UniversityRequirements;
