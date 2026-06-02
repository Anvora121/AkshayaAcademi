import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { University } from "@/data/universities";
import { getExtendedCourses } from "@/data/universityDetailsExtension";
import { BookOpen, Clock, DollarSign, Briefcase, Search, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface UniversityCoursesProps {
  university: University;
}

const UniversityCourses = ({ university }: UniversityCoursesProps) => {
  const courses = getExtendedCourses(university.id);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Undergraduate", "Masters", "MBA", "PhD"];

  const filteredCourses = courses.filter(c => {
    const matchesTab = activeTab === "All" || c.degreeLevel === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent" />
            Courses Intelligence
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Explore AI-curated program details, employability scores, and tuition fees.
          </p>
        </div>
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search programs..." 
            className="pl-9 bg-secondary/30 border-border/50 focus:border-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
              activeTab === cat 
                ? "bg-accent text-white border-accent shadow-md shadow-accent/20"
                : "bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex bg-secondary/20">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={course.name}
                className="p-6 rounded-2xl bg-gradient-to-r from-secondary/40 to-transparent border border-border/50 hover:border-accent/30 transition-colors group relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] -z-10 group-hover:bg-accent/10 transition-colors" />
                
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
                        {course.degreeLevel}
                      </span>
                      {course.stemEligible && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold tracking-wide flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> STEM Eligible
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-semibold">
                        Global Rank #{course.ranking}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.department}
                    </p>
                    
                    <div className="flex items-center gap-5 text-sm font-medium flex-wrap">
                      <span className="flex items-center gap-1.5 text-foreground/80">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5 text-foreground/80">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        {course.tuitionFee}
                      </span>
                      <span className="flex items-center gap-1.5 text-foreground/80">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        {course.employmentRate} Employability
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0">
                    <div className="glass-dark rounded-lg p-3 text-center bg-background border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Avg Salary</p>
                      <p className="text-lg font-bold text-success">{course.salaryOutcomes}</p>
                    </div>
                    <Link to={`/enquiry?course=${course.name}&university=${university.name}`}>
                      <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-md">
                        Check Eligibility
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-muted-foreground"
            >
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No programs found matching your criteria.</p>
              <Button variant="link" onClick={() => {setSearchQuery(""); setActiveTab("All");}} className="mt-2 text-accent">
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UniversityCourses;
