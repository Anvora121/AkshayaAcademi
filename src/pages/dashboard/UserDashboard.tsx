import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Crown, LogOut, LayoutDashboard, User } from 'lucide-react';
import { OffersList } from '../../components/offers/OffersList';
import { MyApplications } from '../../components/dashboard/MyApplications';
import { ProfileCard } from '../../components/dashboard/ProfileCard';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageMeta } from '../../hooks/usePageMeta';

type ActiveTab = 'applications' | 'profile';

const UserDashboard = () => {
    usePageMeta({ title: 'My Dashboard | Akshaya Akademics', description: 'Student dashboard' });
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>('applications');

    const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { id: 'applications', label: 'My Applications', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute inset-0 grid-pattern opacity-10 -z-10 pointer-events-none" />

            <div className="pt-24 pb-16 px-6 relative z-10 w-full">
                <div className="max-w-7xl mx-auto">

                    {/* ── Header ── */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
                    >
                        <div>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group text-sm font-medium"
                            >
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
                            <p className="text-muted-foreground text-lg">
                                Welcome back,{' '}
                                <span className="text-foreground font-medium">{user?.name || user?.email}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/premium-plans"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl hover:bg-accent/20 transition-all text-sm font-medium"
                            >
                                <Crown className="w-4 h-4" />
                                Upgrade to Premium
                            </Link>
                            <button
                                onClick={logout}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 hover:scale-105 transition-all font-medium text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>

                    {/* ── Onboarding Completion Banner ── */}
                    {user?.onboardingComplete === false && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex items-center justify-between gap-4 p-4 bg-accent/10 border border-accent/30 rounded-xl"
                        >
                            <div>
                                <p className="text-sm font-semibold text-foreground">Complete your profile to unlock full matching</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Your application is saved — finish the remaining steps to get personalised university recommendations.
                                </p>
                            </div>
                            <Link
                                to="/register"
                                className="shrink-0 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
                            >
                                Continue →
                            </Link>
                        </motion.div>
                    )}

                    {/* ── Tabs ── */}
                    <div className="flex border-b border-border mb-10 overflow-x-auto gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-4 px-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-accent text-accent'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Tab Content ── */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'applications' && (
                            <motion.div
                                key="applications"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold text-foreground mb-6">Track Your Offer Applications</h2>
                                <MyApplications />

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
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
                                    <Link
                                        to="/register"
                                        className="flex items-center gap-1.5 text-sm text-accent font-medium border border-accent/30 rounded-xl px-4 py-2 hover:bg-accent/10 transition-colors"
                                    >
                                        Edit Profile
                                    </Link>
                                </div>
                                <ProfileCard />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
