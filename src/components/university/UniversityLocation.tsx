import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { getLocationIntelligence } from "@/data/universityDetailsExtension";
import { MapPin, Sun, Snowflake, ShieldCheck, Bus, Users, Map, Compass, Briefcase } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UniversityLocationProps {
  university: University;
}

const UniversityLocation = ({ university }: UniversityLocationProps) => {
  const loc = getLocationIntelligence(university.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MapPin className="w-8 h-8 text-accent" />
          Location Intelligence
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Explore the city, lifestyle, and environment around {university.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Interactive map placeholder */}
        <div className="relative rounded-3xl overflow-hidden h-64 lg:h-auto border border-border/50 group bg-secondary/50">
          <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Map_of_the_world_by_the_US_Gov_as_of_2016_no_legend.svg/1280px-Map_of_the_world_by_the_US_Gov_as_of_2016_no_legend.svg.png')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{university.location}</h3>
            </div>
            <p className="text-foreground/80 font-medium">{loc.description}</p>
          </div>
        </div>

        {/* Weather & Vitals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center hover:bg-orange-500/20 transition-colors">
            <Sun className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground mb-1">Summer</p>
            <p className="text-xs text-muted-foreground">{loc.weather.summer}</p>
          </div>
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center hover:bg-blue-500/20 transition-colors">
            <Snowflake className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground mb-1">Winter</p>
            <p className="text-xs text-muted-foreground">{loc.weather.winter}</p>
          </div>
          
          <div className="col-span-2 p-5 rounded-2xl bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold flex items-center gap-2"><Bus className="w-4 h-4 text-accent" /> Transport Network</span>
              <span className="text-sm font-bold text-accent">{loc.transportScore}/100</span>
            </div>
            <Progress value={loc.transportScore} className="h-2 bg-background mb-4" indicatorColor="bg-accent" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> City Safety</span>
              <span className="text-sm font-bold text-emerald-500">{loc.safetyScore}/100</span>
            </div>
            <Progress value={loc.safetyScore} className="h-2 bg-background" indicatorColor="bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* Tags Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Indian Community</p>
            <p className="font-bold text-foreground">{loc.indianCommunityPresence} Presence</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Map className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Cost of Living</p>
            <p className="font-bold text-foreground">{loc.costOfLiving}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Part-time Jobs</p>
            <p className="font-bold text-foreground">{loc.partTimeOpportunities}</p>
          </div>
        </div>
      </div>

      {/* Nearby Attractions */}
      <div className="p-6 rounded-2xl bg-secondary/10 border border-border/50">
        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-muted-foreground" />
          Nearby Attractions
        </h4>
        <div className="flex flex-wrap gap-2">
          {loc.nearbyAttractions.map((attr, idx) => (
            <span key={idx} className="px-4 py-2 rounded-lg bg-background text-sm font-medium border border-border/50 hover:border-accent/30 transition-colors">
              {attr}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityLocation;
