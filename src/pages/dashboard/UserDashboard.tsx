import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ArrowRight, BookOpen, Crown, LogOut, LayoutDashboard } from 'lucide-react';
import { OffersList } from '../../components/offers/OffersList';
import { MyApplications } from '../../components/dashboard/MyApplications';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageMeta } from '../../hooks/usePageMeta';

const UserDashboard = () => {
    usePageMeta({ title: 'My Dashboard | Akshaya Akademics', description: 'Student dashboard' });
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'applications'>('applications');

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
                            <p className="text-muted-foreground text-lg">Welcome back, {user?.name || user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 hover:scale-105 transition-all font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex border-b border-border mb-10 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('applications')}
                            className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'applications'
                                ? 'border-accent text-accent'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }`}
                        >
                            My Applications
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'applications' && (
                            <motion.div
                                key="applications"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-2xl font-bold text-foreground mb-6">Track Your Offer Applications</h2>
                                <MyApplications />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Offers Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative mt-16"
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
