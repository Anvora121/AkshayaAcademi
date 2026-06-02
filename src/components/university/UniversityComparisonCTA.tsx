import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { Scale, ArrowRight, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UniversityComparisonCTAProps {
  university: University;
}

const UniversityComparisonCTA = ({ university }: UniversityComparisonCTAProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-accent to-purple-600 text-white shadow-xl shadow-accent/20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center md:justify-start gap-3">
            <Scale className="w-10 h-10" />
            Compare {university.name}
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto md:mx-0">
            Unsure if this is the perfect fit? Compare rankings, tuition fees, scholarships, and post-graduation salaries with other top universities instantly.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 text-sm font-medium text-white/90">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4" /> Rankings
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4" /> Fees & Costs
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4" /> Salaries
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4" /> Visa Success
            </span>
          </div>
        </div>
        
        <div className="shrink-0 w-full md:w-auto">
          <Button size="lg" className="w-full md:w-auto bg-white text-accent hover:bg-white/90 h-14 px-8 text-lg font-bold shadow-xl transition-transform active:scale-95 group">
            <Zap className="w-5 h-5 mr-2 text-amber-500" />
            Compare Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityComparisonCTA;
