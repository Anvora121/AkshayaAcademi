import React, { useState, useEffect } from 'react';
import { OfferCard, OfferData } from './OfferCard';

export const OffersList = () => {
    const [offers, setOffers] = useState<OfferData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data for UI demonstration purposes while backend is not connected
    useEffect(() => {
        // In a real scenario, this would be: 
        // fetch('http://localhost:5000/api/offers').then(res => res.json()).then(data => setOffers(data))

        setTimeout(() => {
            setOffers([
                {
                    _id: '1',
                    universityName: 'Harvard University',
                    description: 'Special early-bird discount on global computer science masters program application fees and partial scholarship.',
                    originalFee: 50000,
                    discountedFee: 35000,
                    offerStartDate: new Date().toISOString(),
                    offerEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
                    isActive: true,
                    premiumOnlyAction: true
                },
                {
                    _id: '2',
                    universityName: 'Oxford University',
                    description: 'Limited spots available for international students with guaranteed housing subsidy.',
                    originalFee: 45000,
                    discountedFee: 38000,
                    offerStartDate: new Date().toISOString(),
                    offerEndDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
                    isActive: true,
                    premiumOnlyAction: true
                },
                {
                    _id: '3',
                    universityName: 'MIT',
                    description: 'Engineering excellence grant for top candidates applying this week.',
                    originalFee: 55000,
                    discountedFee: 40000,
                    offerStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    offerEndDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Expired 2 days ago
                    isActive: false,
                    premiumOnlyAction: true
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return <div className="py-20 text-center text-muted-foreground">Loading premium offers...</div>;
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
        </div>
    );
};
