import React, { useState } from 'react';
import { API_BASE_URL } from '@/config';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();


    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate reset token');
            }

            toast({ title: 'OTP Process Initiated', description: data.message });
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            toast({
                title: 'Password Reset Successful',
                description: 'You can now log in with your new password.',
            });

            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-background relative">
            {/* Background Effects */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute inset-0 grid-pattern opacity-10 -z-10 pointer-events-none" />

            <Link to="/login" className="absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md premium-card p-8 bg-background/50 backdrop-blur-xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 text-accent">
                        {step === 1 ? <KeyRound className="w-8 h-8" /> : <MailCheck className="w-8 h-8" />}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Reset Password</h2>
                    <p className="text-muted-foreground">
                        {step === 1
                            ? "Enter your email address to receive a 6-digit verification code."
                            : "Enter the OTP sent to your email and your new password."}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-foreground text-background hover:bg-accent hover:text-white py-6 rounded-xl font-semibold transition-all h-auto text-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending OTP...' : 'Send Reset Code'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                6-Digit OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground tracking-widest text-center focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-lg font-mono font-bold"
                                placeholder="123456"
                                maxLength={6}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-accent hover:bg-accent/90 text-white py-6 rounded-xl font-semibold transition-all h-auto text-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Reset Password'}
                        </Button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
