import React, { useState } from 'react';
import { API_BASE_URL } from '@/config';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Sparkles, Globe, GraduationCap, Users, ShieldCheck, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const FEATURE_BULLETS = [
    { icon: <Globe className="w-5 h-5" />, text: 'Access 1000+ top universities across the globe' },
    { icon: <GraduationCap className="w-5 h-5" />, text: 'Personalised matching for courses & scholarships' },
    { icon: <Users className="w-5 h-5" />, text: 'Dedicated experts for every step of your journey' },
    { icon: <ShieldCheck className="w-5 h-5" />, text: 'Secured admissions & AI-powered visa guidance' },
];

const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Countries", href: "/education" },
    { label: "Universities", href: "/universities" },
    { label: "Find Courses", href: "/courses" },
];

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter your email and password.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data.user);

            // Role-based redirection logic
            if (data.user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (data.user.onboardingComplete === false) {
                navigate('/register', { replace: true, state: { step: data.user.onboardingStep || 2 } });
            } else {
                navigate('/dashboard/user', { replace: true });
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background selection:bg-accent/20">
            {/* ── Left Panel (Brand Storytelling) ── */}
            <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden flex-col justify-between p-16">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-background to-background" />
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
                <div className="absolute inset-0 grid-pattern opacity-[0.05]" />

                {/* Logo & Navigation */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-accent overflow-hidden shadow-lg shadow-accent/20 transition-transform duration-300 group-hover:scale-105">
                            <img src="/logo.png" alt="AA Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Akshaya <span className="text-accent">Akademics</span>
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground -mt-1">
                                Global Education
                            </span>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Brand Hero Copy */}
                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-sm font-semibold text-accent">Join the next generation of global students</span>
                        </div>

                        <h1 className="text-6xl font-black text-foreground leading-[1.1] mb-6 tracking-tight">
                            Build Your <br />
                            <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent italic">
                                Global Future
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-xl leading-relaxed mb-12 font-medium">
                            Premium guidance for students seeking excellence in overseas education. Your journey starts here.
                        </p>

                        <div className="space-y-6">
                            {FEATURE_BULLETS.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                                        {item.icon}
                                    </div>
                                    <span className="text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Stats & Trust */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="relative z-10 flex items-center gap-12 border-t border-border/50 pt-10"
                >
                  {[
                        { label: 'Successful Admits', value: '5000+' },
                        { label: 'Partner Universities', value: '250+' },
                        { label: 'Visa Approval', value: '98%' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <p className="text-3xl font-black text-foreground mb-0.5">{stat.value}</p>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── Right Panel (Modern Login Form) ── */}
            <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-16 py-12 relative overflow-hidden">
                {/* Background Blobs for Mobile/Laptops */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-foreground mb-3 leading-tight tracking-tight">Login</h2>
                        <p className="text-muted-foreground font-medium text-lg">
                           Continue your journey to success.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground/80 ml-1" htmlFor="login-email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-secondary/50 backdrop-blur-md border border-border rounded-2xl px-5 py-4 text-base text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-muted-foreground/60 font-medium"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                         <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-bold text-foreground/80" htmlFor="login-password">
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-accent hover:text-accent/80 font-bold transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-secondary/50 backdrop-blur-md border border-border rounded-2xl px-5 py-4 pr-12 text-base text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-muted-foreground/60 font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-accent transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-accent hover:bg-accent/90 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-accent/25 hover:shadow-accent/40 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Login to Account</span>
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer Actions */}
                    <div className="mt-8 text-center bg-secondary/30 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                        <p className="text-muted-foreground font-medium">
                            New to Akshaya Akadmi?{' '}
                            <Link
                                to="/register"
                                className="text-accent hover:text-accent/80 font-black transition-colors underline decoration-2 underline-offset-4"
                            >
                                Register Now
                            </Link>
                        </p>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-6 text-muted-foreground/40 font-bold text-xs uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> SECURE</span>
                        <span className="w-1 h-1 bg-muted-foreground/20 rounded-full" />
                        <span>ENCRYPTED</span>
                        <span className="w-1 h-1 bg-muted-foreground/20 rounded-full" />
                        <span>COMPLIANT</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginForm;
