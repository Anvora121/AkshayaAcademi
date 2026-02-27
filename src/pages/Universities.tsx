import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  GraduationCap,
  Star,
  ChevronRight,
  Users,
  TrendingUp,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { universitiesData, countryImages, countries } from "@/data/universities";

const UniversitiesPage = () => {
  const [searchParams] = useSearchParams();
  const initialCountry = searchParams.get("country") || "all";
  const [activeCountry, setActiveCountry] = useState(initialCountry);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // For "All Countries" - rotate through country backgrounds
  const countryKeys = Object.keys(countryImages).filter(k => k !== 'all');

  useEffect(() => {
    if (activeCountry === "all") {
      const interval = setInterval(() => {
        setCurrentBgIndex((prev) => (prev + 1) % countryKeys.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeCountry]);

  const currentBackground = activeCountry === "all"
    ? countryImages[countryKeys[currentBgIndex]]
    : countryImages[activeCountry] || countryImages.all;

  const filteredUniversities = universitiesData.filter(uni => {
    const matchesCountry = activeCountry === "all" || uni.country === activeCountry;
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const getCountryFlag = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    return country?.flag || "🌍";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section with Dynamic Background */}
        <section className="pt-20 relative overflow-hidden min-h-[500px]">
          {/* Animated Background */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBackground}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentBackground})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="container mx-auto px-4 relative z-10 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center mb-10"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                University Explorer
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gradient mb-4">
                Find Your Dream University
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Explore {universitiesData.length}+ top universities across 11 countries
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto mb-10"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search universities, courses, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-5 h-14 text-base bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/40 rounded-2xl focus:bg-white/15 focus:border-white/30"
                />
              </div>
            </motion.div>

            {/* Country Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {countries.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCountry(c.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                    activeCountry === c.id
                      ? "bg-accent text-white shadow-accent scale-105"
                      : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/10"
                  )}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="hidden sm:inline">{c.name}</span>
                </button>
              ))}
            </motion.div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path
                d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H0Z"
                fill="hsl(var(--background))"
              />
            </svg>
          </div>
        </section>

        {/* Universities Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredUniversities.length}</span> universities
                {activeCountry !== "all" && (
                  <span className="ml-1">
                    in <span className="font-semibold text-foreground">{countries.find(c => c.id === activeCountry)?.name}</span>
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.map((uni, index) => (
                <motion.div
                  key={uni.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                >
                  <Link to={`/universities/${uni.id}`} className="block h-full">
                    <div className="university-card group h-full flex flex-col">
                      {/* Campus Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={uni.image}
                          alt={uni.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Ranking Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/90 backdrop-blur-sm text-white text-xs font-bold">
                          <Star className="w-3 h-3 fill-white" />
                          #{uni.ranking}
                        </div>

                        {/* Logo Placeholder */}
                        <div className="absolute bottom-4 left-4 w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center text-primary font-bold text-xs">
                          {uni.logo}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-grow flex flex-col">
                        <div className="flex items-start gap-2 mb-3">
                          <span className="text-lg">{getCountryFlag(uni.country)}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-accent transition-colors line-clamp-2">
                              {uni.name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {uni.location}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-3">{uni.type}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {uni.courses.slice(0, 3).map((course, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">
                              {course}
                            </span>
                          ))}
                          {uni.courses.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-muted-foreground">
                              +{uni.courses.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-border">
                          <Button variant="outline" size="sm" className="w-full group/btn">
                            Check Eligibility
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-7 h-7 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{universitiesData.length}+</p>
                <p className="text-sm text-muted-foreground">Partner Universities</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-teal" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">10,000+</p>
                <p className="text-sm text-muted-foreground">Students Placed</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-success" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">11</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">95%</p>
                <p className="text-sm text-muted-foreground">Visa Success Rate</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UniversitiesPage;
