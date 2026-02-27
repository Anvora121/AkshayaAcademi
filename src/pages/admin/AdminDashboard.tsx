import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ShieldCheck, Terminal, LogOut, Activity } from 'lucide-react';
import { OffersManager } from '../../components/admin/OffersManager';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
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

                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-bold mb-4 uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4" />
                                Super Admin
                            </div>

                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold text-foreground">Command Center</h1>
                            </div>
                            <p className="text-muted-foreground text-lg">System Management Console. Welcome back, {user?.email}</p>
                        </div>
                        <button 
                            onClick={logout} 
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 hover:scale-105 transition-all font-medium border border-red-500/20"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>

                    {/* System Status Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="premium-card p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-blue-500/20 bg-blue-500/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-500">
                                <Terminal className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground text-lg">Admissions & Offers Engine Active</p>
                                <p className="text-sm text-muted-foreground">
                                    All administrative privileges are enabled. Manage users, universities, and time-limited deals here.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500 font-medium text-sm border border-green-500/20">
                            <Activity className="w-4 h-4" />
                            Systems Operational
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <OffersManager />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
