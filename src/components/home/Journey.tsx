import { motion } from "framer-motion";
import { Search, FileText, Stamp, BookOpen, Briefcase, Home, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Explore",
    description: "Discover universities and courses aligned with your goals",
    color: "bg-primary",
  },
  {
    icon: FileText,
    title: "Apply",
    description: "Complete applications with expert documentation support",
    color: "bg-accent",
  },
  {
    icon: Stamp,
    title: "Visa",
    description: "Navigate visa process with mock interviews & filing",
    color: "bg-teal",
  },
  {
    icon: BookOpen,
    title: "Study",
    description: "Begin your academic journey with pre-departure prep",
    color: "bg-success",
  },
  {
    icon: Briefcase,
    title: "Work",
    description: "Access internships and job opportunities abroad",
    color: "bg-primary",
  },
  {
    icon: Home,
    title: "Settle",
    description: "Get accommodation & local support for smooth transition",
    color: "bg-accent",
  },
];

const Journey = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 grid-pattern-light opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 text-teal text-sm font-medium mb-4">
            Your Journey
          </span>
          <h2 className="text-foreground mb-4">
            From Dream to Reality in 6 Steps
          </h2>
          <p className="text-lg text-muted-foreground">
            We guide you through every milestone — from consultation to settling in your dream country.
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-success z-0" />

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl ${step.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-all duration-300 relative`}>
                  <step.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-foreground shadow-sm">
                    {index + 1}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Points */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {[
            "Personalized guidance at every step",
            "Transparent process & realistic timelines",
            "Dedicated counselor support",
          ].map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success shrink-0" />
              <span className="text-muted-foreground">{point}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Journey;
