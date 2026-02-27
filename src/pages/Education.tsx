import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Calendar,
  Users,
  MapPin,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const countriesData = [
  {
    id: "us",
    name: "United States",
    flag: "🇺🇸",
    overview: "Home to world-renowned universities and diverse academic programs. The US offers unparalleled research opportunities and a multicultural environment.",
    educationSystem: [
      "4-year Bachelor's degrees",
      "1-2 year Master's programs",
      "Research-focused PhD programs",
      "Community college pathway options",
    ],
    admissionCycles: "Fall (Sep), Spring (Jan), Summer (May)",
    workRights: "OPT: 12 months (36 months for STEM)",
    postStudyWork: "H-1B visa sponsorship opportunity",
    avgCost: { tuition: "$20,000 - $60,000/year", living: "$12,000 - $20,000/year" },
    popularFields: ["Computer Science", "Business/MBA", "Engineering", "Data Science", "Healthcare"],
    topUniversities: ["MIT", "Stanford", "Harvard", "Caltech", "UC Berkeley"],
    requirements: ["SAT/GRE/GMAT", "TOEFL/IELTS", "SOP", "LORs", "Transcripts"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
    mapPosition: "North America",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    overview: "Prestigious education with shorter program durations. The UK offers a rich academic heritage and excellent career prospects.",
    educationSystem: [
      "3-year Bachelor's degrees",
      "1-year Master's programs",
      "Foundation programs available",
      "Integrated Master's options",
    ],
    admissionCycles: "Fall (Sep) primary intake",
    workRights: "Graduate Route: 2 years (3 years PhD)",
    postStudyWork: "Skilled Worker visa opportunity",
    avgCost: { tuition: "£15,000 - £35,000/year", living: "£12,000 - £15,000/year" },
    popularFields: ["Business", "Law", "Medicine", "Arts", "Engineering"],
    topUniversities: ["Oxford", "Cambridge", "Imperial College", "LSE", "UCL"],
    requirements: ["IELTS/PTE", "SOP", "LORs", "Transcripts", "Portfolio (arts)"],
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=80",
    mapPosition: "Europe",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    overview: "Excellent quality of life with immigration-friendly policies. Canada offers affordable education and clear pathways to permanent residency.",
    educationSystem: [
      "3-4 year Bachelor's degrees",
      "1-2 year Master's programs",
      "Co-op programs available",
      "College diploma options",
    ],
    admissionCycles: "Fall (Sep), Winter (Jan), Summer (May)",
    workRights: "PGWP: Up to 3 years",
    postStudyWork: "Express Entry pathway to PR",
    avgCost: { tuition: "CAD $15,000 - $35,000/year", living: "CAD $10,000 - $15,000/year" },
    popularFields: ["Technology", "Healthcare", "Engineering", "Business", "Environmental Science"],
    topUniversities: ["University of Toronto", "UBC", "McGill", "Waterloo", "Alberta"],
    requirements: ["IELTS/TOEFL", "SOP", "LORs", "Transcripts", "GRE (some programs)"],
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1920&q=80",
    mapPosition: "North America",
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    overview: "Tuition-free public universities with strong research focus. Germany offers excellent engineering and technical education with industry connections.",
    educationSystem: [
      "3-4 year Bachelor's degrees",
      "2-year Master's programs",
      "Free tuition at public universities",
      "Research-intensive programs",
    ],
    admissionCycles: "Winter (Oct), Summer (Apr)",
    workRights: "18-month job seeker visa",
    postStudyWork: "EU Blue Card opportunity",
    avgCost: { tuition: "€0 - €3,000/year (public)", living: "€10,000 - €12,000/year" },
    popularFields: ["Engineering", "Automotive", "Research", "Technology", "Renewable Energy"],
    topUniversities: ["TU Munich", "LMU Munich", "Heidelberg", "RWTH Aachen", "TU Berlin"],
    requirements: ["German proficiency (some programs)", "APS certificate (India)", "Blocked account", "TestAS/TestDaF"],
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80",
    mapPosition: "Europe",
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    overview: "High-quality education with excellent quality of life. Australia offers a welcoming environment and strong post-study work rights.",
    educationSystem: [
      "3-year Bachelor's degrees",
      "1-2 year Master's programs",
      "Pathway programs available",
      "Vocational education options",
    ],
    admissionCycles: "Feb & Jul intakes",
    workRights: "Post-Study Work Visa: 2-4 years",
    postStudyWork: "Skilled migration pathway",
    avgCost: { tuition: "AUD $20,000 - $45,000/year", living: "AUD $21,000/year" },
    popularFields: ["Business", "IT", "Healthcare", "Engineering", "Hospitality"],
    topUniversities: ["Melbourne", "Sydney", "ANU", "UNSW", "Monash"],
    requirements: ["IELTS/PTE", "SOP", "LORs", "Transcripts", "Health insurance"],
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1920&q=80",
    mapPosition: "Oceania",
  },
  {
    id: "newzealand",
    name: "New Zealand",
    flag: "🇳🇿",
    overview: "Safe, scenic country with practical, industry-focused education. New Zealand offers excellent work-life balance and immigration options.",
    educationSystem: [
      "3-year Bachelor's degrees",
      "1-2 year Master's programs",
      "Strong practical focus",
      "Research opportunities",
    ],
    admissionCycles: "Feb & Jul intakes",
    workRights: "Post-Study Work Visa: 1-3 years",
    postStudyWork: "Skilled Migrant Category",
    avgCost: { tuition: "NZD $22,000 - $35,000/year", living: "NZD $15,000 - $20,000/year" },
    popularFields: ["Agriculture", "Tourism", "IT", "Environmental Science", "Film & Media"],
    topUniversities: ["Auckland", "Otago", "Victoria Wellington", "Canterbury", "Massey"],
    requirements: ["IELTS", "SOP", "LORs", "Transcripts", "Health & character checks"],
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80",
    mapPosition: "Oceania",
  },
  {
    id: "austria",
    name: "Austria",
    flag: "🇦🇹",
    overview: "Rich cultural heritage with affordable, high-quality education. Austria offers excellent programs in music, arts, and business.",
    educationSystem: [
      "3-year Bachelor's degrees",
      "2-year Master's programs",
      "Low tuition fees",
      "Strong arts & music programs",
    ],
    admissionCycles: "Winter (Oct), Summer (Mar)",
    workRights: "Red-White-Red Card",
    postStudyWork: "EU work permit pathway",
    avgCost: { tuition: "€0 - €1,500/year", living: "€10,000 - €14,000/year" },
    popularFields: ["Music", "Arts", "Business", "Tourism", "Environmental Studies"],
    topUniversities: ["Vienna", "TU Vienna", "Innsbruck", "Graz", "Salzburg"],
    requirements: ["German proficiency", "SOP", "Transcripts", "Portfolio (arts)", "Entrance exams"],
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1920&q=80",
    mapPosition: "Europe",
  },
  {
    id: "poland",
    name: "Poland",
    flag: "🇵🇱",
    overview: "Affordable education in the heart of Europe. Poland offers quality medical and engineering programs at competitive costs.",
    educationSystem: [
      "3-year Bachelor's degrees",
      "2-year Master's programs",
      "English-taught programs",
      "Strong medical education",
    ],
    admissionCycles: "Oct & Feb intakes",
    workRights: "Temporary residence permit",
    postStudyWork: "9-month job search period",
    avgCost: { tuition: "€2,000 - €6,000/year", living: "€6,000 - €9,000/year" },
    popularFields: ["Medicine", "Engineering", "IT", "Business", "Pharmacy"],
    topUniversities: ["Warsaw", "Jagiellonian", "Warsaw Tech", "Wroclaw", "AGH"],
    requirements: ["IELTS/TOEFL", "SOP", "Transcripts", "Entrance exam (medicine)", "Health certificate"],
    image: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=1920&q=80",
    mapPosition: "Europe",
  },
  {
    id: "switzerland",
    name: "Switzerland",
    flag: "🇨🇭",
    overview: "Home to world-leading research universities and global organizations. Switzerland offers exceptional education with very low tuition fees at public institutions.",
    educationSystem: [
      "3-year Bachelor's degrees",
      "2-year Master's programs",
      "Very low tuition at public universities",
      "Strong research & innovation focus",
    ],
    admissionCycles: "Autumn (Sep), Spring (Feb)",
    workRights: "6-month job search permit after graduation",
    postStudyWork: "Highly skilled worker permit pathway",
    avgCost: { tuition: "CHF 1,000 - 4,000/year", living: "CHF 18,000 - 24,000/year" },
    popularFields: ["Engineering", "Finance", "Hospitality", "Life Sciences", "Computer Science"],
    topUniversities: ["ETH Zurich", "EPFL", "University of Zurich", "University of Geneva", "University of Basel"],
    requirements: ["IELTS/TOEFL (English programs)", "SOP", "Transcripts", "German/French (some programs)", "Portfolio (design)"],
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80",
    mapPosition: "Europe",
  },
  {
    id: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    overview: "An innovative education hub with thousands of English-taught programmes. The Netherlands offers a liberal, open-minded environment and world-class institutions.",
    educationSystem: [
      "3-year Bachelor's degrees",
      "1-2 year Master's programs",
      "3,000+ English-taught programmes",
      "Problem-based learning approach",
    ],
    admissionCycles: "Sep (primary), Feb (some programs)",
    workRights: "Orientation Year: 1 year post-graduation",
    postStudyWork: "Highly Skilled Migrant visa pathway",
    avgCost: { tuition: "€8,000 - €20,000/year", living: "€10,000 - €14,000/year" },
    popularFields: ["Business", "Engineering", "AI & Data Science", "Law", "Social Sciences"],
    topUniversities: ["TU Delft", "University of Amsterdam", "Leiden University", "Erasmus Rotterdam", "Utrecht University"],
    requirements: ["IELTS/TOEFL", "SOP", "LORs", "Transcripts", "Nuffic evaluation (some programs)"],
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1920&q=80",
    mapPosition: "Europe",
  },
  {
    id: "sweden",
    name: "Sweden",
    flag: "🇸🇪",
    overview: "Progressive, research-driven universities with a focus on sustainability and innovation. Sweden offers free education for EU students and a high quality of life.",
    educationSystem: [
      "3-year Bachelor's degrees",
      "2-year Master's programs",
      "Free tuition for EU/EEA students",
      "Strong focus on sustainability",
    ],
    admissionCycles: "Autumn (Sep) primary intake",
    workRights: "6-month job search permit post-graduation",
    postStudyWork: "Work/Residence permit via employment",
    avgCost: { tuition: "Free for EU; SEK 80,000 - 250,000/year (non-EU)", living: "SEK 80,000 - 100,000/year" },
    popularFields: ["Engineering", "Sustainability", "Design", "Medicine", "Computer Science"],
    topUniversities: ["KTH Royal Institute of Technology", "Lund University", "Uppsala University", "Stockholm University", "Chalmers"],
    requirements: ["IELTS/TOEFL", "SOP", "LORs", "Transcripts", "Portfolio (design/arts)"],
    image: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1920&q=80",
    mapPosition: "Europe",
  },
];

const EducationPage = () => {
  const [searchParams] = useSearchParams();
  const initialCountry = searchParams.get("country") || "us";
  const [activeCountry, setActiveCountry] = useState(initialCountry);

  const country = countriesData.find(c => c.id === activeCountry) || countriesData[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section with Country Image */}
        <section className="relative pt-20 overflow-hidden min-h-[550px]">
          {/* Background Image with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={country.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 h-[550px]"
            >
              <img
                src={country.image}
                alt={country.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute inset-0 grid-pattern opacity-20" />
            </motion.div>
          </AnimatePresence>

          <div className="container mx-auto px-4 relative z-10 py-16">
            {/* Country Tabs */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-2 mb-12"
            >
              {countriesData.map((c) => (
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

            {/* Country Header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-muted-foreground bg-white/50 px-3 py-1 rounded-full border border-border/50">{country.mapPosition}</span>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-7xl drop-shadow-lg">{country.flag}</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gradient mb-4">
                  Study in {country.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                  {country.overview}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-16 -mt-8 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              key={`grid-${country.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {/* Education System */}
              <div className="premium-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-primary">Education System</h3>
                </div>
                <ul className="space-y-3">
                  {country.educationSystem.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Admission & Work Rights */}
              <div className="premium-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-teal" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-primary">Admission & Work</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-1">Admission Cycles</p>
                    <p className="text-sm text-foreground font-medium">{country.admissionCycles}</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-accent" />
                      <p className="text-xs uppercase tracking-wider text-muted-foreground/60">Work Rights</p>
                    </div>
                    <p className="text-sm text-foreground font-medium">{country.workRights}</p>
                    <p className="text-xs text-muted-foreground mt-1">{country.postStudyWork}</p>
                  </div>
                </div>
              </div>

              {/* Cost Overview */}
              <div className="premium-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-success" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-primary">Cost Overview</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-1">Tuition (per year)</p>
                    <p className="text-lg font-bold text-foreground">{country.avgCost.tuition}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-1">Living Expenses</p>
                    <p className="text-lg font-bold text-foreground">{country.avgCost.living}</p>
                  </div>
                </div>
              </div>

              {/* Popular Fields */}
              <div className="premium-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-primary">Popular Fields</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {country.popularFields.map((field, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground">
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Universities */}
              <div className="premium-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-primary">Top Universities</h3>
                </div>
                <ul className="space-y-2">
                  {country.topUniversities.map((uni, i) => (
                    <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                      <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground">{uni}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="premium-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-teal" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-primary">Key Requirements</h3>
                </div>
                <ul className="space-y-3">
                  {country.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
            >
              <Link to={`/universities?country=${country.id}`}>
                <Button size="lg" className="font-semibold group">
                  Explore {country.name} Universities
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/enquiry">
                <Button variant="outline" size="lg" className="font-semibold">
                  Get Free Counseling
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EducationPage;
