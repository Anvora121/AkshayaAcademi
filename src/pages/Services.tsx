import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Award, 
  FileCheck, 
  Languages, 
  Briefcase, 
  Users, 
  Target, 
  Home,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Sparkles
} from "lucide-react";

const servicesData = [
  {
    id: "education",
    icon: GraduationCap,
    title: "Overseas Education",
    subtitle: "Complete University & Course Guidance",
    description: "Expert guidance for university selection, course matching, and complete admission support across 8 countries.",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
    process: [
      "Student profile analysis & goal assessment",
      "Country shortlisting based on preferences",
      "University mapping & ranking analysis",
      "Course alignment with career objectives",
      "Eligibility validation & gap analysis",
      "Application roadmap & timeline planning",
    ],
    deliverables: [
      "Personalized country & university list",
      "Course recommendations with rationale",
      "Complete application checklist",
      "Deadline tracker & timeline",
    ],
    timeline: "2-4 weeks for initial consultation & shortlisting",
  },
  {
    id: "scholarship",
    icon: Award,
    title: "Scholarship Guidance",
    subtitle: "Financial Aid & Merit Awards",
    description: "Discover merit-based, government, and university scholarships. We help you secure financial aid for your education.",
    gradient: "from-yellow-500 to-orange-500",
    shadow: "shadow-yellow-500/20",
    image: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=1200&q=80",
    process: [
      "Eligibility screening for available scholarships",
      "Scholarship discovery & matching",
      "Document preparation & SOP guidance",
      "Application submission support",
      "Follow-ups & status tracking",
    ],
    deliverables: [
      "List of applicable scholarships",
      "Application requirements checklist",
      "Essay & SOP templates",
      "Submission tracking sheet",
    ],
    timeline: "Varies by scholarship deadline",
  },
  {
    id: "visa",
    icon: FileCheck,
    title: "Visa Assistance",
    subtitle: "End-to-End Visa Support",
    description: "Comprehensive visa support including documentation review, mock interviews, and application filing.",
    gradient: "from-teal-400 to-emerald-600",
    shadow: "shadow-teal-500/20",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    process: [
      "Offer letter verification & assessment",
      "Financial documentation guidance",
      "Visa application form preparation",
      "Document compilation & review",
      "Mock interview sessions",
      "Application filing & tracking",
    ],
    deliverables: [
      "Complete document checklist",
      "Mock interview feedback",
      "Visa application review",
      "Post-decision guidance",
    ],
    timeline: "4-8 weeks depending on country",
    disclaimer: "Visa decisions are at the discretion of immigration authorities. We provide process-driven support, not guaranteed outcomes.",
  },
  {
    id: "language",
    icon: Languages,
    title: "Language Training",
    subtitle: "IELTS, German, Japanese & More",
    description: "Comprehensive language preparation with academic, professional, and exam-focused modules.",
    gradient: "from-purple-500 to-pink-600",
    shadow: "shadow-purple-500/20",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80",
    languages: [
      { name: "IELTS", type: "English Proficiency" },
      { name: "German", type: "A1 to C1 Levels" },
      { name: "Japanese", type: "JLPT Preparation" },
      { name: "LangCert", type: "English Certification" },
    ],
    modules: [
      "Academic language skills",
      "Professional communication",
      "Exam-focused preparation",
      "Speaking & writing practice",
    ],
    timeline: "8-16 weeks depending on target level",
  },
  {
    id: "placement-opportunities",
    icon: Briefcase,
    title: "Placement Opportunities",
    subtitle: "Jobs & Internships",
    description: "Access domestic jobs and international internships aligned with your career goals and education.",
    gradient: "from-cyan-400 to-blue-600",
    shadow: "shadow-cyan-500/20",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80",
    process: [
      "Skill assessment & gap analysis",
      "Career alignment with industry trends",
      "Employer & company mapping",
      "Internship & job targeting",
      "Application support & tracking",
    ],
    deliverables: [
      "Career pathway document",
      "Target employer list",
      "Application strategy",
      "Interview preparation guide",
    ],
    timeline: "Ongoing support during and after studies",
  },
  {
    id: "soft-skills",
    icon: Users,
    title: "Soft Skill Training",
    subtitle: "Professional Development",
    description: "Build essential soft skills including public speaking, corporate etiquette, and leadership for global careers.",
    gradient: "from-orange-400 to-red-500",
    shadow: "shadow-orange-500/20",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    skills: [
      "Public Speaking & Presentation",
      "Corporate Etiquette & Professionalism",
      "Leadership & Team Management",
      "Cross-cultural Communication",
      "Time Management & Productivity",
      "Networking & Relationship Building",
    ],
    timeline: "4-8 weeks program duration",
  },
  {
    id: "placement-assistance",
    icon: Target,
    title: "Placement Assistance",
    subtitle: "Career Launch Support",
    description: "Complete job search support including resume building, interview preparation, and strategic job search.",
    gradient: "from-rose-400 to-pink-600",
    shadow: "shadow-rose-500/20",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
    process: [
      "Resume building & optimization",
      "LinkedIn profile enhancement",
      "Interview preparation & mock sessions",
      "Job search strategy development",
      "Salary negotiation guidance",
    ],
    deliverables: [
      "ATS-optimized resume",
      "Cover letter templates",
      "Interview preparation kit",
      "Job search action plan",
    ],
    timeline: "Ongoing until placement",
  },
  {
    id: "post-admission",
    icon: Home,
    title: "Post-Admission Services",
    subtitle: "Settlement Support",
    description: "Smooth transition support including accommodation help, country registration, and local orientation.",
    gradient: "from-green-400 to-emerald-600",
    shadow: "shadow-green-500/20",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    services: [
      "Accommodation search & booking assistance",
      "Airport pickup coordination",
      "Bank account opening guidance",
      "Local registration support",
      "SIM card & utilities setup",
      "Orientation to local area",
    ],
    timeline: "Pre-departure to first month abroad",
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Header />
      
      {/* Cinematic Background Globals */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute top-[40%] left-[-200px] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-10 -z-10 pointer-events-none" />
      <main className="flex-1">
        {/* Cinematic Hero Section */}
        <section className="pt-40 pb-20 relative overflow-hidden min-h-[500px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
              alt="Students collaborating"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-primary/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-slate-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          
          <div className="absolute inset-0 grid-pattern opacity-20" />
          
          <div className="container mx-auto px-4 relative z-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent/20 border border-accent/40 text-accent-foreground text-sm font-bold mb-8 uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              >
                <Sparkles className="w-4 h-4" />
                Premium Consultation
              </motion.div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight drop-shadow-lg">
                Architect Your <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50 drop-shadow-sm">Global Future</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
                End-to-end concierge services for ambitious students. From elite university matching to seamless visa processing and premium placement.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Cinematic Services List */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {servicesData.map((service, index) => (
                <motion.div 
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="scroll-mt-32 group"
                >
                  <div className="premium-card overflow-hidden bg-card/40 border-border/50 hover:border-accent/30 transition-all duration-500 group-hover:shadow-2xl backdrop-blur-sm">
                    <div className="grid md:grid-cols-[400px_1fr] lg:grid-cols-[500px_1fr] h-full">
                      
                      {/* Left: Cinematic Image Panel */}
                      <div className="relative h-64 md:h-auto overflow-hidden">
                        <div className="absolute inset-0 bg-background/20 z-10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                        <img 
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-background/80 to-transparent md:via-background/50 z-20`} />
                        
                        {/* Floating Icon Badge */}
                        <div className="absolute bottom-8 left-8 z-30">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-xl ${service.shadow} transform -rotate-6 group-hover:rotate-0 transition-transform duration-500`}>
                            <service.icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Right: Content Panel */}
                      <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                        {/* Subtle background glow based on service gradient */}
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.gradient} opacity-[0.03] blur-3xl -z-10 rounded-full`} />

                        {/* Header */}
                        <div className="mb-8">
                          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
                            {service.title}
                          </h2>
                          <div className="inline-block px-3 py-1 rounded-md bg-secondary/50 border border-border/50 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                            {service.subtitle}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-muted-foreground/80 mb-10 leading-relaxed max-w-2xl">
                          {service.description}
                        </p>

                        {/* Bento Grid Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                          
                          {service.process && (
                            <div className="bg-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-border/80 transition-colors">
                              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent" />
                                Our Process
                              </h3>
                              <ul className="space-y-3">
                                {service.process.slice(0, 4).map((step, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient} shrink-0 mt-2`} />
                                    <span className="text-muted-foreground text-sm leading-tight">{step}</span>
                                  </li>
                                ))}
                                {service.process.length > 4 && (
                                  <li className="text-xs text-muted-foreground/50 italic mt-2 ml-4">
                                    + {service.process.length - 4} more steps in full program
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          {service.deliverables && (
                            <div className="bg-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-border/80 transition-colors">
                              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-accent" />
                                Deliverables
                              </h3>
                              <ul className="space-y-3">
                                {service.deliverables.map((item, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className={`w-4 h-4 shrink-0 text-muted-foreground/40`} />
                                    <span className="text-muted-foreground text-sm leading-tight">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {service.languages && (
                            <div className="bg-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Languages className="w-4 h-4 text-accent" />
                                Program Options
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {service.languages.map((lang, i) => (
                                  <span key={i} className="px-3 py-1.5 rounded-lg bg-background/50 text-sm font-medium text-foreground/80 border border-border/50">
                                    {lang.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {service.skills && (
                            <div className="bg-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-accent" />
                                Core Competencies
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {service.skills.slice(0, 4).map((skill, i) => (
                                  <span key={i} className="px-3 py-1.5 rounded-lg bg-background/50 text-xs font-medium text-foreground/70 border border-border/50">
                                    {skill.split(" & ")[0]}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                        </div>

                        {/* Footer Action Area */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-border/50 mt-auto">
                          {service.timeline && (
                            <div className="flex flex-col">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground/50 font-bold mb-1">Standard Timeline</span>
                              <span className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent/70" /> {service.timeline}
                              </span>
                            </div>
                          )}
                          <Link to="/enquiry">
                            <Button className={`bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white font-bold px-8 shadow-lg ${service.shadow} transition-all hover:scale-105 rounded-xl h-12`}>
                              Book Consultation
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>

                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cinematic CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl mx-auto premium-card p-12 md:p-16 border-accent/20 bg-card/80 backdrop-blur-md"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Accelerate?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                Secure your spot with our premium advisors and start architecting a bulletproof strategy for your global aspirations.
              </p>
              <Link to="/enquiry">
                <Button size="lg" className="font-semibold h-14 px-10 text-lg bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 transition-all">
                  Request Callback
                  <ArrowRight className="w-5 h-5 ml-2" />
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

export default ServicesPage;
