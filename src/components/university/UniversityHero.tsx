import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Building, Star, Download, Bookmark, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RankingBadge from "@/components/ui/RankingBadge";
import FeaturedBadge from "@/components/ui/FeaturedBadge";
import { University } from "@/data/universities";

interface UniversityHeroProps {
  university: University;
  avgRating: number;
}

const UniversityHero = ({ university, avgRating }: UniversityHeroProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-20 overflow-hidden">
      {/* Background Image & Premium Overlay Gradients */}
      <div className="absolute inset-0 h-[600px] lg:h-[700px]">
        <img
          src={university.image}
          alt={university.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Back Button */}
          <Link
            to="/universities"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/10">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium tracking-wide">Back to Directory</span>
          </Link>

          {/* Logo & Title */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-2xl overflow-hidden flex items-center justify-center shrink-0 border border-white/20"
            >
              {university.logo.startsWith('http') ? (
                <img
                  src={university.logo}
                  alt={`${university.name} logo`}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex'; }}
                />
              ) : null}
              <span
                className="text-primary font-bold text-xl"
                style={{ display: university.logo.startsWith('http') ? 'none' : 'flex' }}
              >
                {university.logo.startsWith('http') ? university.name.split(' ').map(w => w[0]).join('').slice(0, 4) : university.logo}
              </span>
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <RankingBadge
                  rank={university.ranking}
                  source={university.rankingSource}
                  updatedAt={university.rankingUpdatedAt}
                  size="md"
                  animate={true}
                />
                {university.featured && <FeaturedBadge size="sm" />}
                {avgRating > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {avgRating.toFixed(1)} / 5.0
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  STEM Friendly
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                {university.name}
              </h1>
              <div className="flex items-center gap-5 text-white/80 font-medium flex-wrap text-sm md:text-base">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  {university.location} ({university.countryName})
                </span>
                <span className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-accent" />
                  {university.type}
                </span>
              </div>
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 leading-relaxed font-light">
            {university.description}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-dark rounded-xl p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <p className="text-xs text-white/50 mb-1 uppercase tracking-wider font-semibold">Global Rank</p>
              <p className="text-xl font-bold text-white">#{university.ranking}</p>
            </div>
            <div className="glass-dark rounded-xl p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <p className="text-xs text-white/50 mb-1 uppercase tracking-wider font-semibold">Acceptance</p>
              <p className="text-xl font-bold text-white">{university.acceptanceRate || "N/A"}</p>
            </div>
            <div className="glass-dark rounded-xl p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <p className="text-xs text-white/50 mb-1 uppercase tracking-wider font-semibold">Avg. Tuition</p>
              <p className="text-xl font-bold text-white">{university.tuitionRange || "N/A"}</p>
            </div>
            <div className="glass-dark rounded-xl p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <p className="text-xs text-white/50 mb-1 uppercase tracking-wider font-semibold">Students</p>
              <p className="text-xl font-bold text-white">{university.students || "N/A"}</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/20">
              Apply Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
              Talk to Counselor
            </Button>
            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <Button size="icon" variant="ghost" className="rounded-full bg-white/5 hover:bg-white/10 text-white" title="Save University">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full bg-white/5 hover:bg-white/10 text-white" title="Compare">
                <Download className="w-5 h-5 rotate-90" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityHero;
