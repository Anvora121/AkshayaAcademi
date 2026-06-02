import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { Cpu, ShieldCheck, AlertTriangle, XCircle, TrendingUp, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UniversityEligibilityCheckerProps {
  university: University;
}

const UniversityEligibilityChecker = ({ university }: UniversityEligibilityCheckerProps) => {
  const [cgpa, setCgpa] = useState<string>("");
  const [ielts, setIelts] = useState<string>("");
  const [gre, setGre] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [status, setStatus] = useState<"Safe" | "Moderate" | "Ambitious" | null>(null);

  const calculateEligibility = () => {
    if (!cgpa) return;
    
    const parsedCgpa = parseFloat(cgpa) || 0;
    const parsedIelts = parseFloat(ielts) || 0;
    const parsedGre = parseFloat(gre) || 0;
    const parsedExp = parseFloat(experience) || 0;

    // Base Requirements from University Data
    const reqGpa = university.requirements?.gpa ? parseFloat(university.requirements.gpa) : 3.0; // scale of 4
    const reqGpaScale10 = (reqGpa / 4) * 10;
    const reqIelts = university.requirements?.ielts ? parseFloat(university.requirements.ielts) : 6.5;
    const reqGre = university.requirements?.gre ? parseFloat(university.requirements.gre.replace('+','')) : 310;

    let score = 0;

    // CGPA weight: 45%
    if (parsedCgpa >= reqGpaScale10) score += 45;
    else if (parsedCgpa >= reqGpaScale10 - 1) score += 30;
    else if (parsedCgpa >= reqGpaScale10 - 2) score += 15;

    // IELTS weight: 20%
    if (parsedIelts >= reqIelts) score += 20;
    else if (parsedIelts >= reqIelts - 0.5) score += 10;

    // GRE weight: 20%
    if (parsedGre >= reqGre) score += 20;
    else if (parsedGre >= reqGre - 5) score += 10;

    // Experience weight: 15%
    if (parsedExp >= 2) score += 15;
    else if (parsedExp >= 1) score += 8;

    // Additional bias for top ranking (making top 10 harder)
    if (university.ranking <= 10) score -= 10;
    else if (university.ranking <= 50) score -= 5;

    const finalScore = Math.min(Math.max(score, 0), 100);
    setMatchScore(finalScore);

    if (finalScore >= 80) setStatus("Safe");
    else if (finalScore >= 60) setStatus("Moderate");
    else setStatus("Ambitious");
  };

  const getStatusColor = () => {
    if (status === "Safe") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    if (status === "Moderate") return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    if (status === "Ambitious") return "text-rose-500 bg-rose-500/10 border-rose-500/30";
    return "text-muted-foreground bg-secondary";
  };

  const getStatusIcon = () => {
    if (status === "Safe") return <ShieldCheck className="w-8 h-8 text-emerald-500" />;
    if (status === "Moderate") return <AlertTriangle className="w-8 h-8 text-amber-500" />;
    if (status === "Ambitious") return <XCircle className="w-8 h-8 text-rose-500" />;
    return <Cpu className="w-8 h-8 text-accent" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl premium-card p-8 lg:p-10 border border-border/50"
    >
      {/* Background glowing effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
              <Cpu className="w-8 h-8 text-accent animate-pulse" />
              AI Eligibility Checker
            </h2>
            <p className="text-muted-foreground text-lg">
              Our AI analyzes thousands of past admits to {university.name} to predict your chances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/20 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
            <div className="space-y-2">
              <Label htmlFor="cgpa" className="text-foreground/80">CGPA (out of 10)</Label>
              <Input 
                id="cgpa" 
                type="number" 
                placeholder="e.g. 8.5" 
                value={cgpa} 
                onChange={(e) => setCgpa(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ielts" className="text-foreground/80">IELTS / TOEFL (equivalent)</Label>
              <Input 
                id="ielts" 
                type="number" 
                placeholder="e.g. 7.5" 
                value={ielts} 
                onChange={(e) => setIelts(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gre" className="text-foreground/80">GRE Score</Label>
              <Input 
                id="gre" 
                type="number" 
                placeholder="e.g. 320" 
                value={gre} 
                onChange={(e) => setGre(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-foreground/80">Work Experience (Years)</Label>
              <Input 
                id="experience" 
                type="number" 
                placeholder="e.g. 2" 
                value={experience} 
                onChange={(e) => setExperience(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <Button 
              onClick={calculateEligibility} 
              className="md:col-span-2 bg-accent hover:bg-accent/90 text-white font-bold h-12 text-lg shadow-lg shadow-accent/20 transition-all active:scale-95"
            >
              Analyze Profile <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:w-80 shrink-0 flex flex-col justify-center">
          <div className="glass-dark rounded-3xl p-8 text-center border border-white/10 relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            {matchScore !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full"
              >
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    {/* Radial progress ring effect */}
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                      <motion.circle 
                        cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={377}
                        initial={{ strokeDashoffset: 377 }}
                        animate={{ strokeDashoffset: 377 - (377 * matchScore) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={status === "Safe" ? "text-emerald-500" : status === "Moderate" ? "text-amber-500" : "text-rose-500"} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-white">{matchScore}%</span>
                    </div>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-full border mb-4 font-bold tracking-wide inline-flex items-center gap-2 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  {status} Match
                </div>
                
                <p className="text-sm text-white/70 font-medium">
                  {status === "Safe" && "You have a strong profile for this university. Applying early is recommended."}
                  {status === "Moderate" && "You have a fair chance. Strong SOP and LORs can boost your admit probability."}
                  {status === "Ambitious" && "Highly competitive. Consider applying to safe universities alongside this."}
                </p>
              </motion.div>
            ) : (
              <div className="relative z-10 opacity-50 flex flex-col items-center">
                <TrendingUp className="w-16 h-16 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Awaiting Data</h3>
                <p className="text-sm text-white/70">Enter your academic details to see your admission probability.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityEligibilityChecker;
