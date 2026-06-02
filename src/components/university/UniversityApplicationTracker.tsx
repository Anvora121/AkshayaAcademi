import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { ListChecks, FileText, UploadCloud, Plane, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UniversityApplicationTrackerProps {
  university: University;
}

const UniversityApplicationTracker = ({ university }: UniversityApplicationTrackerProps) => {
  const steps = [
    { icon: FileText, title: "Profile Analysis", desc: "AI evaluating your scores", status: "completed" },
    { icon: UploadCloud, title: "Document Upload", desc: "SOP, LORs, Transcripts", status: "current" },
    { icon: ListChecks, title: "Application Sent", desc: "To university portal", status: "pending" },
    { icon: Video, title: "Interview / Offer", desc: "Awaiting decision", status: "pending" },
    { icon: ShieldCheck, title: "Visa Processing", desc: "Mock interviews & prep", status: "pending" },
    { icon: Plane, title: "Ready to Fly", desc: "Pre-departure briefing", status: "pending" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ListChecks className="w-8 h-8 text-accent" />
            Premium Application Workflow
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            See exactly how we help you get into {university.name}.
          </p>
        </div>
        <Link to="/premium-plans">
          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white shrink-0">
            View Premium Plans
          </Button>
        </Link>
      </div>

      <div className="relative">
        {/* Continuous Line */}
        <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-border/50 hidden md:block" />
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-6 group ${step.status === "pending" ? "opacity-60 grayscale" : ""}`}
            >
              <div className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-colors ${
                step.status === "completed" ? "bg-accent text-white border-accent" :
                step.status === "current" ? "bg-background text-accent border-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]" :
                "bg-secondary/50 text-muted-foreground border-border/50"
              }`}>
                <step.icon className={`w-8 h-8 ${step.status === "current" ? "animate-pulse" : ""}`} />
              </div>
              
              <div className={`flex-1 p-6 rounded-2xl border transition-all duration-300 ${
                step.status === "current" ? "bg-accent/5 border-accent/30 shadow-md scale-[1.02]" :
                "bg-secondary/20 border-border/50 group-hover:bg-secondary/40"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  {step.status === "completed" && <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded">Done</span>}
                  {step.status === "current" && <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-1 rounded">In Progress</span>}
                </div>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityApplicationTracker;
