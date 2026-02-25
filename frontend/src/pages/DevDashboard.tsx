import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
    Server, Cpu, HardDrive, Activity, AlertTriangle,
    CheckCircle, XCircle, Clock, Wrench, Code2, Plus,
    RefreshCcw, Bug, Terminal
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

/* ─── Mock data ─────────────────────────────────────────── */
const systemMetrics = {
    cpu: 62,
    memory: 78,
    disk: 45,
    uptime: '14d 6h 22m',
    requests: '1,247/min',
    latency: '112 ms',
};

const recentLogs = [
    { id: 1, level: 'INFO', time: '22:04:13', msg: 'Judge0 health check passed — all 8 workers alive' },
    { id: 2, level: 'WARN', time: '22:01:47', msg: 'Redis cache miss rate elevated (18%). Investigating.' },
    { id: 3, level: 'INFO', time: '21:58:30', msg: 'New user registration: alex_new_coder (Grade 7)' },
    { id: 4, level: 'ERROR', time: '21:55:12', msg: 'Judge0 submission timeout — retried successfully' },
    { id: 5, level: 'INFO', time: '21:51:00', msg: 'DB backup completed (3.2 GB) in 48s' },
    { id: 6, level: 'WARN', time: '21:44:22', msg: 'Stripe webhook received — payment verification pending' },
    { id: 7, level: 'INFO', time: '21:40:11', msg: 'Hackathon "Spring Sprint" auto-closed. 214 submissions.' },
];

const bugReports = [
    { id: 'BUG-041', title: 'Python 3 output missing newlines', priority: 'high', status: 'open', reporter: 'student_08', created: '2h ago' },
    { id: 'BUG-040', title: 'Leaderboard XP tie-breaking issue', priority: 'medium', status: 'in-progress', reporter: 'admin', created: '5h ago' },
    { id: 'BUG-039', title: 'Mobile editor scroll flicker', priority: 'low', status: 'open', reporter: 'student_12', created: '1d ago' },
    { id: 'BUG-038', title: 'Hackathon timer desync on Safari', priority: 'high', status: 'resolved', reporter: 'dev_team', created: '2d ago' },
    { id: 'BUG-037', title: 'Badge icon missing for "Speedy"', priority: 'low', status: 'resolved', reporter: 'student_03', created: '3d ago' },
];

const PRIORITY: Record<string, string> = {
    high: 'bg-red-400/15 text-red-400',
    medium: 'bg-yellow-400/15 text-yellow-400',
    low: 'bg-green-400/15 text-green-400',
};
const STATUS_STYLE: Record<string, string> = {
    open: 'bg-blue-400/15 text-blue-400',
    'in-progress': 'bg-orange-400/15 text-orange-400',
    resolved: 'bg-green-400/15 text-green-400',
};
const LOG_STYLE: Record<string, { badge: string; icon: React.ReactNode }> = {
    INFO: { badge: 'text-blue-400 bg-blue-400/10', icon: <CheckCircle size={13} className="text-blue-400" /> },
    WARN: { badge: 'text-yellow-400 bg-yellow-400/10', icon: <AlertTriangle size={13} className="text-yellow-400" /> },
    ERROR: { badge: 'text-red-400 bg-red-400/10', icon: <XCircle size={13} className="text-red-400" /> },
};

