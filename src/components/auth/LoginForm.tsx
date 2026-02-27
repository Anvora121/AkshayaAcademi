import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
    const location = useLocation();
    const [isSignup, setIsSignup] = useState(location.state?.isSignup || false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = isSignup ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || (isSignup ? 'Registration failed' : 'Login failed'));
            }

            login(data.user, data.token);

            // Role-based redirection
            if (data.user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (data.user.role === 'subscribed') {
                navigate('/premium-dashboard', { replace: true });
            } else {
                // user role
                navigate('/dashboard', { replace: true });
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 bg-background relative">
            <Link to="/" className="absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md premium-card p-8"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="text-muted-foreground">{isSignup ? 'Enter your details to register' : 'Enter your credentials to access your account'}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg font-semibold transition-all h-auto"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In')}
                    </Button>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                type="button"
                                onClick={() => setIsSignup(!isSignup)}
                                className="text-accent hover:text-accent/80 font-semibold"
                            >
                                {isSignup ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>For demo purposes:</p>
                        <p>Admin: admin@test.com</p>
                        <p>Subscribed: sub@test.com</p>
                        <p>User: user@test.com</p>
                        <p>(Password: 123456)</p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginForm;
