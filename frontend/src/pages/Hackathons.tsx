import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Clock, Users, Trophy, ChevronRight, Calendar, Zap, AlarmClock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

function useCountdown(targetDate: string) {
    const [remaining, setRemaining] = useState('');
    useEffect(() => {
        const tick = () => {
            const diff = new Date(targetDate).getTime() - Date.now();
            if (diff <= 0) { setRemaining('Started!'); return; }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setRemaining(`${h}h ${m}m ${s}s`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);
    return remaining;
}

function HackathonCard({ hack, onRegister, userId, theme }: any) {
    const isDark = theme === 'dark';
    const now = new Date();
    const start = new Date(hack.startTime);
    const end = new Date(hack.endTime);
    const status = start > now ? 'upcoming' : end < now ? 'ended' : 'active';
    const countdown = useCountdown(status === 'upcoming' ? hack.startTime : hack.endTime);
    const isRegistered = hack.participants?.includes(userId);

    const statusColors = {
        upcoming: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
        active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500 animate-pulse' },
        ended: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-500', dot: 'bg-gray-400' },
    };
    const sc = statusColors[status];
    const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${card} border rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300`}
        >
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} capitalize`}>{status}</span>
                        {hack.isPremium && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">⭐ Premium</span>}
                    </div>
                    <h3 className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{hack.title}</h3>
                    <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{hack.description}</p>
                </div>
                <div className="text-4xl shrink-0">🏆</div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Calendar size={14} />
                    <span>{start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Users size={14} />
                    <span>{hack.participantCount} participants</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Clock size={14} />
                    <span>{hack.problems?.length || 0} problems</span>
                </div>
            </div>

            {/* Countdown */}
            {status !== 'ended' && (
                <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${status === 'active' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                    <AlarmClock size={16} className={status === 'active' ? 'text-green-500' : 'text-blue-500'} />
                    <span className={`text-sm font-semibold ${status === 'active' ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'}`}>
                        {status === 'active' ? 'Ends in: ' : 'Starts in: '}{countdown}
                    </span>
                </div>
            )}

            {/* Leaderboard preview */}
            {hack.leaderboard?.length > 0 && (
                <div className="mb-4">
                    <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Top Coders:</p>
                    <div className="space-y-1.5">
                        {hack.leaderboard.slice(0, 3).map((entry: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <span>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                                <span className={`font-medium flex-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{entry.username || `User ${i + 1}`}</span>
                                <span className={`text-xs font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{entry.score} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action button */}
            {status === 'ended' ? (
                <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed">
                    Contest Ended
                </button>
            ) : isRegistered ? (
                <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <CheckCircle2 size={16} />
                    Registered ✓
                </div>
            ) : (
                <button
                    onClick={() => onRegister(hack.id)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-sm"
                >
                    <Zap size={16} />
                    {status === 'active' ? 'Join Now!' : 'Register for Contest'}
                    <ChevronRight size={16} />
                </button>
            )}
        </motion.div>
    );
}

export default function Hackathons() {
    const { user, theme } = useAuthStore();
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const isDark = theme === 'dark';

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/hackathons');
                setHackathons(data);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleRegister = async (hackId: string) => {
        try {
            await api.post(`/hackathons/${hackId}/register`);
            toast.success('🎉 Registered successfully! Good luck!');
            setHackathons(prev => prev.map(h =>
                h.id === hackId ? { ...h, participants: [...h.participants, user?.id], participantCount: h.participantCount + 1 } : h
            ));
        } catch (e: any) {
            toast.error(e.response?.data?.error || 'Registration failed');
        }
    };

    const upcoming = hackathons.filter(h => h.status === 'upcoming');
    const active = hackathons.filter(h => h.status === 'active');
    const ended = hackathons.filter(h => h.status === 'ended');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`font-display text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>🏆 Hackathons</h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Weekend coding contests every Saturday & Sunday. Compete, win, and earn certificates!
                </p>
            </div>

            {/* Hero stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Active Now', value: active.length, icon: '🔴', color: 'from-green-500 to-teal-500' },
                    { label: 'Upcoming', value: upcoming.length, icon: '⏰', color: 'from-blue-500 to-cyan-500' },
                    { label: 'Completed', value: ended.length, icon: '✅', color: 'from-purple-500 to-pink-500' },
                ].map(s => (
                    <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white text-center`}>
                        <div className="text-3xl mb-1">{s.icon}</div>
                        <div className="font-display text-2xl font-extrabold">{s.value}</div>
                        <div className="text-white/70 text-xs font-medium">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* How hackathons work */}
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200'} border rounded-2xl p-6`}>
                <h3 className={`font-display text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>🎮 How Hackathons Work</h3>
                <div className="grid sm:grid-cols-4 gap-4">
                    {[
                        { icon: '📝', text: 'Register before the contest starts' },
                        { icon: '⏱️', text: 'Solve problems before time runs out' },
                        { icon: '🏆', text: 'Rank based on score & speed' },
                        { icon: '🎓', text: 'Top 3 get certificates!' },
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Hackathons */}
            {active.length > 0 && (
                <div>
                    <h2 className={`font-display text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live Now
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                        {active.map(h => <HackathonCard key={h.id} hack={h} onRegister={handleRegister} userId={user?.id} theme={theme} />)}
                    </div>
                </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
                <div>
                    <h2 className={`font-display text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>📅 Upcoming Contests</h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                        {upcoming.map(h => <HackathonCard key={h.id} hack={h} onRegister={handleRegister} userId={user?.id} theme={theme} />)}
                    </div>
                </div>
            )}

            {/* Past */}
            {ended.length > 0 && (
                <div>
                    <h2 className={`font-display text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>📜 Past Contests</h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                        {ended.map(h => <HackathonCard key={h.id} hack={h} onRegister={handleRegister} userId={user?.id} theme={theme} />)}
                    </div>
                </div>
            )}

            {loading && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (<div key={i} className="h-64 rounded-2xl bg-gray-200 dark:bg-slate-700 animate-pulse" />))}
                </div>
            )}
        </div>
    );
}
