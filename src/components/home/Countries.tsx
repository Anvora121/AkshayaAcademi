import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Briefcase, DollarSign, ChevronRight, MapPin, Users } from "lucide-react";

const countries = [
  {
    id: "us",
    name: "United States",
    code: "us",
    flag: "🇺🇸",
    universities: 120,
    workRights: "OPT: 1-3 years",
    avgCost: "$20K-$60K/year",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    description: "Home to Ivy League and world-renowned research universities",
  },
  {
    id: "uk",
    name: "United Kingdom",
    code: "gb",
    flag: "🇬🇧",
    universities: 85,
    workRights: "PSW: 2 years",
    avgCost: "£15K-£35K/year",
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    description: "Prestigious education with Oxford and Cambridge legacy",
  },
  {
    id: "canada",
    name: "Canada",
    code: "ca",
    flag: "🇨🇦",
    universities: 65,
    workRights: "PGWP: Up to 3 years",
    avgCost: "CAD 15K-35K/year",
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80",
    description: "Immigration-friendly with excellent quality of life",
  },
  {
    id: "germany",
    name: "Germany",
    code: "de",
    flag: "🇩🇪",
    universities: 45,
    workRights: "18 months job seeker",
    avgCost: "€0-€3K/year (public)",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    description: "Tuition-free public universities with strong engineering focus",
  },
  {
    id: "australia",
    name: "Australia",
    code: "au",
    flag: "🇦🇺",
    universities: 55,
    workRights: "PSV: 2-4 years",
    avgCost: "AUD 20K-45K/year",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
    description: "High-quality education with excellent career prospects",
  },
  {
    id: "newzealand",
    name: "New Zealand",
    code: "nz",
    flag: "🇳🇿",
    universities: 25,
    workRights: "PSW: 1-3 years",
    avgCost: "NZD 22K-35K/year",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
    description: "Safe, scenic country with practical education approach",
  },
  {
    id: "austria",
    name: "Austria",
    code: "at",
    flag: "🇦🇹",
    universities: 20,
    workRights: "Red-White-Red Card",
    avgCost: "€0-€1.5K/year",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80",
    description: "Rich cultural heritage with affordable quality education",
  },
  {
    id: "poland",
    name: "Poland",
    code: "pl",
    flag: "🇵🇱",
    universities: 30,
    workRights: "1 year residence permit",
    avgCost: "€2K-€6K/year",
    image: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=800&q=80",
    description: "Affordable education in the heart of Europe",
  },
  {
    id: "switzerland",
    name: "Switzerland",
    code: "ch",
    flag: "🇨🇭",
    universities: 15,
    workRights: "6 months job search permit",
    avgCost: "CHF 1K-4K/year (public)",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    description: "Home to world-leading research universities and global organizations",
  },
  {
    id: "netherlands",
    name: "Netherlands",
    code: "nl",
    flag: "🇳🇱",
    universities: 35,
    workRights: "Orientation year: 1 year",
    avgCost: "€8K-€20K/year",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
    description: "Innovative education hub with vast English-taught programmes",
  },
  {
    id: "sweden",
    name: "Sweden",
    code: "se",
    flag: "🇸🇪",
    universities: 30,
    workRights: "Job seeker: 6 months",
    avgCost: "Free for EU; SEK 80K-250K for non-EU",
    image: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&q=80",
    description: "Progressive, research-driven universities with a focus on sustainability",
  },
];

const Countries = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="badge-premium mb-4">
            Study Destinations
          </span>
          <h2 className="text-foreground mb-4">
            11 Countries, Endless Opportunities
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore top education destinations with world-class universities and excellent career prospects.
          </p>
        </motion.div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {countries.map((country, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                to={`/education?country=${country.id}`}
                className="group block h-full"
              >
                <div className="country-card h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    <img
                      src={country.image}
                      alt={country.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Universities Badge Overlay */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/95 dark:bg-slate-900/95 text-primary rounded-full shadow-sm flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-accent" />
                        {country.universities}+ Universities
                      </span>
                    </div>

                    {/* Flag & Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-slate-100 flex items-center justify-center">
                          <img
                            src={`https://flagcdn.com/${country.code}.svg`}
                            alt={country.name}
                            className="w-full h-full object-cover scale-110"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] tracking-widest text-accent font-bold uppercase block mb-0.5">Study in</span>
                          <h3 className="text-base font-bold text-white tracking-tight leading-tight drop-shadow">
                            {country.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-card to-secondary/10">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {country.description}
                    </p>

                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-xs text-muted-foreground transition-colors group-hover:bg-accent/5 group-hover:border-accent/10">
                        <Briefcase className="w-4 h-4 text-teal flex-shrink-0" />
                        <span className="font-semibold text-foreground/80">Work Rights:</span>
                        <span className="text-muted-foreground truncate">{country.workRights}</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-xs text-muted-foreground transition-colors group-hover:bg-accent/5 group-hover:border-accent/10">
                        <DollarSign className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="font-semibold text-foreground/80">Avg Cost:</span>
                        <span className="text-muted-foreground truncate">{country.avgCost}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                      <span className="text-sm font-semibold text-primary uppercase tracking-wider group-hover:text-accent transition-colors">
                        Explore Universities
                      </span>
                      <ChevronRight className="w-4 h-4 text-primary group-hover:text-accent group-hover:translate-x-1.5 transition-all" />
                    </div>
                  </div>
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
          className="text-center mt-12"
        >
          <Link to="/education">
            <Button variant="default" size="lg" className="font-semibold group">
              Explore All Destinations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Countries;
