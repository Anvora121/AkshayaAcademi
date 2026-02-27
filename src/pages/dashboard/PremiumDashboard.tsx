import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ArrowRight, Award, Crown, LogOut, Sparkle, Star } from 'lucide-react';
import { OffersList } from '../../components/offers/OffersList';
import { motion } from 'framer-motion';

const PremiumDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 -z-10" />

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

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-500 text-sm font-bold mb-4 tracking-wide uppercase shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <Crown className="w-4 h-4" />
                                Premium Member
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 flex items-center gap-3">
                                Premium Portal
                                <Sparkle className="w-8 h-8 text-yellow-500" />
                            </h1>
                            <p className="text-muted-foreground text-lg">Welcome to your exclusive dashboard, {user?.email}</p>
                        </div>
                        <button 
                            onClick={logout} 
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 hover:scale-105 transition-all font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>

                    {/* Premium Banner */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden rounded-3xl p-8 lg:p-12 mb-16 border-2 border-yellow-500/20 bg-gradient-to-br from-secondary/80 to-background/50 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/20 blur-[80px] rounded-full" />
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Award className="w-8 h-8 text-yellow-500" />
                                    <h2 className="text-3xl font-bold text-foreground">Exclusive Benefits Unlocked</h2>
                                </div>
                                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                    Your premium subscription grants you immediate access to all flash sales, guaranteed application processing within 24 hours, and priority counselor matching. 
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 font-medium border border-yellow-500/20">
                                        <Star className="w-4 h-4" /> Priority Processing
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent font-medium border border-accent/20">
                                        <Sparkle className="w-4 h-4" /> Scholarship Guarantee
                                    </div>
                                </div>
                            </div>
                            
                            <button className="whitespace-nowrap inline-flex items-center justify-center gap-2 px-8 py-5 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:-translate-y-1">
                                Browse Private Offers
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Offers Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-8">
                            Premium Priority Queue
                            <span className="text-sm px-3 py-1 bg-secondary text-muted-foreground rounded-full border border-border">Exclusive</span>
                        </h3>
                        <OffersList />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PremiumDashboard;
