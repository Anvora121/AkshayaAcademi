import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface OfferData {
    _id: string;
    universityName: string;
    description: string;
    originalFee: number;
    discountedFee: number;
    offerStartDate: string;
    offerEndDate: string;
    isActive: boolean;
    premiumOnlyAction: boolean;
}

interface OfferCardProps {
    offer: OfferData;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const isExpired = !offer.isActive || new Date(offer.offerEndDate) < new Date();

    useEffect(() => {
        if (isExpired) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(offer.offerEndDate).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft(null); // Expired
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [offer.offerEndDate, isExpired]);

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        // In real app, make API call here.
        alert(`Applying to ${offer.universityName}...`);
    };

    const discountAmount = offer.originalFee - offer.discountedFee;
    const discountPercent = Math.round((discountAmount / offer.originalFee) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-6 transition-all ${isExpired
                ? 'premium-card opacity-60 grayscale border-border bg-muted/50'
                : 'premium-card hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10'
                }`}
        >
            {/* Discount Badge */}
            {!isExpired && (
                <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform rotate-12">
                    {discountPercent}% OFF
                </div>
            )}

            {isExpired && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-foreground/80 text-background font-bold py-2 px-6 rounded-full border border-border transform -rotate-12 text-lg backdrop-blur-sm">
                        OFFER CLOSED
                    </div>
                </div>
            )}

            <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-1">{offer.universityName}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
            </div>

            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-accent">${offer.discountedFee.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground/60 line-through">${offer.originalFee.toLocaleString()}</span>
                </div>
                <p className="text-xs text-green-400 font-medium">Save ${discountAmount.toLocaleString()}</p>
            </div>

            {!isExpired && timeLeft && (
                <div className="mb-6 p-3 bg-secondary rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider text-center">Offer ends in</p>
                    <div className="flex justify-center gap-3 text-center">
                        <div className="flex flex-col">
                            <span className="text-lg font-mono text-foreground">{timeLeft.days}</span>
                            <span className="text-[10px] text-muted-foreground">DAYS</span>
                        </div>
                        <span className="text-muted-foreground/60">:</span>
                        <div className="flex flex-col">
                            <span className="text-lg font-mono text-foreground">{timeLeft.hours.toString().padStart(2, '0')}</span>
                            <span className="text-[10px] text-muted-foreground">HRS</span>
                        </div>
                        <span className="text-muted-foreground/60">:</span>
                        <div className="flex flex-col">
                            <span className="text-lg font-mono text-foreground">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                            <span className="text-[10px] text-muted-foreground">MIN</span>
                        </div>
                        <span className="text-muted-foreground/60">:</span>
                        <div className="flex flex-col">
                            <span className="text-lg font-mono text-accent">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                            <span className="text-[10px] text-muted-foreground">SEC</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-auto">
                {user?.role === 'subscribed' || user?.role === 'admin' ? (
                    <Button
                        className="w-full bg-accent hover:bg-accent/90 text-white"
                        disabled={isExpired}
                        onClick={handleApply}
                    >
                        {isExpired ? 'Unavailable' : 'Apply Now'}
                    </Button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Button
                            className="w-full bg-secondary hover:bg-secondary/90 text-muted-foreground cursor-not-allowed border border-border"
                            disabled
                        >
                            Premium Only
                        </Button>
                        {!user && (
                            <p className="text-xs text-center text-muted-foreground mt-1">Log in to upgrade and apply</p>
                        )}
                        {user && (
                            <button
                                className="text-xs text-center text-accent hover:text-accent/80 transition-colors mt-1"
                                onClick={() => alert('Open upgrade modal here')}
                            >
                                Upgrade to Premium to Unlock
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
