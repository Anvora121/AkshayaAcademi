import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ApplicationData {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        country: string;
    };
    offer: {
        _id: string;
        universityName: string;
        discountedFee: number;
    };
    status: 'pending' | 'approved' | 'rejected';
    appliedAt: string;
}

export const ApplicationsManager = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/offers/applications/all`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                setError('Failed to fetch applications');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchApplications();
    }, [user]);

    const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            const response = await fetch(`${API_BASE_URL}/offers/applications/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast({
                    title: "Application Updated",
                    description: `Application marked as ${newStatus}.`,
                });
                // Refresh the list locally
                setApplications(prev => prev.map(app =>
                    app._id === id ? { ...app, status: newStatus } : app
                ));
            } else {
                toast({
                    title: "Update Failed",
                    description: "Could not update application status.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "A network error occurred.",
                variant: "destructive"
            });
        }
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading applications...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Application Manager</h2>

            <div className="bg-secondary/30 rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-medium">Applicant</th>
                                <th className="px-6 py-4 font-medium">University Offer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-foreground">{app.user?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-muted-foreground">{app.user?.email}</p>
                                        <p className="text-xs text-muted-foreground">{app.user?.phone} | {app.user?.country}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-foreground">{app.offer?.universityName || 'Offer Deleted'}</p>
                                        <p className="text-xs text-muted-foreground">${app.offer?.discountedFee?.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${app.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                            app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {app.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex justify-end gap-2">
                                        {app.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/30"
                                                    onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30"
                                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
