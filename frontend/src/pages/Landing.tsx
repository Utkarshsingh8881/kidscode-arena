import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Trophy, Users, Zap, Star, ArrowRight, Shield, Globe, BookOpen, Award } from 'lucide-react';

const features = [
    { icon: Code2, color: 'from-blue-500 to-cyan-400', title: 'Code & Learn', desc: '50+ problems across Python, JavaScript, Java & C++. Perfect for all skill levels.' },
    { icon: Trophy, color: 'from-yellow-500 to-orange-400', title: 'Weekend Hackathons', desc: 'Compete every Saturday & Sunday. Win certificates, badges, and glory!' },
    { icon: Users, color: 'from-purple-500 to-pink-400', title: '1:1 Mentoring', desc: 'Book sessions with expert mentors. Get personalized guidance on your coding journey.' },
    { icon: Zap, color: 'from-green-500 to-teal-400', title: 'Streak System', desc: 'Build coding habits with daily streaks. Earn bonus XP and unlock exclusive badges.' },
    { icon: Shield, color: 'from-red-500 to-rose-400', title: 'Safe for Kids', desc: 'COPPA-compliant. Moderated content. Parent dashboard. Your child is always safe.' },
    { icon: Globe, color: 'from-indigo-500 to-blue-400', title: 'Global Community', desc: 'Join thousands of young coders from USA, UK, Canada, Australia & India.' },
];

const stats = [
    { number: '10,000+', label: 'Students', icon: '🎓' },
    { number: '50+', label: 'Problems', icon: '💡' },
    { number: '100+', label: 'Mentors', icon: '👨‍💻' },
    { number: '500+', label: 'Hackathons', icon: '🏆' },
];

const testimonials = [
    { name: 'Emma, Grade 6', avatar: '🐱', text: 'KidsCode Arena made me love programming! I solved my first problem and got 50 XP. Now I can\'t stop coding!', country: '🇺🇸' },
    { name: 'Arjun, Grade 9', avatar: '🦊', text: 'The hackathons are so fun! I won 3rd place last weekend and got a certificate. My parents were so proud!', country: '🇮🇳' },
    { name: 'Sophie, Grade 7', avatar: '🐼', text: 'My mentor Sarah helped me understand algorithms in just 2 sessions. Best investment in my education!', country: '🇬🇧' },
];

const languages = [
    { name: 'Python', emoji: '🐍', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { name: 'JavaScript', emoji: '⚡', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { name: 'Java', emoji: '☕', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    { name: 'C++', emoji: '⚔️', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    { name: 'Scratch Mode', emoji: '🧩', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
];

const rankTiers = [
    { name: 'Bronze', emoji: '🥉', color: 'text-amber-600', range: '0–999 XP' },
    { name: 'Silver', emoji: '🥈', color: 'text-slate-400', range: '1000–1999 XP' },
    { name: 'Gold', emoji: '🥇', color: 'text-yellow-500', range: '2000–2999 XP' },
    { name: 'Platinum', emoji: '💎', color: 'text-cyan-400', range: '3000–4999 XP' },
    { name: 'Diamond', emoji: '👑', color: 'text-purple-500', range: '5000+ XP' },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-gray-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center text-white font-bold text-lg">K</div>
                        <span className="font-display text-xl font-bold">KidsCode <span className="gradient-text">Arena</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
                        <a href="#testimonials" className="hover:text-primary-600 transition-colors">Stories</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors">Sign In</Link>
                        <Link to="/register" className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">
                            Start Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                {/* Background blobs */}
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-kid-cyan/20 to-kid-green/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-primary-200 dark:border-primary-800"
                    >
                        <span className="fire-animate">🔥</span>
                        #1 Coding Platform for Kids (Grade 3–12)
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
                    >
                        Learn to Code.
                        <br />
                        <span className="gradient-text">Level Up. Have Fun.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        The most exciting coding platform built for students aged 8–17. Solve problems, win hackathons, earn badges, and grow with expert mentors!
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                    >
                        <Link
                            to="/register"
                            className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            Start Coding for Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-lg px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-slate-700 hover:border-primary-400 hover:shadow-lg transition-all duration-200"
                        >
                            Demo Login
                            <span>→</span>
                        </Link>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400"
                    >
                        <span className="flex items-center gap-1.5">✅ Free to start</span>
                        <span className="flex items-center gap-1.5">🔒 Safe for kids</span>
                        <span className="flex items-center gap-1.5">🌍 Used in 50+ countries</span>
                        <span className="flex items-center gap-1.5">⭐ 4.9/5 parent rating</span>
                    </motion.div>

                    {/* Language pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-wrap gap-3 justify-center mt-10"
                    >
                        {languages.map((lang) => (
                            <span key={lang.name} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${lang.color}`}>
                                {lang.emoji} {lang.name}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-gradient-to-r from-primary-600 via-accent-600 to-pink-600">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center text-white"
                        >
                            <div className="text-4xl mb-2">{stat.icon}</div>
                            <div className="text-3xl sm:text-4xl font-display font-extrabold">{stat.number}</div>
                            <div className="text-white/80 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
                            Everything a Young Coder <span className="gradient-text">Needs</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                            From beginner Scratch-style blocks to advanced algorithms — we've got it all.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-slate-700 group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                                    <f.icon size={22} className="text-white" />
                                </div>
                                <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rank Tiers */}
            <section className="py-20 bg-white dark:bg-slate-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-4xl font-extrabold mb-4">Rise Through the <span className="gradient-text">Ranks</span></h2>
                        <p className="text-slate-600 dark:text-slate-400">Earn XP by solving problems, maintaining streaks, and winning hackathons</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {rankTiers.map((tier, i) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-6 py-5 text-center min-w-[140px] hover:scale-105 transition-transform cursor-default"
                            >
                                <div className="text-4xl mb-2">{tier.emoji}</div>
                                <div className={`font-display font-bold text-lg ${tier.color}`}>{tier.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tier.range}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-24 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">Get Started in <span className="gradient-text">3 Easy Steps</span></h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Create Account', desc: 'Sign up free in 30 seconds. Pick your avatar and grade level.', emoji: '✨' },
                            { step: '02', title: 'Pick a Problem', desc: 'Choose from 50+ coding problems. Filter by grade, difficulty, and language.', emoji: '🎯' },
                            { step: '03', title: 'Code & Earn', desc: 'Write code, pass tests, earn XP, unlock badges, and climb the leaderboard!', emoji: '🚀' },
                        ].map((step) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-6xl mb-4 float-animate">{step.emoji}</div>
                                <div className="text-5xl font-display font-black text-primary-200 dark:text-primary-900 mb-2">{step.step}</div>
                                <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-white dark:bg-slate-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">Kids Love It <span className="gradient-text">🌟</span></h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Join 10,000+ students who are already coding their future</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{t.avatar}</div>
                                    <div>
                                        <p className="font-semibold text-sm">{t.name} {t.country}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 animated-gradient">
                <div className="max-w-3xl mx-auto px-4 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-6xl mb-6 float-animate">🚀</div>
                        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
                            Ready to Start Your Coding Journey?
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Join thousands of students who are already coding, competing, and learning every day. It's free to start!
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold text-lg px-10 py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                        >
                            <span>🎉</span>
                            Create Free Account
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-black text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center text-white font-bold">K</div>
                            <span className="font-display font-bold text-white">KidsCode Arena</span>
                        </div>
                        <div className="text-sm">© 2025 KidsCode Arena. Safe, fun, and educational for kids worldwide 🌍</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
