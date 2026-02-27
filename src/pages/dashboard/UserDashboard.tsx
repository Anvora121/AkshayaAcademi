import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ArrowRight, BookOpen, Crown, LogOut, LayoutDashboard } from 'lucide-react';
import { OffersList } from '../../components/offers/OffersList';
import { motion } from 'framer-motion';

const UserDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute inset-0 grid-pattern opacity-10 -z-10 pointer-events-none" />

            <div className="pt-24 pb-16 px-6 relative z-10 w-full">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
                    >
                        <div>
                            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group text-sm font-medium">
                                <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-all">
                                    <ArrowLeft className="w-4 h-4" />
                                </div>
                                Back to Home
                            </Link>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-xl bg-accent/10 text-accent">
                                    <LayoutDashboard className="w-6 h-6" />
                                </div>
                                <h1 className="text-4xl font-bold text-foreground">My Student Portal</h1>
                            </div>
                            <p className="text-muted-foreground text-lg">Welcome back, {user?.email}</p>
                        </div>
                        <button 
                            onClick={logout} 
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 hover:scale-105 transition-all font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>

                    {/* Top Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="premium-card p-8 group hover:border-accent/40 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="p-3 rounded-2xl bg-secondary/80 text-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</span>
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mb-3">My Applications</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You have no active premium applications. Upgrade to Premium and explore top universities to begin your journey.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="premium-card p-8 flex flex-col justify-center items-start relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                            
                            <div className="p-3 rounded-2xl bg-accent/10 text-accent mb-6 border border-accent/20">
                                <Crown className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-foreground mb-2">Upgrade to Premium</h2>
                            <p className="text-muted-foreground mb-8 max-w-sm">
                                Unlock guaranteed scholarships, exclusive university access, and fast-tracked visa processing.
                            </p>
                            <Link to="/premium-plans" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background hover:bg-accent hover:text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-accent/25 hover:-translate-y-1">
                                View Premium Plans
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Offers Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <div className="absolute -top-6 left-0 w-24 h-1 bg-gradient-to-r from-accent to-transparent rounded-full" />
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-8">
                            Featured Global Offers
                        </h3>
                        <OffersList />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
