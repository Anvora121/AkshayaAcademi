import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";

const Unauthorized = () => {
    usePageMeta({
        title: "Access Denied | Akshaya Akademics",
        description: "You do not have permission to view this page.",
    });

    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            <Header />

            {/* Background Effects */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute inset-0 grid-pattern opacity-10 -z-10 pointer-events-none" />

            <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="max-w-md w-full text-center premium-card p-10 border-red-500/20 bg-background/50 backdrop-blur-xl"
                >
                    <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] text-red-500">
                        <ShieldAlert className="w-10 h-10" />
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>

                    <p className="text-muted-foreground mb-8 text-lg">
                        You don't have the required permissions to view this secure area. This usually means you need an active Premium Subscription or Admin rights.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90">
                            <Link to="/premium-plans">
                                View Premium Plans
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="w-full h-12 text-base border-border hover:bg-secondary">
                            <Link to="/login" className="flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Return to Login
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" className="w-full h-12 text-base text-muted-foreground hover:text-foreground mt-2">
                            <Link to="/" className="flex items-center justify-center gap-2">
                                <Home className="w-4 h-4" />
                                Go to Homepage
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Unauthorized;
