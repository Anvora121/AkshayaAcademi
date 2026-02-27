import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail, MessageCircle, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-white/80 font-medium">Free Consultation</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Start Your{" "}
            <span className="text-gradient">Global Journey</span>?
          </h2>
          
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Book a free consultation with our expert counselors. Get personalized guidance on universities, scholarships, and career pathways.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link to="/enquiry">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 h-14 text-base group pulse-glow"
              >
                Book Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+1234567890">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 h-14 text-base"
              >
                <Phone className="w-5 h-5" />
                Call Us Now
              </Button>
            </a>
          </div>

          {/* Contact Options */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            <a href="mailto:info@akshayaakademics.com" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <Mail className="w-5 h-5 text-accent" />
              <span>info@akshayaakademics.com</span>
            </a>
            <a href="tel:+1234567890" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <Phone className="w-5 h-5 text-accent" />
              <span>+1 (234) 567-890</span>
            </a>
            <span className="flex items-center gap-2 text-white/60">
              <MessageCircle className="w-5 h-5 text-accent" />
              <span>WhatsApp Available</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
