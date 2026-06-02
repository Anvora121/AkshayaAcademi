import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { getWhyChooseFeatures } from "@/data/universityDetailsExtension";
import * as Icons from "lucide-react";

interface UniversityWhyChooseProps {
  university: University;
}

const UniversityWhyChoose = ({ university }: UniversityWhyChooseProps) => {
  const features = getWhyChooseFeatures();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            Why Choose {university.name}?
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Discover the unique advantages of studying at one of the world's leading institutions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          // @ts-ignore
          const Icon = Icons[feature.icon] || Icons.CheckCircle;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Highlight Stats Row */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gradient-to-r from-accent/5 via-accent/10 to-transparent border border-accent/10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Alumni Network</p>
          <p className="text-2xl font-bold text-foreground mt-1">300,000+</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Nobel Laureates</p>
          <p className="text-2xl font-bold text-foreground mt-1">45+</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Research Centers</p>
          <p className="text-2xl font-bold text-foreground mt-1">120+</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Startups Founded</p>
          <p className="text-2xl font-bold text-foreground mt-1">1,000+</p>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityWhyChoose;
