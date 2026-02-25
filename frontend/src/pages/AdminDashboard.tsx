import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import {
    Users, DollarSign, TrendingUp, AlertTriangle,
    Search, Filter, Mail, ChevronDown, Shield, RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Shared helpers ─────────────────────────────────────── */
const mkCard = (d: boolean) => d
    ? 'bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20 backdrop-blur-sm'
    : 'bg-white border border-gray-200 shadow-md';
const mkMuted = (d: boolean) => d ? 'text-slate-400' : 'text-slate-500';
const mkHead = (d: boolean) => d ? 'text-white' : 'text-slate-900';
const up = (delay = 0) => ({
    initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'];
const STATUS_STYLES: Record<string, string> = {
    active: 'bg-green-400/15 text-green-400',
    inactive: 'bg-slate-400/15 text-slate-400',
    suspended: 'bg-red-400/15   text-red-400',
};
const ROLE_STYLES: Record<string, string> = {
    student: 'bg-blue-400/15   text-blue-400',
    admin: 'bg-red-400/15    text-red-400',
    developer: 'bg-purple-400/15 text-purple-400',
};

export default function AdminDashboard() {
    const { theme } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRole] = useState('all');
    const [emailBody, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const isDark = theme === 'dark';
    const card = mkCard(isDark);
    const muted = mkMuted(isDark);
    const head = mkHead(isDark);

    const load = async () => {
        setLoading(true);
        try { const { data } = await api.get('/analytics/admin'); setData(data); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    if (loading) return <AdminSkeleton />;
    if (!data) return (
        <div className="flex items-center justify-center py-32">
            <p className="text-slate-500 text-sm">Failed to load admin data — please refresh.</p>
        </div>
    );

    const { overview, users, dailySubmissions, revenueBreakdown, gradeDistribution } = data;

    const filteredUsers = users.filter((u: any) => {
        const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const handleEmail = async () => {
        if (!emailBody.trim()) { toast.error('Email body is empty!'); return; }
        setSending(true);
        await new Promise(r => setTimeout(r, 1200));
        toast.success(`Campaign sent to ${overview.totalUsers} users!`);
        setEmail('');
        setSending(false);
    };

    return (
        <div className="flex flex-col gap-8 pb-10 w-full">

            {/* ══════════════════════════════════════════════════
          Header
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Shield size={20} className="text-primary-500" />
                        <h1 className={`font-display text-2xl sm:text-3xl font-extrabold ${head}`}>Admin Dashboard</h1>
                    </div>
                    <p className={`text-sm ${muted}`}>Platform overview & user management</p>
                </div>
                <button onClick={load}
                    className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-slate-700 hover:bg-gray-50'
                        }`}>
                    <RefreshCcw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </motion.div>

            {/* ══════════════════════════════════════════════════
          Overview Stat Cards
      ══════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Users', value: overview.totalUsers, icon: Users, bg: 'bg-blue-400/15', fg: 'text-blue-400', trend: `+${overview.newUsersToday} today` },
                    { label: 'Active Now', value: overview.activeUsers, icon: TrendingUp, bg: 'bg-green-400/15', fg: 'text-green-400', trend: `${Math.round(overview.activeUsers / overview.totalUsers * 100)}% of total` },
                    { label: 'Monthly Revenue', value: `$${overview.revenue}`, icon: DollarSign, bg: 'bg-yellow-400/15', fg: 'text-yellow-400', trend: '+12% vs last month' },
                    { label: 'Open Reports', value: overview.openReports, icon: AlertTriangle, bg: 'bg-red-400/15', fg: 'text-red-400', trend: 'Needs attention' },
                ].map((s, i) => (
                    <motion.div key={s.label} {...up(i * 0.07)} className={`${card} rounded-2xl p-5 flex items-center gap-4`}>
                        <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                            <s.icon size={22} className={s.fg} />
                        </div>
                        <div className="min-w-0">
                            <p className={`text-[11px] font-semibold uppercase tracking-wider ${muted} mb-0.5`}>{s.label}</p>
                            <p className={`text-xl sm:text-2xl font-display font-extrabold ${head} leading-none`}>{s.value}</p>
                            <p className={`text-[11px] ${muted} mt-1 truncate`}>{s.trend}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ══════════════════════════════════════════════════
          Charts Row
      ══════════════════════════════════════════════════ */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Daily Submissions chart */}
                <motion.div {...up(0.12)} className={`${card} rounded-2xl p-6 lg:col-span-2`}>
                    <h3 className={`font-display text-base font-bold ${head} mb-1`}>Daily Submissions</h3>
                    <p className={`text-xs ${muted} mb-5`}>Accepted vs Failed over the last 7 days</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={dailySubmissions} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barSize={18}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 12, fontSize: 12 }} />
                            <Bar dataKey="accepted" name="Accepted" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Revenue breakdown pie */}
                <motion.div {...up(0.18)} className={`${card} rounded-2xl p-6`}>
                    <h3 className={`font-display text-base font-bold ${head} mb-1`}>Revenue Sources</h3>
                    <p className={`text-xs ${muted} mb-5`}>Breakdown by plan type</p>
                    <div className="flex justify-center mb-4">
                        <PieChart width={140} height={140}>
                            <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={38} outerRadius={62}
                                dataKey="value" paddingAngle={4}>
                                {revenueBreakdown.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </div>
                    <div className="space-y-2.5">
                        {revenueBreakdown.map((rb: any, i: number) => (
                            <div key={rb.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-sm shrink-0 inline-block" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    <span className={muted}>{rb.name}</span>
                                </div>
                                <span className={`font-bold ${head}`}>${rb.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Grade distribution line chart */}
            <motion.div {...up(0.22)} className={`${card} rounded-2xl p-6`}>
                <h3 className={`font-display text-base font-bold ${head} mb-1`}>Students by Grade</h3>
                <p className={`text-xs ${muted} mb-5`}>Distribution across grade levels</p>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={gradeDistribution} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="grade" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 12, fontSize: 12 }} />
                        <Line type="monotone" dataKey="students" name="Students" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* ══════════════════════════════════════════════════
          User Management Table
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0.27)} className={`${card} rounded-2xl overflow-hidden`}>
                {/* Table header */}
                <div className={`px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 ${isDark ? 'border-slate-700 bg-slate-700/30' : 'border-gray-100 bg-gray-50/80'}`}>
                    <h3 className={`font-display text-base font-bold ${head} flex-1`}>User Management</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Search */}
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-200'} flex-1 sm:flex-none sm:w-48`}>
                            <Search size={14} className={muted} />
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search users…"
                                className="bg-transparent outline-none flex-1 text-sm placeholder:text-slate-500"
                            />
                        </div>
                        {/* Role filter */}
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
                            <Filter size={14} className={muted} />
                            <select value={roleFilter} onChange={e => setRole(e.target.value)}
                                className={`bg-transparent outline-none text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                <option value="all">All Roles</option>
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                                <option value="developer">Developer</option>
                            </select>
                            <ChevronDown size={12} className={muted} />
                        </div>
                    </div>
                </div>

                {/* Table body */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={`text-left text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'bg-slate-700/20 text-slate-500' : 'bg-gray-50 text-slate-400'}`}>
                                {['User', 'Role', 'Grade', 'XP', 'Problems', 'Streak', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                            {filteredUsers.map((u: any) => (
                                <tr key={u.id}
                                    className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50/80'}`}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-base font-bold text-white shrink-0">
                                                {u.avatar}
                                            </div>
                                            <div>
                                                <p className={`font-semibold leading-tight ${head}`}>{u.username}</p>
                                                <p className={`text-[11px] ${muted}`}>{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${ROLE_STYLES[u.role] || 'bg-gray-100 text-gray-500'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className={`px-5 py-4 ${muted}`}>{u.grade ? `Grade ${u.grade}` : '—'}</td>
                                    <td className={`px-5 py-4 font-semibold ${head}`}>{u.xp.toLocaleString()}</td>
                                    <td className={`px-5 py-4 ${muted}`}>{u.solvedProblems?.length ?? 0}</td>
                                    <td className={`px-5 py-4 ${muted}`}>
                                        {u.streak > 0 ? <span className="text-orange-500 font-semibold">{u.streak}🔥</span> : '—'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[u.status] || 'bg-gray-100 text-gray-500'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => toast.success(`Viewing ${u.username}`)}
                                                className="text-[11px] font-semibold text-primary-500 hover:underline">View</button>
                                            <button onClick={() => toast.success(`${u.username} suspended`)}
                                                className="text-[11px] font-semibold text-red-500 hover:underline">Suspend</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={8} className={`px-5 py-12 text-center text-sm ${muted}`}>No users match your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table footer */}
                <div className={`px-6 py-3 border-t text-xs ${isDark ? 'border-slate-700 text-slate-500' : 'border-gray-100 text-slate-400'}`}>
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </motion.div>

            {/* ══════════════════════════════════════════════════
          Email Campaign Tool
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0.33)} className={`${card} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/15 flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className={`font-display text-base font-bold ${head}`}>Email Campaign</h3>
                        <p className={`text-xs ${muted}`}>Send an announcement to all {overview.totalUsers} users</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <input
                        placeholder="Subject: e.g. New Feature Alert 🚀"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all ${isDark ? 'bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-200 text-slate-900'
                            }`}
                    />
                    <textarea
                        rows={4}
                        value={emailBody}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Write your message here…"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all ${isDark ? 'bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-200 text-slate-900'
                            }`}
                    />
                    <div className="flex justify-end">
                        <button onClick={handleEmail} disabled={sending}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg transition-all ${sending ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-95'}`}>
                            <Mail size={15} />
                            {sending ? 'Sending…' : 'Send Campaign'}
                        </button>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}

/* ─── Loading Skeleton ─────────────────────────────────── */
function AdminSkeleton() {
    return (
        <div className="flex flex-col gap-8 pb-10 animate-pulse">
            <div className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl w-72" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 rounded-2xl" />)}
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-64 bg-gray-100 dark:bg-slate-800 rounded-2xl" />
                <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded-2xl" />
            </div>
            <div className="h-72 bg-gray-100 dark:bg-slate-800 rounded-2xl" />
        </div>
    );
}
