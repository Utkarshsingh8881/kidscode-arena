import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const demoAccounts = [
    { role: '🎓 Student', email: 'alex@example.com', password: 'demo123', desc: 'Full student dashboard' },
    { role: '🛡️ Admin', email: 'admin@kidscode.com', password: 'admin123', desc: 'Full admin access' },
    { role: '🔧 Developer', email: 'dev@kidscode.com', password: 'dev123', desc: 'Dev dashboard access' },
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            toast.success('Welcome back! 🎉');
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        try {
            await login(demoEmail, demoPass);
            toast.success('Welcome to KidsCode Arena! 🚀');
            navigate('/dashboard');
        } catch {
            setError('Demo login failed. Make sure the backend is running.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 animated-gradient items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative text-white text-center">
                    <div className="text-8xl mb-8 float-animate">🚀</div>
                    <h2 className="font-display text-4xl font-extrabold mb-4">Welcome Back!</h2>
                    <p className="text-white/80 text-lg mb-8 max-w-sm">Continue your coding adventure. Your streak is waiting for you!</p>
                    <div className="grid grid-cols-3 gap-4">
                        {['🔥', '⚡', '🏆', '💎', '🎯', '🌟'].map((emoji, i) => (
                            <div key={i} className="text-4xl bg-white/10 rounded-2xl p-4">{emoji}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Link to="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center text-white font-bold">K</div>
                        <span className="font-display font-bold text-xl dark:text-white">KidsCode Arena</span>
                    </Link>

                    <h1 className="font-display text-3xl font-extrabold dark:text-white mb-2">Sign In</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Ready to code? Let's go! 🎮</p>

                    {/* Demo quick access */}
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-3 uppercase tracking-wide">⚡ Quick Demo Access</p>
                        <div className="space-y-2">
                            {demoAccounts.map((acc) => (
                                <button
                                    key={acc.email}
                                    onClick={() => handleDemoLogin(acc.email, acc.password)}
                                    className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 rounded-xl text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-600 group"
                                >
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{acc.role}</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-xs">{acc.desc}</span>
                                    <ArrowRight size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : null}
                            {isLoading ? 'Signing in...' : 'Sign In 🎮'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
                        New to KidsCode Arena?{' '}
                        <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                            Create a free account →
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
