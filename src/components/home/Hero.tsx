import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const stats = [
    { value: "10K+", label: "Students Placed", icon: Users },
    { value: "500+", label: "Partner Universities", icon: Award },
    { value: "11", label: "Countries", icon: Globe },
    { value: "95%", label: "Visa Success", icon: TrendingUp },
  ];

  const countries = [
    { name: "United States", flag: "🇺🇸", id: "us" },
    { name: "United Kingdom", flag: "🇬🇧", id: "uk" },
    { name: "Canada", flag: "🇨🇦", id: "canada" },
    { name: "Germany", flag: "🇩🇪", id: "germany" },
    { name: "Australia", flag: "🇦🇺", id: "australia" },
    { name: "New Zealand", flag: "🇳🇿", id: "newzealand" },
    { name: "Austria", flag: "🇦🇹", id: "austria" },
    { name: "Poland", flag: "🇵🇱", id: "poland" },
    { name: "Switzerland", flag: "🇨🇭", id: "switzerland" },
    { name: "Netherlands", flag: "🇳🇱", id: "netherlands" },
    { name: "Sweden", flag: "🇸🇪", id: "sweden" },
  ];

  // Real campus imagery from top universities
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
      alt: "Harvard University Campus",
      university: "Harvard University",
    },
    {
      url: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=80",
      alt: "Oxford University",
      university: "Oxford University",
    },
    {
      url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1920&q=80",
      alt: "MIT Campus",
      university: "MIT",
    },
    {
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80",
      alt: "University Campus",
      university: "Stanford University",
    },
    {
      url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80",
      alt: "Cambridge University",
      university: "Cambridge University",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-width Background Image with Ken Burns effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImages[currentImageIndex].url})`,
              transform: 'scale(1.05)',
            }}
          />
          {/* Premium Gradient Overlay - Minimal for maximum image visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating Orbs */}
      <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] animate-float" />
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-teal/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />

      {/* Image Navigation */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
        <button
          onClick={prevImage}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-accent w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
            />
          ))}
        </div>
        <button
          onClick={nextImage}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Current University Label */}
      <motion.div
        key={`label-${currentImageIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-8 left-8 z-20"
      >
        <span className="text-sm text-white/60 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          {heroImages[currentImageIndex].university}
        </span>
      </motion.div>

      <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-180px)]">

          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-white/80 font-medium">Trusted by 10,000+ Students Globally</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight"
            >
              From University Selection to{" "}
              <span className="text-gradient">Global Career</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed"
            >
              Your complete overseas education & career enablement partner. Expert guidance from admission to placement across 11 countries.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <Link to="/enquiry">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 h-14 text-base group shadow-accent"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/universities">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 h-14 text-base backdrop-blur-sm"
                >
                  Explore Universities
                </Button>
              </Link>
            </motion.div>

            {/* Countries Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {countries.map((country, i) => (
                <Link
                  key={country.name}
                  to={`/education?country=${country.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{country.flag}</span>
                  <span className="text-white/70 hidden sm:inline group-hover:text-white transition-colors">{country.name}</span>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Stats & Visual */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-[#22384A] rounded-2xl p-6 group hover:bg-[#2B4356] transition-all duration-300 relative overflow-hidden shadow-lg border border-white/5"
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 animate-shimmer" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <stat.icon className="w-5 h-5 text-[#FF6B2C]" />
                        </div>
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/50">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Journey Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-6 bg-[#22384A] rounded-2xl p-6 shadow-lg border border-white/5"
              >
                <p className="text-sm text-white/40 mb-4 font-medium uppercase tracking-wider">Your Journey</p>
                <div className="flex items-center justify-between">
                  {["Explore", "Apply", "Visa", "Study", "Work", "Settle"].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className="flex flex-col items-center group cursor-pointer">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:scale-110 ${index === 0 ? 'bg-[#FF6B2C] text-white' : 'bg-[#314A5D] text-white/50 group-hover:bg-[#3D5B71]'
                          }`}>
                          {index + 1}
                        </div>
                        <span className="text-[10px] sm:text-xs text-white/60 mt-2 hidden md:block group-hover:text-white transition-colors">{step}</span>
                      </div>
                      {index < 5 && (
                        <div className="w-6 md:w-12 h-px bg-[#314A5D] mx-1 md:mx-4 -translate-y-2 lg:-translate-y-3" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80L60 72C120 64 240 48 360 42.7C480 37 600 43 720 48C840 53 960 59 1080 58.7C1200 59 1320 53 1380 50L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
