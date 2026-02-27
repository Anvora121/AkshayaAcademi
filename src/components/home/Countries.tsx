import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Briefcase, DollarSign, ChevronRight, MapPin, Users } from "lucide-react";

const countries = [
  {
    id: "us",
    name: "United States",
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
                <div className="country-card h-full overflow-hidden rounded-2xl bg-card border border-border">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={country.image}
                      alt={country.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Flag & Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl drop-shadow-lg">{country.flag}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {country.name}
                          </h3>
                          <p className="text-sm text-white/70 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {country.universities}+ Universities
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {country.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4 text-teal" />
                        <span>{country.workRights}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4 text-success" />
                        <span>{country.avgCost}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-medium text-accent">Explore Universities</span>
                      <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
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
