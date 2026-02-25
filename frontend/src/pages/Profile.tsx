import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    Code2, Flame, Zap, Award, Trophy, Star, ArrowLeft, Mail, BookOpen, Calendar, Target
} from 'lucide-react';

const rankInfo: Record<string, { emoji: string; color: string; bg: string }> = {
    Diamond: { emoji: '👑', color: 'text-purple-400', bg: 'bg-purple-400/15' },
    Platinum: { emoji: '💎', color: 'text-cyan-400', bg: 'bg-cyan-400/15' },
    Gold: { emoji: '🥇', color: 'text-yellow-400', bg: 'bg-yellow-400/15' },
    Silver: { emoji: '🥈', color: 'text-slate-400', bg: 'bg-slate-400/15' },
    Bronze: { emoji: '🥉', color: 'text-amber-500', bg: 'bg-amber-400/15' },
};

export default function Profile() {
    const { user, theme } = useAuthStore();
    const isDark = theme === 'dark';
    const rInfo = rankInfo[user?.rank || 'Bronze'] || rankInfo.Bronze;
    const card = isDark
        ? 'bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20'
        : 'bg-white border border-gray-200 shadow-md';
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';
    const heading = isDark ? 'text-white' : 'text-slate-900';

    const xpInLevel = (user?.xp || 0) % 200;
    const xpPercent = Math.min((xpInLevel / 200) * 100, 100);

    const stats = [
        { icon: Code2, label: 'Problems Solved', value: user?.solvedProblems?.length || 0, color: 'text-blue-400', bg: 'bg-blue-400/15' },
        { icon: Flame, label: 'Current Streak', value: `${user?.streak || 0}d`, color: 'text-orange-400', bg: 'bg-orange-400/15' },
        { icon: Zap, label: 'Total XP', value: (user?.xp || 0).toLocaleString(), color: 'text-yellow-400', bg: 'bg-yellow-400/15' },
        { icon: Award, label: 'Badges Earned', value: user?.badges?.length || 0, color: 'text-purple-400', bg: 'bg-purple-400/15' },
        { icon: Target, label: 'Best Streak', value: `${user?.longestStreak || 0}d`, color: 'text-green-400', bg: 'bg-green-400/15' },
        { icon: Trophy, label: 'Rank', value: user?.rank || 'Bronze', color: 'text-amber-400', bg: 'bg-amber-400/15' },
    ];

    return (
        <div className="flex flex-col gap-6 w-full pb-10">

            {/* ── Back link ── */}
            <Link to="/dashboard"
                className={`inline-flex items-center gap-1.5 text-sm font-medium w-fit ${muted} hover:text-primary-500 transition-colors`}>
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            {/* ── Hero card ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className={`${card} rounded-2xl overflow-hidden`}>

                {/* Cover gradient */}
                <div className="h-36 bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500 relative">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                </div>

                {/* Profile info */}
                <div className="px-6 sm:px-8 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500
              flex items-center justify-center text-5xl shadow-xl
              border-4 border-white dark:border-slate-900 shrink-0">
                            {user?.avatar}
                        </div>
                        {/* Rank + sub badges */}
                        <div className="flex flex-wrap gap-2 sm:mb-1">
                            <span className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl ${rInfo.bg} ${rInfo.color}`}>
                                {rInfo.emoji} {user?.rank} · Level {user?.level}
                            </span>
                            {user?.subscription === 'pro'
                                ? <span className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl bg-green-400/15 text-green-400">
                                    <Star size={13} className="fill-green-400" /> Pro Member ✨
                                </span>
                                : <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                    Free Plan
                                </span>}
                        </div>
                    </div>

                    {/* Name & meta */}
                    <h1 className={`font-display text-2xl sm:text-3xl font-extrabold ${heading} mb-2`}>{user?.username}</h1>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className={`flex items-center gap-1.5 text-sm ${muted}`}><Mail size={14} /> {user?.email}</span>
                        <span className={`flex items-center gap-1.5 text-sm ${muted}`}><BookOpen size={14} /> Grade {user?.grade}</span>
                        <span className={`flex items-center gap-1.5 text-sm ${muted}`}><Calendar size={14} /> Member since 2024</span>
                    </div>

                    {/* XP Progress */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-sm font-semibold ${heading}`}>XP to Level {(user?.level || 1) + 1}</span>
                            <span className={`text-xs ${muted}`}>{xpInLevel} / 200 XP</span>
                        </div>
                        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
                                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                            />
                        </div>
                        <p className={`text-xs ${muted} mt-1.5`}>{200 - xpInLevel} XP remaining</p>
                    </div>
                </div>
            </motion.div>

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((s, i) => (
                    <motion.div key={s.label}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`${card} rounded-2xl p-5 flex flex-col items-center text-center gap-3`}>
                        <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                            <s.icon size={20} className={s.color} />
                        </div>
                        <div>
                            <p className={`text-xl font-display font-extrabold ${heading} leading-none`}>{s.value}</p>
                            <p className={`text-[11px] ${muted} mt-1`}>{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Badges section ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`${card} rounded-2xl p-6 sm:p-8`}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className={`font-display text-lg font-bold ${heading}`}>My Badges</h3>
                        <p className={`text-xs ${muted} mt-0.5`}>{user?.badges?.length || 0} earned — keep solving to collect more!</p>
                    </div>
                    <Award size={20} className="text-purple-400" />
                </div>
                {user?.badges?.length ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
                        {user.badges.map((badge: any, i: number) => (
                            <div key={i}
                                className={`flex flex-col items-center p-3 rounded-xl cursor-default transition-all hover:scale-110 ${isDark ? 'bg-slate-700/60 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                                    }`}>
                                <span className="text-3xl mb-1.5">{badge.icon || '🏅'}</span>
                                <span className={`text-[10px] font-semibold text-center leading-tight ${muted}`}>{badge.name || badge}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-14 text-center gap-4">
                        <Trophy size={48} className={`${muted} opacity-15`} />
                        <div>
                            <p className={`text-base font-semibold ${heading} mb-1`}>No badges yet</p>
                            <p className={`text-sm ${muted}`}>Solve problems, complete streaks, and win hackathons to earn badges!</p>
                        </div>
                        <Link to="/problems"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-lg transition-all">
                            Start Solving →
                        </Link>
                    </div>
                )}
            </motion.div>

            {/* ── Upgrade CTA (only for free users) ── */}
            {user?.subscription !== 'pro' && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden rounded-2xl p-8 text-white bg-gradient-to-br from-primary-600 via-accent-600 to-pink-600">
                    <span className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full block" />
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="text-5xl">🚀</div>
                        <div className="flex-1">
                            <h3 className="font-display text-xl font-extrabold">Unlock Pro Access</h3>
                            <p className="text-white/80 text-sm mt-1">Hard problems, 2× XP, early hackathon access, and ad-free coding.</p>
                        </div>
                        <button className="shrink-0 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-sm">
                            Upgrade to Pro →
                        </button>
                    </div>
                </motion.div>
            )}

        </div>
    );
}
