import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Globe, Building2, TrendingUp } from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { API_BASE_URL } from '@/config';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-border/50 shadow-sm flex flex-col gap-4"
    >
        <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <Icon className="w-5 h-5" />
            </div>
            {trend && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {trend}</span>}
        </div>
        <div>
            <h3 className="text-3xl font-black text-foreground">{value}</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">{title}</p>
        </div>
    </motion.div>
);

export const OverviewAnalytics = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalApplications: 0, totalUniversities: 0, totalCountries: 0 });
    const [analytics, setAnalytics] = useState({ applicationsOverTime: [], usersByCountry: [], domainInterest: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/stats`, { credentials: 'include' }),
                    fetch(`${API_BASE_URL}/admin/analytics`, { credentials: 'include' })
                ]);
                
                if (statsRes.ok) setStats(await statsRes.json());
                if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="h-64 flex items-center justify-center text-muted-foreground">Loading Analytics Engine...</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Students" value={stats.totalUsers} icon={Users} trend="+12%" />
                <StatCard title="Active Applications" value={stats.totalApplications} icon={BookOpen} trend="+5%" />
                <StatCard title="Universities" value={stats.totalUniversities} icon={Building2} />
                <StatCard title="Target Countries" value={stats.totalCountries} icon={Globe} />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-border/50 shadow-sm">
                    <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider">Applications Over Time</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.applicationsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-border/50 shadow-sm">
                    <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider">Users by Country Preference</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.usersByCountry}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="country" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-border/50 shadow-sm">
                    <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider">Top Domain Interests</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.domainInterest}
                                    cx="50%" cy="50%"
                                    innerRadius={70} outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="domain"
                                >
                                    {analytics.domainInterest.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
