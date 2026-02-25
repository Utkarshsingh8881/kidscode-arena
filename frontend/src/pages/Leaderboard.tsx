import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Trophy, Flame, Code, Zap } from 'lucide-react';

const rankBadge = (rank: string) => {
    switch (rank) {
        case 'Diamond': return { emoji: '👑', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' };
        case 'Platinum': return { emoji: '💎', color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' };
        case 'Gold': return { emoji: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
        case 'Silver': return { emoji: '🥈', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-700' };
        default: return { emoji: '🥉', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' };
    }
};

const positionColors = ['bg-gradient-to-r from-yellow-400 to-orange-400', 'bg-gradient-to-r from-slate-300 to-slate-400', 'bg-gradient-to-r from-amber-600 to-orange-500'];

export default function Leaderboard() {
    const { user, theme } = useAuthStore();
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const isDark = theme === 'dark';
    const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
    const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

    useEffect(() => {
        api.get('/auth/leaderboard').then(({ data }) => {
            setLeaders(data);
        }).finally(() => setLoading(false));
    }, []);

    const myRank = leaders.findIndex(l => l.id === user?.id) + 1;
    const top3 = leaders.slice(0, 3);
    const rest = leaders.slice(3);

    return (
        <div className="space-y-8">
            <div>
                <h1 className={`font-display text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>🏅 Global Leaderboard</h1>
                <p className={`text-sm mt-1 ${textMuted}`}>Top coders ranked by XP. Can you reach #1?</p>
            </div>

            {/* My rank */}
            {myRank > 0 && (
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-5 text-white">
                    <p className="text-white/70 text-sm mb-1">Your Global Rank</p>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-display font-extrabold">#{myRank}</div>
                        <div>
                            <p className="font-bold text-lg">{user?.username} {user?.avatar}</p>
                            <p className="text-white/70 text-sm">{user?.xp?.toLocaleString()} XP • {user?.rank}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[...Array(10)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}
                </div>
            ) : (
                <>
                    {/* Top 3 podium */}
                    <div className="grid grid-cols-3 gap-4">
                        {top3.map((leader, i) => {
                            const rb = rankBadge(leader.rank);
                            const positions = [1, 0, 2]; // Silver, Gold, Bronze visual positions
                            const actualRank = i + 1;
                            return (
                                <motion.div
                                    key={leader.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: [30, -10, 0] }}
                                    transition={{ delay: i * 0.15, duration: 0.6 }}
                                    className={`${card} border rounded-2xl p-5 text-center relative ${leader.id === user?.id ? 'ring-2 ring-primary-500' : ''}`}
                                >
                                    {/* Position crown */}
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${positionColors[i]} flex items-center justify-center text-white font-display font-extrabold text-sm`}>
                                        {actualRank}
                                    </div>
                                    <div className="text-5xl mt-3 mb-2">{leader.avatar}</div>
                                    <p className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{leader.username}</p>
                                    <div className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${rb.bg} ${rb.color} mb-2`}>
                                        {rb.emoji} {leader.rank}
                                    </div>
                                    <div className={`text-sm font-display font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {leader.xp.toLocaleString()} XP
                                    </div>
                                    <div className={`text-xs ${textMuted} mt-1`}>
                                        {leader.solvedProblems?.length || 0} solved • {leader.streak}🔥
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Rest of leaderboard */}
                    <div className="space-y-2">
                        {rest.map((leader, i) => {
                            const actualRank = i + 4;
                            const rb = rankBadge(leader.rank);
                            const isMe = leader.id === user?.id;
                            return (
                                <motion.div
                                    key={leader.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={`${card} border rounded-2xl px-5 py-4 flex items-center gap-4 ${isMe ? 'ring-2 ring-primary-500' : ''} hover:shadow-md transition-shadow`}
                                >
                                    <span className={`text-sm font-display font-extrabold w-8 text-center ${textMuted}`}>#{actualRank}</span>
                                    <span className="text-3xl">{leader.avatar}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'} ${isMe ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                                            {leader.username} {isMe && '(You)'}
                                        </p>
                                        <p className={`text-xs ${textMuted}`}>Grade {leader.grade}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className={`flex items-center gap-1 ${textMuted}`}><Code size={12} /> {leader.solvedProblems?.length || 0}</span>
                                        <span className="flex items-center gap-1 text-orange-500"><Flame size={12} /> {leader.streak}</span>
                                    </div>
                                    <div className={`hidden sm:flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${rb.bg} ${rb.color}`}>
                                        {rb.emoji} {leader.rank}
                                    </div>
                                    <div className={`text-right`}>
                                        <p className={`font-display font-extrabold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{leader.xp.toLocaleString()}</p>
                                        <p className={`text-xs ${textMuted}`}>XP</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
