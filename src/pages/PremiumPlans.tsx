import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Check, Star, Crown, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PremiumPlans = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleUpgrade = () => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please log in to upgrade your account.",
            });
            navigate('/login');
            return;
        }

        toast({
            title: "Processing Upgrade...",
            description: "Redirecting you to the secure payment gateway.",
        });
        
        // Simulate payment redirection
        setTimeout(() => {
            toast({
                title: "Upgrade Successful!",
                description: "Welcome to Premium. Your account will be updated shortly.",
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            <Header />
            
            <main className="flex-1">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 -z-10" />

                <section className="pt-32 pb-20 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold mb-6 tracking-wide uppercase"
                            >
                                <Crown className="w-4 h-4" />
                                Upgrade Your Future
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6"
                            >
                                Choose The Ultimate <span className="text-gradient">Advantage</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            >
                                Secure guaranteed scholarships, access hidden university offers, and fast-track your visa with our exclusive premium membership.
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Free Tier */}
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="premium-card p-10 flex flex-col justify-between group hover:border-accent/40 transition-colors"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground mb-2">Basic Student</h3>
                                            <p className="text-muted-foreground">Essential tools for your journey</p>
                                        </div>
                                    </div>
                                    <div className="mb-8">
                                        <span className="text-5xl font-bold text-foreground">₹0</span>
                                        <span className="text-muted-foreground">/forever</span>
                                    </div>
                                    <ul className="space-y-4 mb-8">
                                        {[
                                            "Access to basic university listings",
                                            "Standard application processing",
                                            "General admission guidelines",
                                            "Community forum access"
                                        ].map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-accent shrink-0" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {user?.role === 'user' ? (
                                    <Button variant="outline" className="w-full h-14 text-lg border-accent/20 hover:bg-accent/10" disabled>
                                        Current Plan
                                    </Button>
                                ) : (
                                    <Link to="/login">
                                        <Button variant="outline" className="w-full h-14 text-lg border-accent/20 hover:bg-accent/10">
                                            Get Started
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>

                            {/* Premium Tier */}
                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="premium-card p-10 flex flex-col justify-between border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-[50px] -z-10" />
                                
                                <div className="absolute top-6 right-6">
                                    <div className="px-3 py-1 bg-yellow-500 text-yellow-950 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Most Popular
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                                                Premium Member <Crown className="w-5 h-5 text-yellow-500" />
                                            </h3>
                                            <p className="text-muted-foreground">Maximum advantage & fast-tracking</p>
                                        </div>
                                    </div>
                                    <div className="mb-8">
                                        <span className="text-5xl font-bold text-foreground">₹8,499</span>
                                        <span className="text-muted-foreground">/year</span>
                                    </div>
                                    <ul className="space-y-4 mb-8">
                                        {[
                                            "Access to exclusive time-limited offers",
                                            "Guaranteed ₹1 Lakh+ scholarship opportunities",
                                            "Fast-tracked visa processing assistance (24hr)",
                                            "1-on-1 priority counselor matching",
                                            "Direct application to elite universities",
                                            "Dedicated success manager"
                                        ].map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <Star className="w-5 h-5 text-yellow-500 shrink-0" />
                                                <span className="text-foreground/90 font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <Button 
                                    onClick={handleUpgrade}
                                    className="w-full h-14 text-lg bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all group"
                                >
                                    Upgrade to Premium
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </section>
                
                {/* Feature Highlights */}
                <section className="py-20 border-t border-border bg-secondary/20">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6">
                                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-6 text-yellow-500">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-3">Instant Access</h4>
                                <p className="text-muted-foreground">Unlock the premium portal immediately upon upgrading.</p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6">
                                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 text-accent">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-3">Secure Payment</h4>
                                <p className="text-muted-foreground">Enterprise-grade encryption for all transactions.</p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-6">
                                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6 text-green-500">
                                    <Star className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-3">Guaranteed Success</h4>
                                <p className="text-muted-foreground">We ensure you get value through our priority placement.</p>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PremiumPlans;
