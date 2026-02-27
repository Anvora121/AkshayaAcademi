import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: "Overseas Education", href: "/education" },
      { label: "Scholarship Guidance", href: "/services" },
      { label: "Visa Assistance", href: "/services" },
      { label: "Language Training", href: "/services" },
      { label: "Placement Services", href: "/services" },
    ],
    destinations: [
      { label: "United States", href: "/education?country=us" },
      { label: "United Kingdom", href: "/education?country=uk" },
      { label: "Canada", href: "/education?country=canada" },
      { label: "Germany", href: "/education?country=germany" },
      { label: "Australia", href: "/education?country=australia" },
    ],
    company: [
      { label: "Universities", href: "/universities" },
      { label: "Destinations", href: "/education" },
      { label: "Enquiry", href: "/enquiry" },
      { label: "Services", href: "/services" },
      { label: "Find University", href: "/universities" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center overflow-hidden">
                <img src="/akshaya-logo.png" alt="AA Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-bold block">
                  Akshaya <span className="text-accent">Akademics</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-primary-foreground/50">
                  Global Education
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted partner for overseas education and career guidance. From university selection to global placement — we handle everything.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-primary-foreground/5 hover:bg-accent flex items-center justify-center transition-all duration-300 group"
                >
                  <social.icon className="w-4 h-4 text-primary-foreground/60 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-base mb-5">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-base mb-5">Destinations</h4>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-base mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-base mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-primary-foreground/60">
                  123 Education Lane,<br />Global City, 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href="tel:+1234567890" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:info@akshayaakademics.com" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  info@akshayaakademics.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/50">
              © {currentYear} Akshaya Akademics. All rights reserved.
            </p>
            <p className="text-xs text-primary-foreground/30 text-center md:text-right max-w-md">
              Disclaimer: All information is indicative. Please verify with official sources before making decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
