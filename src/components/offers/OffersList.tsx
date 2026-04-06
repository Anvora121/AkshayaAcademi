import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { OfferCard, OfferData } from './OfferCard';

export const OffersList = () => {
    const [offers, setOffers] = useState<OfferData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');

    const fetchOffers = async (currentPage: number) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/offers?page=${currentPage}&limit=6`);
            if (res.ok) {
                const data = await res.json();

                // Handle new paginated format
                if (data.offers && data.pagination) {
                    setOffers(data.offers);
                    setTotalPages(data.pagination.pages);
                    setPage(data.pagination.page);
                } else if (Array.isArray(data)) {
                    // Fallback for older non-paginated API if it sneaks through
                    setOffers(data);
                    setTotalPages(1);
                }
            } else {
                setError('Failed to load offers.');
            }
        } catch (err) {
            setError('Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers(page);
    }, [page]);

    if (isLoading && offers.length === 0) {
        return <div className="py-20 text-center text-muted-foreground">Loading premium offers...</div>;
    }

    if (error) {
        return <div className="py-20 text-center text-red-500 font-medium">{error}</div>;
    }

    if (offers.length === 0) {
        return <div className="py-12 text-center text-muted-foreground">No active offers available at the moment. Check back later!</div>;
    }

    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Time-Limited University Offers</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Exclusive discounts and scholarships available only to our premium members.
                    Act fast before the timer runs out.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map((offer) => (
                    <OfferCard key={offer._id} offer={offer} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 font-medium transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-muted-foreground font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 font-medium transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
