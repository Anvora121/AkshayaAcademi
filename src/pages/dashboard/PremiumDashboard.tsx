import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    ArrowLeft, Crown, LogOut, Star, Sparkles, GalleryVerticalEnd,
    CheckCircle2, Zap, Shield, Users, Clock, Award, ChevronRight
} from 'lucide-react';
import { OffersList } from '../../components/offers/OffersList';
import { MyApplications } from '../../components/dashboard/MyApplications';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link as RouterLink } from 'react-router-dom';

type Tab = 'plan' | 'offers' | 'applications';

const PREMIUM_BENEFITS = [
    { icon: <Zap className="w-5 h-5 text-yellow-500" />, title: 'Priority Application Processing', desc: 'Your applications are reviewed and processed before free-tier users.' },
    { icon: <Shield className="w-5 h-5 text-yellow-500" />, title: 'Dedicated Personal Advisor', desc: 'Get assigned a personal education advisor for personalised guidance.' },
    { icon: <Star className="w-5 h-5 text-yellow-500" />, title: 'Exclusive University Offers', desc: 'Access scholarships, fee waivers, and deals only available to premium members.' },
    { icon: <Users className="w-5 h-5 text-yellow-500" />, title: 'Visa Assistance', desc: 'Premium support for student visa applications with expert guidance.' },
    { icon: <Clock className="w-5 h-5 text-yellow-500" />, title: '24/7 Support Access', desc: 'Round-the-clock dedicated support via WhatsApp and email.' },
    { icon: <Award className="w-5 h-5 text-yellow-500" />, title: 'Application Guarantee', desc: 'We guarantee at least one successful university placement for premium members.' },
];

const PremiumDashboard = () => {
    React.useEffect(() => {
        document.title = 'Premium Dashboard | Akshaya Akademics';
    }, []);
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('plan');

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Glowing bg effects */}
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

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-500 text-sm font-bold mb-4 tracking-wide uppercase shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <Crown className="w-4 h-4" />
                                Premium Member
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 flex items-center gap-3">
                                Premium Portal
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Welcome back, <span className="text-foreground font-semibold">{user?.name || user?.email}</span>. Enjoy your exclusive benefits.
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 hover:scale-105 transition-all font-medium shrink-0"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>

                    {/* Quick Stats Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                    >
                        {[
                            { icon: <Star className="w-5 h-5 text-yellow-500" />, title: 'Priority Processing', desc: 'Your applications are reviewed first' },
                            { icon: <Crown className="w-5 h-5 text-yellow-500" />, title: 'Exclusive Offers Access', desc: 'Apply to premium-only university deals' },
                            { icon: <GalleryVerticalEnd className="w-5 h-5 text-yellow-500" />, title: 'Dedicated Advisor', desc: 'Personalised guidance at every step' },
                        ].map((perk, i) => (
                            <div key={i} className="premium-card p-5 flex items-start gap-4 border border-yellow-500/20">
                                <div className="p-2 rounded-xl bg-yellow-500/10 shrink-0">{perk.icon}</div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{perk.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{perk.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex border-b border-border mb-10 gap-2 overflow-x-auto">
                        {([
                            { id: 'plan' as Tab, label: '⭐ My Plan' },
                            { id: 'offers' as Tab, label: '🎁 Exclusive Offers' },
                            { id: 'applications' as Tab, label: '📋 My Applications' },
                        ]).map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-yellow-500 text-yellow-500'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">

                        {/* ── MY PLAN TAB ── */}
                        {activeTab === 'plan' && (
                            <motion.div
                                key="plan"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Plan Card */}
                                <div className="premium-card p-8 border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent relative overflow-hidden">
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-500 rounded-full border border-yellow-500/30 uppercase tracking-wider">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30">
                                            <Crown className="w-8 h-8 text-yellow-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Premium Membership</h2>
                                            <p className="text-muted-foreground">Full access to all benefits and exclusive offers</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            'Apply directly to exclusive university offers',
                                            'Priority processing on all applications',
                                            'Dedicated personal education advisor',
                                            'Visa assistance and documentation support',
                                            '24/7 WhatsApp and email support',
                                            'Guaranteed university placement assistance',
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                                <span className="text-sm text-foreground">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Full Benefits Grid */}
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                        Your Premium Benefits
                                        <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 font-normal">All Included</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {PREMIUM_BENEFITS.map((b, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.07 }}
                                                className="premium-card p-6 border border-yellow-500/10 hover:border-yellow-500/30 transition-all group"
                                            >
                                                <div className="p-3 rounded-xl bg-yellow-500/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                                                    {b.icon}
                                                </div>
                                                <h4 className="font-semibold text-foreground mb-2">{b.title}</h4>
                                                <p className="text-sm text-muted-foreground">{b.desc}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Need Help CTA */}
                                <div className="premium-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-border">
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1">Need personalised guidance?</h4>
                                        <p className="text-sm text-muted-foreground">Contact your dedicated advisor or raise a query through our enquiry form.</p>
                                    </div>
                                    <RouterLink to="/enquiry">
                                        <Button className="bg-accent hover:bg-accent/90 text-white shrink-0">
                                            Contact Advisor <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </RouterLink>
                                </div>
                            </motion.div>
                        )}

                        {/* ── EXCLUSIVE OFFERS TAB ── */}
                        {activeTab === 'offers' && (
                            <motion.div
                                key="offers"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">Exclusive Offers</h2>
                                    <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 font-bold">Premium Access</span>
                                </div>
                                <p className="text-muted-foreground mb-8">As a Premium Member, you have full access to apply to all university offers below. Your applications receive priority processing.</p>
                                <OffersList />
                            </motion.div>
                        )}

                        {/* ── MY APPLICATIONS TAB ── */}
                        {activeTab === 'applications' && (
                            <motion.div
                                key="applications"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    My Applications
                                    <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 font-normal">Priority Queue</span>
                                </h2>
                                <MyApplications />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PremiumDashboard;
