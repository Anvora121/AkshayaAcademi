import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Countries", href: "/education" },
  { label: "Universities", href: "/universities" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "header-glass shadow-soft py-2"
          : "bg-slate-900/60 backdrop-blur-md border-b border-white/10 py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 overflow-hidden",
              scrolled ? "bg-primary" : "bg-white/10 backdrop-blur-sm"
            )}>
              <img src="/akshaya-logo.png" alt="AA Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-xl font-bold tracking-tight transition-colors",
                scrolled ? "text-foreground" : "text-white"
              )}>
                Akshaya <span className="text-accent">Akademics</span>
              </span>
              <span className={cn(
                "text-[10px] font-medium uppercase tracking-widest transition-colors -mt-0.5",
                scrolled ? "text-muted-foreground" : "text-white/60"
              )}>
                Global Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                  isActive(item.href)
                    ? scrolled
                      ? "text-accent bg-accent/10"
                      : "text-white bg-white/10"
                    : scrolled
                      ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'subscribed' ? '/premium-dashboard' : '/dashboard'}>
                <Button
                  variant={scrolled ? "default" : "outline"}
                  className={cn(
                    "font-semibold transition-all",
                    !scrolled && "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  )}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className={cn(
                  "font-medium text-sm transition-colors",
                  scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"
                )}>
                  Login
                </Link>
                <Link to="/login" state={{ isSignup: true }}>
                  <Button
                    variant={scrolled ? "default" : "outline"}
                    className={cn(
                      "font-semibold transition-all",
                      !scrolled && "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                    )}
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              scrolled ? "hover:bg-muted" : "hover:bg-white/10"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={cn("w-6 h-6", scrolled ? "text-foreground" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", scrolled ? "text-foreground" : "text-white")} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <nav className="py-4 border-t border-border/50 mt-2 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <Link 
                    to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'subscribed' ? '/premium-dashboard' : '/dashboard'} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="default" className="w-full mt-2 font-semibold">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full mt-2 font-semibold border-border">
                        Login
                      </Button>
                    </Link>
                    <Link to="/login" state={{ isSignup: true }} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full mt-2 font-semibold">
                        Get Started
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
