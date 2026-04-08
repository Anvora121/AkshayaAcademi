import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    Users, Briefcase, Activity, BarChart2, CheckCircle, 
    LogOut, Settings, PanelLeftClose, PanelLeftOpen, Globe, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OverviewAnalytics } from '../../components/admin/OverviewAnalytics';
import { StudentsTable } from '../../components/admin/StudentsTable';
import { UniversitiesManager } from '../../components/admin/UniversitiesManager';
import { CountriesManager } from '../../components/admin/CountriesManager';
import { ApplicationsTracker } from '../../components/admin/ApplicationsTracker';

type AdminTab = 'overview' | 'students' | 'universities' | 'countries' | 'applications';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { id: 'overview', label: 'Overview', icon: BarChart2 },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'applications', label: 'Applications', icon: Briefcase },
        { id: 'universities', label: 'Universities', icon: Building2 },
        { id: 'countries', label: 'Countries', icon: Globe },
    ];

    return (
        <div className="flex bg-[#F8F9FA] dark:bg-[#0A0A0A] min-h-screen text-foreground selection:bg-blue-500/30">
            {/* Sidebar Navigation */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="hidden md:flex flex-col border-r border-border/50 bg-white dark:bg-[#0A0A0A] z-20 shrink-0 sticky top-0 h-screen transition-all shadow-[1px_0_10px_rgba(0,0,0,0.02)]"
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
                    {isSidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
                            <span className="font-bold tracking-tight text-lg">Admin View</span>
                        </motion.div>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-muted-foreground hover:text-foreground">
                        {isSidebarOpen ? <PanelLeftClose className="w-5 h-5"/> : <PanelLeftOpen className="w-5 h-5 mx-auto"/> }
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {isSidebarOpen && <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Management</p>}
                    
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group",
                                    isActive 
                                        ? "text-blue-500 font-semibold" 
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <motion.div layoutId="adminSidebarActive" className="absolute inset-0 bg-blue-500/10 rounded-lg -z-10" />
                                )}
                                <item.icon className={cn("w-5 h-5", !isSidebarOpen && "mx-auto")} />
                                {isSidebarOpen && <span>{item.label}</span>}
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-4 hidden group-hover:block bg-popover text-popover-foreground px-2 py-1 rounded shadow-md text-xs whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border/50">
                    <button 
                        onClick={logout}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                {/* Top Nav */}
                <header className="h-16 px-6 md:px-10 flex items-center justify-between border-b border-border/50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight capitalize">{activeTab}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Return to Website
                        </Link>
                        <div className="h-4 w-px bg-border"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border">
                                <Settings className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium leading-none">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-muted-foreground">Admin Status</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {/* Render Content Based on Active Tab */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'overview' && <OverviewAnalytics />}
                            {activeTab === 'students' && <StudentsTable />}
                            {activeTab === 'universities' && <UniversitiesManager />}
                            {activeTab === 'countries' && <CountriesManager />}
                            {activeTab === 'applications' && <ApplicationsTracker />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
