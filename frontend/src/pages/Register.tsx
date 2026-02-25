import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const gradeOptions = Array.from({ length: 10 }, (_, i) => ({ value: i + 3, label: `Grade ${i + 3}` }));
const avatars = ['🐱', '🐶', '🦊', '🐼', '🐨', '🦁', '🐸', '🐵', '🦄', '🐲', '🦋', '🐯'];

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        grade: 5,
        parentEmail: '',
        avatar: '🐱',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        try {
            await register(form);
            toast.success('Account created! Welcome to KidsCode Arena! 🎉');
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-kid-purple via-kid-pink to-kid-orange items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative text-white text-center">
                    <div className="text-8xl mb-6 float-animate">🎉</div>
                    <h2 className="font-display text-4xl font-extrabold mb-4">Join the Arena!</h2>
                    <p className="text-white/80 text-lg mb-8 max-w-sm">Create your account and start your coding adventure today. It's FREE!</p>
                    <div className="text-sm bg-white/10 rounded-2xl p-4 space-y-2 text-left">
                        {['✅ 50+ coding problems', '🏆 Weekend hackathons', '👨‍💻 Expert mentors', '🔥 Streak rewards', '🏅 Achievement badges', '🌍 Global leaderboard'].map(item => (
                            <div key={item}>{item}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md py-8"
                >
                    <Link to="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center text-white font-bold">K</div>
                        <span className="font-display font-bold text-xl dark:text-white">KidsCode Arena</span>
                    </Link>

                    <h1 className="font-display text-3xl font-extrabold dark:text-white mb-2">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Start coding for free in 60 seconds! 🚀</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Avatar picker */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Choose your avatar
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {avatars.map((av) => (
                                    <button
                                        key={av}
                                        type="button"
                                        onClick={() => setForm({ ...form, avatar: av })}
                                        className={`text-2xl p-2 rounded-xl transition-all ${form.avatar === av ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-110' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                    >
                                        {av}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    placeholder="cool_coder_42"
                                    required
                                    minLength={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Grade</label>
                                <select
                                    value={form.grade}
                                    onChange={e => setForm({ ...form, grade: Number(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                >
                                    {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="min. 6 characters"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Parent Email <span className="text-slate-400 font-normal">(optional, for safety)</span>
                            </label>
                            <input
                                type="email"
                                value={form.parentEmail}
                                onChange={e => setForm({ ...form, parentEmail: e.target.value })}
                                placeholder="parent@email.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>

                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-xs">
                            🔒 Your data is secure and COPPA-compliant. We never share your information with third parties.
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : '🎉'}
                            {isLoading ? 'Creating account...' : 'Create Free Account'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in →</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
