import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Search, Home, FileQuestion } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";

const NotFound = () => {
  usePageMeta({
    title: "Page Not Found | Akshaya Akademics",
    description: "The page you are looking for does not exist.",
  });

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <Header />

      {/* Background Effects */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-10 -z-10 pointer-events-none" />

      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/5 leading-none mb-6 drop-shadow-2xl"
          >
            404
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Destination Not Found
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
            The page you're looking for might have been moved, deleted, or possibly never existed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="h-14 px-8 text-base font-semibold bg-foreground text-background hover:bg-accent hover:text-white transition-all shadow-lg hover:shadow-accent/25 hover:-translate-y-1">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Back to Homepage
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-14 px-8 text-base border-border hover:bg-secondary">
              <Link to="/education" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Explore Courses
              </Link>
            </Button>

            <Button asChild variant="ghost" className="h-14 px-6 text-base text-muted-foreground hover:text-foreground">
              <Link to="/enquiry" className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                Get Help
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
