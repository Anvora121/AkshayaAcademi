import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface ApplicationData {
    _id: string;
    offer: {
        _id: string;
        universityName: string;
        discountedFee: number;
    };
    status: 'pending' | 'approved' | 'rejected';
    appliedAt: string;
}

export const MyApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${VITE_API_URL}/api/offers/applications/my`, {
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

        if (user) fetchApplications();
    }, [user]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-medium">Approved</span>;
            case 'rejected':
                return <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full font-medium">Rejected</span>;
            default:
                return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full font-medium">Pending Review</span>;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading applications...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    if (applications.length === 0) {
        return (
            <div className="text-center py-12 bg-secondary/30 rounded-lg border border-border">
                <p className="text-muted-foreground mb-4">You haven't applied to any premium offers yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((app, index) => (
                <motion.div
                    key={app._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-secondary/50 border border-border rounded-lg gap-4"
                >
                    <div>
                        <h4 className="font-semibold text-foreground">{app.offer?.universityName || 'Offer Unavailable'}</h4>
                        <p className="text-xs text-muted-foreground">
                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-foreground">${app.offer?.discountedFee?.toLocaleString() || 0}</p>
                            <p className="text-xs text-muted-foreground">Premium Fee</p>
                        </div>
                        {getStatusBadge(app.status)}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