export default function DevDashboard() {
    const { theme } = useAuthStore();
    const isDark = theme === 'dark';
    const card = mkCard(isDark);
    const muted = mkMuted(isDark);
    const head = mkHead(isDark);

    const [form, setForm] = useState({ title: '', difficulty: 'easy', grade: '3', topic: '', desc: '', points: '50' });
    const [submitting, setSubmitting] = useState(false);
    const [logFilter, setLogFilter] = useState('ALL');

    const visibleLogs = logFilter === 'ALL' ? recentLogs : recentLogs.filter(l => l.level === logFilter);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.desc) { toast.error('Title and description are required.'); return; }
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));
        toast.success(`Problem "${form.title}" added to the question bank!`);
        setForm({ title: '', difficulty: 'easy', grade: '3', topic: '', desc: '', points: '50' });
        setSubmitting(false);
    };

    /* ── Metric bar ── */
    const MetricBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
        <div>
            <div className="flex justify-between text-xs mb-1.5">
                <span className={muted}>{label}</span>
                <span className={`font-bold ${value > 85 ? 'text-red-400' : value > 70 ? 'text-yellow-400' : 'text-green-400'}`}>{value}%</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 pb-10 w-full">

            {/* ══════════════════════════════════════════════════
          Header
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Wrench size={20} className="text-green-400" />
                        <h1 className={`font-display text-2xl sm:text-3xl font-extrabold ${head}`}>Developer Dashboard</h1>
                    </div>
                    <p className={`text-sm ${muted}`}>System health, logs, bug tracker & content management</p>
                </div>
                <button onClick={() => toast.success('Metrics refreshed!')}
                    className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-slate-700 hover:bg-gray-50'
                        }`}>
                    <RefreshCcw size={15} /> Refresh
                </button>
            </motion.div>

            {/* ══════════════════════════════════════════════════
          Quick Info Cards
      ══════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { icon: Server, label: 'Uptime', value: systemMetrics.uptime, color: 'text-green-400', bg: 'bg-green-400/10' },
                    { icon: Clock, label: 'Latency', value: systemMetrics.latency, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { icon: Activity, label: 'Req/min', value: systemMetrics.requests, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { icon: Cpu, label: 'CPU', value: `${systemMetrics.cpu}%`, color: systemMetrics.cpu > 80 ? 'text-red-400' : 'text-yellow-400', bg: systemMetrics.cpu > 80 ? 'bg-red-400/10' : 'bg-yellow-400/10' },
                    { icon: HardDrive, label: 'Memory', value: `${systemMetrics.memory}%`, color: systemMetrics.memory > 85 ? 'text-red-400' : 'text-orange-400', bg: 'bg-orange-400/10' },
                    { icon: Bug, label: 'Open Bugs', value: `${bugReports.filter(b => b.status !== 'resolved').length}`, color: 'text-red-400', bg: 'bg-red-400/10' },
                ].map((s, i) => (
                    <motion.div key={s.label} {...up(i * 0.05)} className={`${card} rounded-2xl p-4 flex flex-col items-center text-center gap-2`}>
                        <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                            <s.icon size={18} className={s.color} />
                        </div>
                        <p className={`text-base font-display font-extrabold ${head}`}>{s.value}</p>
                        <p className={`text-[10px] font-semibold uppercase tracking-wider ${muted}`}>{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ══════════════════════════════════════════════════
          System Health Bars + Log Viewer
      ══════════════════════════════════════════════════ */}
            <div className="grid lg:grid-cols-5 gap-6">

                {/* Health bars */}
                <motion.div {...up(0.12)} className={`${card} rounded-2xl p-6 lg:col-span-2`}>
                    <div className="flex items-center gap-2 mb-5">
                        <Activity size={16} className="text-green-400" />
                        <h3 className={`font-display text-base font-bold ${head}`}>System Health</h3>
                    </div>
                    <div className="space-y-5">
                        <MetricBar label="CPU Usage" value={systemMetrics.cpu} color="bg-gradient-to-r from-blue-500 to-cyan-400" />
                        <MetricBar label="Memory Usage" value={systemMetrics.memory} color="bg-gradient-to-r from-yellow-500 to-orange-400" />
                        <MetricBar label="Disk Usage" value={systemMetrics.disk} color="bg-gradient-to-r from-green-500 to-teal-400" />
                    </div>
                    {/* Services status */}
                    <div className="mt-6 space-y-2.5">
                        {[
                            { name: 'Judge0 API', ok: true },
                            { name: 'PostgreSQL DB', ok: true },
                            { name: 'Redis Cache', ok: true },
                            { name: 'Stripe API', ok: true },
                            { name: 'Email (SES)', ok: false },
                        ].map(srv => (
                            <div key={srv.name} className="flex items-center justify-between">
                                <span className={`text-sm ${muted}`}>{srv.name}</span>
                                <span className={`flex items-center gap-1.5 text-xs font-semibold ${srv.ok ? 'text-green-400' : 'text-red-400'}`}>
                                    {srv.ok
                                        ? <><CheckCircle size={13} /> Healthy</>
                                        : <><XCircle size={13} /> Down</>}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Log Viewer */}
                <motion.div {...up(0.18)} className={`${card} rounded-2xl p-6 lg:col-span-3 flex flex-col gap-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal size={16} className="text-slate-400" />
                            <h3 className={`font-display text-base font-bold ${head}`}>Live Logs</h3>
                        </div>
                        <div className="flex gap-1.5">
                            {['ALL', 'INFO', 'WARN', 'ERROR'].map(lvl => (
                                <button key={lvl} onClick={() => setLogFilter(lvl)}
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${logFilter === lvl
                                        ? lvl === 'ERROR' ? 'bg-red-500 text-white' : lvl === 'WARN' ? 'bg-yellow-500 text-white' : lvl === 'INFO' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
                                        : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-gray-100 text-slate-500 hover:bg-gray-200'
                                        }`}>
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`rounded-xl overflow-hidden flex-1 ${isDark ? 'bg-slate-950' : 'bg-gray-900'}`}>
                        <div className={`px-4 py-2 border-b flex items-center gap-2 ${isDark ? 'border-slate-800' : 'border-gray-800'}`}>
                            <span className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-xs text-slate-500 ml-2 font-mono">system.log</span>
                        </div>
                        <div className="p-4 space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
                            {visibleLogs.map(log => (
                                <div key={log.id} className="flex items-start gap-3">
                                    <span className="text-slate-600 shrink-0">{log.time}</span>
                                    {LOG_STYLE[log.level]?.icon}
                                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${LOG_STYLE[log.level]?.badge}`}>{log.level}</span>
                                    <span className="text-slate-300 leading-relaxed">{log.msg}</span>
                                </div>
                            ))}
                            {visibleLogs.length === 0 && (
                                <p className="text-slate-600 text-center py-4">No logs for this filter.</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ══════════════════════════════════════════════════
          Bug Tracker
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0.24)} className={`${card} rounded-2xl overflow-hidden`}>
                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700 bg-slate-700/30' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                        <Bug size={16} className="text-red-400" />
                        <h3 className={`font-display text-base font-bold ${head}`}>Bug Tracker</h3>
                        <span className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-400/15 text-red-400`}>
                            {bugReports.filter(b => b.status !== 'resolved').length} open
                        </span>
                    </div>
                    <button onClick={() => toast.success('New bug report form opened!')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors">
                        <Plus size={14} /> Report Bug
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={`text-left text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'bg-slate-700/20 text-slate-500' : 'bg-gray-50 text-slate-400'}`}>
                                {['ID', 'Title', 'Priority', 'Status', 'Reporter', 'Created', 'Action'].map(h => (
                                    <th key={h} className="px-5 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                            {bugReports.map(bug => (
                                <tr key={bug.id} className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}`}>
                                    <td className={`px-5 py-4 font-mono text-[11px] font-bold ${muted}`}>{bug.id}</td>
                                    <td className={`px-5 py-4 font-medium ${head} max-w-xs`}>{bug.title}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${PRIORITY[bug.priority]}`}>{bug.priority}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[bug.status]}`}>{bug.status}</span>
                                    </td>
                                    <td className={`px-5 py-4 ${muted}`}>{bug.reporter}</td>
                                    <td className={`px-5 py-4 ${muted} text-xs`}>{bug.created}</td>
                                    <td className="px-5 py-4">
                                        <button onClick={() => toast.success(`Resolving ${bug.id}…`)}
                                            className={`text-[11px] font-semibold transition-colors ${bug.status === 'resolved' ? `${muted} cursor-default` : 'text-primary-500 hover:underline'}`}>
                                            {bug.status === 'resolved' ? 'Closed' : 'Resolve'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* ══════════════════════════════════════════════════
          Add Problem Form
      ══════════════════════════════════════════════════ */}
            <motion.div {...up(0.30)} className={`${card} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-400/15 flex items-center justify-center shrink-0">
                        <Code2 size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h3 className={`font-display text-base font-bold ${head}`}>Add Problem to Question Bank</h3>
                        <p className={`text-xs ${muted}`}>Fill in the details to create a new coding challenge</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Problem Title *</label>
                            <input
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Two Sum"
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all ${isDark ? 'bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-200 text-slate-900'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Difficulty</label>
                            <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all ${isDark ? 'bg-slate-700/60 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-slate-900'}`}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Minimum Grade</label>
                            <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all ${isDark ? 'bg-slate-700/60 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-slate-900'}`}>
                                {Array.from({ length: 10 }, (_, i) => i + 3).map(g => <option key={g} value={g}>Grade {g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Topic / Tag</label>
                            <input
                                value={form.topic}
                                onChange={e => setForm({ ...form, topic: e.target.value })}
                                placeholder="e.g. arrays, loops, strings"
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all ${isDark ? 'bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-200 text-slate-900'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Points / XP</label>
                            <input
                                type="number" min="10" max="500"
                                value={form.points}
                                onChange={e => setForm({ ...form, points: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all ${isDark ? 'bg-slate-700/60 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-slate-900'}`}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Problem Description (Markdown supported) *</label>
                        <textarea
                            rows={6}
                            value={form.desc}
                            onChange={e => setForm({ ...form, desc: e.target.value })}
                            placeholder="Describe the problem, constraints, and examples…"
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all font-mono ${isDark ? 'bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-200 text-slate-900'}`}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setForm({ title: '', difficulty: 'easy', grade: '3', topic: '', desc: '', points: '50' })}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-slate-700 hover:bg-gray-50'}`}>
                            Reset
                        </button>
                        <button type="submit" disabled={submitting}
                            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg transition-all ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-95'}`}>
                            <Plus size={15} />
                            {submitting ? 'Adding…' : 'Add Problem'}
                        </button>
                    </div>
                </form>
            </motion.div>

        </div>
    );
}
