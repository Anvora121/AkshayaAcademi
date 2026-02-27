import { Link } from "react-router-dom";
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
  ArrowUpRight
} from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "Overseas Education",
    description: "Expert guidance for university selection, course matching, and complete admission support across 8 countries.",
    href: "/services#education",
    gradient: "from-primary to-primary/80",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
  },
  {
    icon: Award,
    title: "Scholarship Guidance",
    description: "Discover merit-based, government, and university scholarships to fund your education.",
    href: "/services#scholarship",
    gradient: "from-accent to-accent/80",
    image: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=800&q=80",
  },
  {
    icon: FileCheck,
    title: "Visa Assistance",
    description: "End-to-end visa support including documentation, mock interviews, and filing.",
    href: "/services#visa",
    gradient: "from-teal to-teal/80",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    icon: Languages,
    title: "Language Training",
    description: "IELTS, German, Japanese, and LangCert preparation with exam-focused modules.",
    href: "/services#language",
    gradient: "from-success to-success/80",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
  },
  {
    icon: Briefcase,
    title: "Placement Opportunities",
    description: "Access domestic jobs and international internships aligned with your goals.",
    href: "/services#placement-opportunities",
    gradient: "from-primary to-primary/80",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
  },
  {
    icon: Users,
    title: "Soft Skill Training",
    description: "Build public speaking, corporate etiquette, and leadership skills.",
    href: "/services#soft-skills",
    gradient: "from-accent to-accent/80",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    icon: Target,
    title: "Placement Assistance",
    description: "Resume building, interview preparation, and strategic job search.",
    href: "/services#placement-assistance",
    gradient: "from-teal to-teal/80",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
  },
  {
    icon: Home,
    title: "Post-Admission Services",
    description: "Accommodation help, registration, and local orientation support.",
    href: "/services#post-admission",
    gradient: "from-success to-success/80",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 grid-pattern-light opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="badge-premium mb-4">
            Our Services
          </span>
          <h2 className="text-foreground mb-4">
            Complete Education & Career Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            From your first consultation to settling abroad — we provide comprehensive support at every step.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link 
                to={service.href}
                className="group block h-full"
              >
                <div className="service-card h-full flex flex-col overflow-hidden">
                  {/* Service Image */}
                  <div className="relative h-40 overflow-hidden -mx-6 -mt-6 mb-5">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    
                    {/* Icon overlay */}
                    <div className="absolute bottom-4 left-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                    {service.description}
                  </p>
                  
                  {/* Link */}
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
                    Learn More
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Link to="/services">
            <Button variant="outline" size="lg" className="font-semibold group">
              View All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
