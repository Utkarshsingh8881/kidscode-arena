import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Zap, Code2, Flame, Award, ChevronRight, Star, Target } from 'lucide-react';

/* ─── Shared Styles ─────────────────────────────────────── */
const mkCard = (dark: boolean) =>
    dark
        ? 'bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20 backdrop-blur-sm'
        : 'bg-white border border-gray-200 shadow-md';

const mkMuted = (dark: boolean) => dark ? 'text-slate-400' : 'text-slate-500';
const mkHead = (dark: boolean) => dark ? 'text-white' : 'text-slate-900';


/* ─── Fade-up animation helper ─────────────────────────── */
const up = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay },
});

export default function Dashboard() {
    const { theme } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [dailyChallenge, setDailyChallenge] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const isDark = theme === 'dark';
    const card = mkCard(isDark);
    const muted = mkMuted(isDark);
    const head = mkHead(isDark);

    useEffect(() => {
        (async () => {
            try {
                const [d, dc] = await Promise.all([
                    api.get('/analytics/student'),
                    api.get('/problems/daily/today'),
                ]);
                setData(d.data);
                setDailyChallenge(dc.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <DashboardSkeleton />;
    if (!data) return (
        <div className="flex items-center justify-center py-32">
            <p className="text-slate-500 text-sm">Failed to load dashboard — please refresh.</p>
        </div>
    );

    const { profile, stats, weeklyProgress, badges } = data;
    const xpInLevel = profile.xp % 200;
    const xpPercent = Math.min((xpInLevel / 200) * 100, 100);
    const diffData = [
        { name: 'Easy', value: stats.solvedByDifficulty.easy, fill: '#22c55e' },
        { name: 'Medium', value: stats.solvedByDifficulty.medium, fill: '#f59e0b' },
        { name: 'Hard', value: stats.solvedByDifficulty.hard, fill: '#ef4444' },
    ];

    return (
        <div className="flex flex-col gap-8 pb-10 w-full">

            {/* ══════════════════════════════════════════════════
          Section 1 — Welcome Banner
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                    <h1 className={`font-display text-2xl sm:text-3xl font-extrabold leading-tight ${head}`}>
                        Hey, {profile.username}! {profile.avatar}
                    </h1>
                    <p className={`mt-1.5 text-sm ${muted}`}>
                        {profile.streak > 0
                            ? `🔥 You're on a ${profile.streak}-day streak — keep going!`
                            : '💪 Solve a problem today to start your streak!'}
                    </p>
                </div>
                <Link
                    to="/problems"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-5 py-3 rounded-xl hover:shadow-lg hover:opacity-95 active:scale-95 transition-all text-sm shrink-0"
                >
                    <Code2 size={16} />
                    Start Solving
                    <ChevronRight size={14} />
                </Link>
            </motion.div>

            {/* ══════════════════════════════════════════════════
          Section 2 — Stat Cards
      ══════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total XP', value: profile.xp.toLocaleString(), icon: Zap, bg: 'bg-yellow-400/15', fg: 'text-yellow-400', sub: `Level ${profile.level} · ${profile.rank}` },
                    { label: 'Problems Solved', value: stats.totalSolved, icon: Code2, bg: 'bg-blue-400/15', fg: 'text-blue-400', sub: `out of ${stats.totalProblems} total` },
                    { label: 'Current Streak', value: `${profile.streak}d`, icon: Flame, bg: 'bg-orange-400/15', fg: 'text-orange-400', sub: `Best: ${profile.longestStreak} days` },
                    { label: 'Badges Earned', value: badges.length, icon: Award, bg: 'bg-purple-400/15', fg: 'text-purple-400', sub: 'Keep solving to earn more' },
                ].map((s, i) => (
                    <motion.div key={s.label} {...up(i * 0.07)}
                        className={`${card} rounded-2xl p-5 flex items-center gap-4`}
                    >
                        <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                            <s.icon size={22} className={s.fg} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className={`text-[11px] font-semibold uppercase tracking-wider ${muted} mb-0.5`}>{s.label}</p>
                            <p className={`text-xl sm:text-2xl font-display font-extrabold ${head} leading-none`}>{s.value}</p>
                            <p className={`text-[11px] ${muted} mt-1 truncate`}>{s.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ══════════════════════════════════════════════════
          Section 3 — Profile Card + Weekly Chart
      ══════════════════════════════════════════════════ */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Profile card */}
                <motion.div {...up(0.12)} className={`${card} rounded-2xl p-6 flex flex-col gap-5`}>

                    {/* Avatar + name */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-4xl shadow-lg shrink-0">
                            {profile.avatar}
                        </div>
                        <div>
                            <h3 className={`font-display text-lg font-bold leading-tight ${head}`}>{profile.username}</h3>
                            <p className={`text-sm ${muted}`}>Grade {profile.grade}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${profile.rank === 'Gold' ? 'bg-yellow-400/20 text-yellow-400' :
                                    profile.rank === 'Silver' ? 'bg-slate-400/20  text-slate-400' :
                                        'bg-amber-500/20 text-amber-400'}`}>
                                    {profile.rank}
                                </span>
                                <span className={`text-[11px] ${muted}`}>Level {profile.level}</span>
                            </div>
                        </div>
                    </div>

                    {/* XP bar */}
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className={`font-semibold ${head}`}>XP Progress</span>
                            <span className={muted}>{xpInLevel} / 200 XP</span>
                        </div>
                        <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
                                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                            />
                        </div>
                        <p className={`text-[11px] ${muted} mt-1.5`}>{200 - xpInLevel} XP to Level {profile.level + 1}</p>
                    </div>

                    {/* Streak tile */}
                    <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${isDark ? 'bg-slate-700/60' : 'bg-orange-50'}`}>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🔥</span>
                            <div>
                                <p className={`text-[11px] ${muted}`}>Current Streak</p>
                                <p className="text-xl font-display font-extrabold text-orange-500">{profile.streak} Days</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-[11px] ${muted}`}>Personal Best</p>
                            <p className={`text-lg font-display font-bold ${head}`}>{profile.longestStreak}d</p>
                        </div>
                    </div>

                    {/* Pro / Upgrade */}
                    {profile.subscription === 'free' ? (
                        <div className={`rounded-xl border-2 border-dashed p-4 ${isDark ? 'border-primary-700 bg-primary-900/10' : 'border-primary-200 bg-primary-50'}`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Star size={13} className="text-primary-500" />
                                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">Upgrade to Pro</span>
                            </div>
                            <p className={`text-[11px] ${muted} mb-3`}>Unlock hard problems, bonus XP & early hackathon access.</p>
                            <button className="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-md transition-all">
                                Upgrade Now →
                            </button>
                        </div>
                    ) : (
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                            <Star size={14} className="text-green-500 fill-green-500" />
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">Pro Member ✨</span>
                        </div>
                    )}

                    {/* View profile link */}
                    <Link
                        to="/profile"
                        className={`w-full flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl border transition-all ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-slate-700 hover:bg-gray-50'
                            }`}
                    >
                        View Full Profile →
                    </Link>
                </motion.div>

                {/* Weekly chart */}
                <motion.div {...up(0.18)} className={`${card} rounded-2xl p-6 lg:col-span-2 flex flex-col gap-5`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className={`font-display text-base font-bold ${head}`}>Weekly Activity</h3>
                            <p className={`text-xs ${muted} mt-0.5`}>Problems solved & XP earned this week</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs shrink-0">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 inline-block" /> <span className={muted}>XP</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> <span className={muted}>Problems</span>
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={weeklyProgress} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gXP" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gProb" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{
                                background: isDark ? '#0f172a' : '#fff',
                                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                borderRadius: 12,
                                fontSize: 12,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
                            }} />
                            <Area type="monotone" dataKey="xp" name="XP" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gXP)" dot={false} />
                            <Area type="monotone" dataKey="problems" name="Problems" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gProb)" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* ══════════════════════════════════════════════════
          Section 4 — Activity Heatmap  (full width)
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0.22)} className={`${card} rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className={`font-display text-base font-bold ${head}`}>Activity Heatmap</h3>
                        <p className={`text-xs ${muted} mt-0.5`}>Your coding activity over the last 12 weeks</p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] ${muted} shrink-0`}>
                        <span>Less</span>
                        {[0, 1, 2, 3, 4].map(n => (
                            <span key={n} className={`w-3.5 h-3.5 rounded-sm inline-block ${n === 0 ? (isDark ? 'bg-slate-700' : 'bg-gray-100') : n === 1 ? 'bg-green-200' : n === 2 ? 'bg-green-300' : n === 3 ? 'bg-green-500' : 'bg-green-600'
                                }`} />
                        ))}
                        <span>More</span>
                    </div>
                </div>
                <ActivityHeatmap heatmap={data.heatmap} isDark={isDark} />
            </motion.div>

            {/* ══════════════════════════════════════════════════
          Section 5 — Daily Challenge / Breakdown / Badges
      ══════════════════════════════════════════════════ */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* Daily challenge */}
                {dailyChallenge?.problem ? (
                    <motion.div {...up(0.28)} className="relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br from-violet-600 via-primary-600 to-cyan-500">
                        <span className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full block" />
                        <span className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full block" />
                        <div className="relative space-y-3">
                            <div className="flex items-center gap-2 text-white/70">
                                <Target size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Daily Challenge</span>
                            </div>
                            <h3 className="font-display text-xl font-extrabold leading-snug">{dailyChallenge.problem.title}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${dailyChallenge.problem.difficulty === 'easy' ? 'bg-green-400/30 text-green-100' :
                                    dailyChallenge.problem.difficulty === 'medium' ? 'bg-yellow-400/30 text-yellow-100' :
                                        'bg-red-400/30 text-red-100'}`}>
                                    {dailyChallenge.problem.difficulty}
                                </span>
                                <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full font-bold">
                                    +{dailyChallenge.bonusXp} Bonus XP
                                </span>
                            </div>
                            <Link
                                to={`/problems/${dailyChallenge.problem.id}`}
                                className="inline-flex items-center gap-2 bg-white text-primary-700 text-sm font-bold px-4 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all mt-2"
                            >
                                Solve Challenge <ChevronRight size={14} />
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div {...up(0.28)} className={`${card} rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[220px]`}>
                        <Target size={36} className={`${muted} opacity-30`} />
                        <p className={`text-sm font-semibold ${head}`}>No Daily Challenge</p>
                        <p className={`text-xs ${muted}`}>Check back soon!</p>
                    </motion.div>
                )}

                {/* Problem breakdown */}
                <motion.div {...up(0.34)} className={`${card} rounded-2xl p-6`}>
                    <h3 className={`font-display text-base font-bold ${head}`}>Problem Breakdown</h3>
                    <p className={`text-[11px] ${muted} mt-0.5 mb-5`}>Solved by difficulty level</p>
                    <div className="flex items-center gap-4">
                        <PieChart width={112} height={112}>
                            <Pie data={diffData} cx="50%" cy="50%" innerRadius={32} outerRadius={52}
                                dataKey="value" paddingAngle={4} startAngle={90} endAngle={-270}>
                                {diffData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                            </Pie>
                        </PieChart>
                        <div className="flex-1 space-y-3">
                            {diffData.map(d => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.fill }} />
                                    <span className={`text-xs flex-1 ${muted}`}>{d.name}</span>
                                    <span className={`text-sm font-extrabold ${head}`}>{d.value}</span>
                                </div>
                            ))}
                            <div className={`pt-2.5 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                <div className="flex justify-between text-xs">
                                    <span className={muted}>Total</span>
                                    <span className={`font-extrabold ${head}`}>{stats.totalSolved}/{stats.totalProblems}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Badges */}
                <motion.div {...up(0.40)} className={`${card} rounded-2xl p-6`}>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className={`font-display text-base font-bold ${head}`}>Badges</h3>
                            <p className={`text-[11px] ${muted} mt-0.5`}>{badges.length} earned so far</p>
                        </div>
                        <Award size={18} className="text-purple-400" />
                    </div>
                    {badges.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {badges.slice(0, 9).map((b: any) => (
                                <div key={b.id} title={`${b.name}: ${b.description}`}
                                    className={`flex flex-col items-center p-2.5 rounded-xl cursor-default hover:scale-105 transition-transform ${isDark ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
                                    <span className="text-2xl mb-1">{b.icon}</span>
                                    <span className={`text-[10px] font-semibold text-center leading-tight ${muted}`}>{b.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-center gap-2">
                            <Award size={32} className={`${muted} opacity-20`} />
                            <p className={`text-sm ${muted}`}>No badges yet</p>
                            <p className={`text-[11px] ${muted}`}>Solve problems to earn them</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ══════════════════════════════════════════════════
          Section 6 — Hackathon Banner
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0.44)} className="relative overflow-hidden rounded-2xl p-7 text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">
                <span className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full block" />
                <span className="absolute right-32 bottom-0 w-20 h-20 bg-white/5  rounded-full block" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <span className="text-5xl">🏆</span>
                    <div className="flex-1">
                        <h3 className="font-display text-xl font-extrabold">Weekend Hackathon is LIVE!</h3>
                        <p className="text-white/80 text-sm mt-1">Compete with coders worldwide. Win certificates, badges, and glory!</p>
                    </div>
                    <Link
                        to="/hackathons"
                        className="shrink-0 bg-white text-orange-700 font-bold px-7 py-3 rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-sm"
                    >
                        Join Now →
                    </Link>
                </div>
            </motion.div>

            {/* ══════════════════════════════════════════════════
          Section 7 — Quick Access
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0.50)}>
                <h3 className={`font-display text-base font-bold ${head} mb-4`}>Quick Access</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { icon: '📚', label: 'Practice', sub: 'Code Problems', to: '/problems', from: 'from-blue-500', to_: 'to-cyan-500' },
                        { icon: '🏆', label: 'Compete', sub: 'Hackathons', to: '/hackathons', from: 'from-yellow-500', to_: 'to-orange-500' },
                        { icon: '👨‍💻', label: 'Learn', sub: '1:1 Mentoring', to: '/mentors', from: 'from-purple-500', to_: 'to-pink-500' },
                        { icon: '🏅', label: 'Rankings', sub: 'Leaderboard', to: '/leaderboard', from: 'from-green-500', to_: 'to-teal-500' },
                    ].map(a => (
                        <Link key={a.to} to={a.to}
                            className={`group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${a.from} ${a.to_} text-white hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-200`}>
                            <span className="text-3xl block mb-3">{a.icon}</span>
                            <p className="font-display font-bold text-sm">{a.label}</p>
                            <p className="text-white/70 text-xs mt-0.5">{a.sub}</p>
                            <ChevronRight size={16} className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-80 transition-opacity" />
                        </Link>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}

/* ─── Activity Heatmap ─────────────────────────────────── */
function ActivityHeatmap({ heatmap, isDark }: { heatmap: Record<string, number>; isDark: boolean }) {
    const WEEKS = 26;
    const days = Object.entries(heatmap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-(WEEKS * 7));

    const color = (n: number) =>
        n === 0 ? (isDark ? 'bg-slate-700/70' : 'bg-gray-100') :
            n === 1 ? (isDark ? 'bg-green-900' : 'bg-green-200') :
                n === 2 ? (isDark ? 'bg-green-700' : 'bg-green-300') :
                    n === 3 ? (isDark ? 'bg-green-500' : 'bg-green-400') :
                        (isDark ? 'bg-green-400' : 'bg-green-600');

    const DAY_LABELS = ['Sun', 'Mon', '', 'Wed', '', 'Fri', ''];
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="flex gap-3 w-full">
            {/* Day-of-week labels */}
            <div className="flex flex-col justify-around pt-5 shrink-0 gap-1">
                {DAY_LABELS.map((d, i) => (
                    <span key={i} className={`text-[10px] w-6 leading-none ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{d}</span>
                ))}
            </div>
            {/* Grid */}
            <div className="flex-1 min-w-0">
                {/* Month labels */}
                <div className="flex mb-1.5 gap-1">
                    {Array.from({ length: WEEKS }, (_, col) => {
                        const idx = col * 7;
                        if (idx >= days.length) return <div key={col} className="flex-1" />;
                        const [date] = days[idx];
                        const d = new Date(date);
                        const showMonth = d.getDate() <= 7;
                        return (
                            <div key={col} className="flex-1 min-w-0 overflow-hidden">
                                {showMonth
                                    ? <span className={`text-[10px] font-medium whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{MONTH_NAMES[d.getMonth()]}</span>
                                    : null}
                            </div>
                        );
                    })}
                </div>
                {/* Cells */}
                <div className="flex gap-1">
                    {Array.from({ length: WEEKS }, (_, col) => (
                        <div key={col} className="flex flex-col gap-1 flex-1 min-w-0">
                            {Array.from({ length: 7 }, (_, row) => {
                                const idx = col * 7 + row;
                                const entry = days[idx];
                                const count = entry ? Number(entry[1]) : 0;
                                const dateStr = entry ? entry[0] : '';
                                return (
                                    <div key={row}
                                        title={dateStr ? `${dateStr}: ${count} submission${count !== 1 ? 's' : ''}` : ''}
                                        className={`w-full aspect-square rounded-sm transition-transform hover:scale-110 cursor-default ${color(count)}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Loading Skeleton ─────────────────────────────────── */
function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-8 pb-10 animate-pulse">
            <div className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl w-80" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 rounded-2xl" />)}
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="h-80 bg-gray-100 dark:bg-slate-800 rounded-2xl" />
                <div className="lg:col-span-2 h-80 bg-gray-100 dark:bg-slate-800 rounded-2xl" />
            </div>
            <div className="h-40 bg-gray-100 dark:bg-slate-800 rounded-2xl" />
        </div>
    );
}
