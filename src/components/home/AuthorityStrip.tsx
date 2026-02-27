import { motion } from "framer-motion";
import { Shield, Award, Clock, Headphones } from "lucide-react";

const metrics = [
  { icon: Shield, label: "Licensed & Registered", sublabel: "Government Authorized" },
  { icon: Award, label: "10+ Years Experience", sublabel: "Industry Expertise" },
  { icon: Clock, label: "Fast Processing", sublabel: "Efficient Timelines" },
  { icon: Headphones, label: "24/7 Support", sublabel: "Always Available" },
];

const AuthorityStrip = () => {
  return (
    <section className="py-6 bg-secondary border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{metric.label}</p>
                <p className="text-xs text-muted-foreground">{metric.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthorityStrip;
