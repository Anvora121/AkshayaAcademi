import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { usePageMeta } from "@/hooks/usePageMeta";
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  DollarSign, 
  Calendar, 
  Clock,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { useCourseSearch } from "@/hooks/useUniversities";
import { countries } from "@/data/universities";
import { cn } from "@/lib/utils";

const CourseDiscovery = () => {
  const [filters, setFilters] = useState({
    q: "",
    country: "all",
    level: "all",
    maxFee: "",
    page: "1"
  });

  const { data, isLoading } = useCourseSearch(filters);

  usePageMeta({
    title: "Course Discovery",
    description: "Search and compare thousands of courses at top universities worldwide. Filter by degree level, tuition fees, and country.",
    canonicalPath: "/courses"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the hook reactive to the 'filters' state
  };

  const updateFilters = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: "1" }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Search Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050335102-c628997df0f5?q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950 to-slate-950" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Find Your Perfect <span className="text-accent">Course</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto mb-10"
            >
              Explore thousands of programs across 11 countries and find the one that fits your career goals and budget.
            </motion.p>

            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSearch}
              className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="What do you want to study? (e.g. Data Science, MBA)"
                  className="w-full pl-12 h-14 bg-transparent border-none text-white placeholder:text-slate-400 focus-visible:ring-0 text-lg"
                  value={filters.q}
                  onChange={(e) => updateFilters({ q: e.target.value })}
                />
              </div>
              <Button size="lg" className="h-14 px-8 bg-accent hover:bg-accent/90 text-white font-bold text-lg rounded-xl">
                Search Courses
              </Button>
            </motion.form>
          </div>
        </section>

        <section className="py-12 border-b border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm">
                <MapPin className="w-4 h-4 text-accent" />
                <select 
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium"
                  value={filters.country}
                  onChange={(e) => updateFilters({ country: e.target.value })}
                >
                  <option value="all">All Countries</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm">
                <GraduationCap className="w-4 h-4 text-accent" />
                <select 
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium"
                  value={filters.level}
                  onChange={(e) => updateFilters({ level: e.target.value })}
                >
                  <option value="all">Degree Level</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm">
                <DollarSign className="w-4 h-4 text-accent" />
                <select 
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium"
                  value={filters.maxFee}
                  onChange={(e) => updateFilters({ maxFee: e.target.value })}
                >
                  <option value="all">Max Tuition</option>
                  <option value="10000">Under $10k</option>
                  <option value="25000">Under $25k</option>
                  <option value="50000">Under $50k</option>
                  <option value="100000">Under $100k</option>
                </select>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-500 underline underline-offset-4"
                onClick={() => setFilters({ q: "", country: "all", level: "all", maxFee: "", page: "1" })}
              >
                Reset All
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-accent" />
                {isLoading ? "Searching..." : `${data?.pagination.total || 0} Programs Found`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-[400px] rounded-3xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : data?.courses.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-600">No courses match your filters</h3>
                <p className="text-slate-500">Try adjusting your search criteria or clearing all filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {data?.courses.map((course: any, index: number) => (
                    <motion.div
                      key={course._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="group h-full flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="p-6 flex-grow">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden flex items-center justify-center">
                              {course.university.logo ? (
                                <img src={course.university.logo} alt={course.university.name} className="w-full h-full object-contain p-2" />
                              ) : (
                                <GraduationCap className="w-8 h-8 text-accent" />
                              )}
                            </div>
                            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                              {course.degreeLevel}
                            </span>
                          </div>

                          <Link to={`/universities/${course.university.id}`}>
                            <p className="text-sm font-medium text-slate-500 hover:text-accent mb-2 uppercase tracking-wide flex items-center gap-1">
                              {course.university.name}
                            </p>
                          </Link>
                          
                          <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-accent transition-colors">
                            {course.name}
                          </h3>

                          <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {course.university.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              Intake: {course.intakeMonths.join(", ")}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                              <DollarSign className="w-4 h-4 text-slate-400" />
                              Tuition: <span className="text-slate-900">{course.tuitionOriginal}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                          <Link to={`/enquiry?course=${course.name}&university=${course.university.name}`}>
                            <Button className="w-full rounded-xl bg-slate-900 hover:bg-accent text-white group/btn">
                              Get Free Counseling
                              <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && data?.pagination.pages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  disabled={filters.page === "1"}
                  onClick={() => updateFilters({ page: (parseInt(filters.page) - 1).toString() })}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, data.pagination.pages) }).map((_, i) => (
                    <Button 
                      key={i}
                      variant={filters.page === (i + 1).toString() ? "default" : "outline"}
                      className={filters.page === (i + 1).toString() ? "bg-accent" : ""}
                      onClick={() => updateFilters({ page: (i + 1).toString() })}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline"
                  disabled={filters.page === data.pagination.pages.toString()}
                  onClick={() => updateFilters({ page: (parseInt(filters.page) + 1).toString() })}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDiscovery;
