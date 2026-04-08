import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/config';
import { Search, Filter, MoreHorizontal, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const ApplicationsTracker = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/application`, { credentials: 'include' });
            if (res.ok) {
                setApplications(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/application/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });

            if (res.ok) {
                setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
            }
        } catch (error) {
            console.error("Status update failed", error);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    };

    const filteredApps = applications.filter(app => 
        app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.university?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search student or university..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-black border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">Student</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">University</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Applied On</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Loading Applications...</td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No applications found.</td>
                                </tr>
                            ) : filteredApps.map((app) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    key={app._id} className="hover:bg-secondary/20 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">{app.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{app.user?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">{app.university?.name || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{app.country?.name || app.university?.country || ''}</div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {format(new Date(app.appliedAt), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", getStatusStyle(app.status))}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {app.status !== 'Approved' && (
                                                <button onClick={() => updateStatus(app._id, 'Approved')} className="p-1.5 rounded-md hover:bg-green-500/10 text-green-500 transition-colors tooltip" aria-label="Approve">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            {app.status !== 'Rejected' && (
                                                <button onClick={() => updateStatus(app._id, 'Rejected')} className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors tooltip" aria-label="Reject">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                            {app.status !== 'Pending' && (
                                                <button onClick={() => updateStatus(app._id, 'Pending')} className="p-1.5 rounded-md hover:bg-yellow-500/10 text-yellow-500 transition-colors tooltip" aria-label="Mark Pending">
                                                    <Clock className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
