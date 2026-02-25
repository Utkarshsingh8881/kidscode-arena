import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
    LayoutDashboard, Code2, Trophy, Users, BarChart2, Settings,
    LogOut, Moon, Sun, Menu, X, ChevronDown, Flame, Zap,
    User, Shield, Wrench
} from 'lucide-react';

const studentNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/problems', label: 'Problems', icon: Code2 },
    { to: '/hackathons', label: 'Hackathons', icon: Trophy },
    { to: '/mentors', label: 'Mentors', icon: Users },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
];

const adminNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin', label: 'Admin Panel', icon: Shield },
    { to: '/problems', label: 'Problems', icon: Code2 },
    { to: '/hackathons', label: 'Hackathons', icon: Trophy },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
];

const devNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dev', label: 'Dev Panel', icon: Wrench },
    { to: '/problems', label: 'Problems', icon: Code2 },
    { to: '/hackathons', label: 'Hackathons', icon: Trophy },
];

export default function Layout() {
    const { user, theme, setTheme, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const isDark = theme === 'dark';

    const navItems = user?.role === 'admin' ? adminNav : user?.role === 'developer' ? devNav : studentNav;

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const xpForNextLevel = 200;
    const xpInCurrentLevel = (user?.xp || 0) % xpForNextLevel;
    const xpPercent = Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100);

    const rankColors: Record<string, string> = {
        Diamond: 'text-purple-400',
        Platinum: 'text-cyan-400',
        Gold: 'text-yellow-400',
        Silver: 'text-slate-400',
        Bronze: 'text-amber-500',
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {/* ── Top Navbar ── */}
            <header className={`sticky top-0 z-50 w-full border-b ${isDark ? 'bg-slate-900/98 border-slate-700' : 'bg-white/98 border-gray-200'} backdrop-blur-md`}>
                <div className="w-full px-4 sm:px-6 lg:px-10">
                    <div className="flex items-center h-16 gap-6">

                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
                            <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center text-white font-bold text-lg shadow-lg">K</div>
                            <div className="hidden sm:block">
                                <span className={`font-display font-extrabold text-lg leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>KidsCode</span>
                                <span className="block text-[10px] font-semibold text-primary-500 leading-none tracking-wider uppercase">Arena</span>
                            </div>
                        </Link>

                        {/* Desktop Nav Links */}
                        <nav className="hidden md:flex items-center gap-1 flex-1">
                            {navItems.map(item => {
                                const active = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${active
                                            ? `${isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-700'}`
                                            : `${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100'}`
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        {item.label}
                                        {active && (
                                            <motion.div
                                                layoutId="nav-active"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                                                style={{ position: 'absolute' }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right side: XP, Streak, Theme, Profile */}
                        <div className="ml-auto flex items-center gap-2 sm:gap-3">

                            {/* Streak badge */}
                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                                <Flame size={15} className="text-orange-500" />
                                {user?.streak || 0}d
                            </div>

                            {/* XP badge */}
                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${isDark ? 'bg-yellow-500/15 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                                <Zap size={15} className="text-yellow-500" />
                                {(user?.xp || 0).toLocaleString()} XP
                            </div>

                            {/* Theme toggle */}
                            <button
                                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-gray-100 text-slate-500 hover:text-slate-900'}`}
                                title="Toggle theme"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {/* Profile dropdown */}
                            <div ref={profileRef} className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                                >
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-base font-bold shadow-md">
                                        {user?.avatar || '😊'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.username}</p>
                                        <p className={`text-xs leading-tight ${rankColors[user?.rank || 'Bronze'] || 'text-slate-400'}`}>Lv.{user?.level} · {user?.rank}</p>
                                    </div>
                                    <ChevronDown size={15} className={`${isDark ? 'text-slate-400' : 'text-slate-500'} transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                                        >
                                            {/* Profile header */}
                                            <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-700/40' : 'border-gray-100 bg-gray-50'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl shadow-md">
                                                        {user?.avatar}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.username}</p>
                                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>{user?.email}</p>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${user?.rank === 'Gold' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                                                user?.rank === 'Silver' ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
                                                                    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                                }`}>{user?.rank}</span>
                                                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Level {user?.level}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* XP progress bar */}
                                                <div className="mt-3">
                                                    <div className="flex justify-between mb-1">
                                                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>XP to Level {(user?.level || 1) + 1}</span>
                                                        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{xpInCurrentLevel}/{xpForNextLevel}</span>
                                                    </div>
                                                    <div className={`h-1.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`}>
                                                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${xpPercent}%` }} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu items */}
                                            <div className="p-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setProfileOpen(false)}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-gray-100 hover:text-slate-900'}`}
                                                >
                                                    <User size={16} className="text-primary-500" />
                                                    View Profile
                                                </Link>
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setProfileOpen(false)}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-gray-100 hover:text-slate-900'}`}
                                                >
                                                    <LayoutDashboard size={16} className="text-blue-500" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setProfileOpen(false)}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-gray-100 hover:text-slate-900'}`}
                                                >
                                                    <Settings size={16} className="text-slate-500" />
                                                    Settings
                                                </Link>
                                            </div>

                                            {/* Stats row */}
                                            <div className={`mx-2 mb-2 p-3 rounded-xl ${isDark ? 'bg-slate-700/40' : 'bg-gray-50'} grid grid-cols-3 gap-2 text-center`}>
                                                <div>
                                                    <p className={`text-base font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.solvedProblems?.length || 0}</p>
                                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Solved</p>
                                                </div>
                                                <div>
                                                    <p className={`text-base font-extrabold font-display text-orange-500`}>{user?.streak || 0}🔥</p>
                                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Streak</p>
                                                </div>
                                                <div>
                                                    <p className={`text-base font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.badges?.length || 0}</p>
                                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Badges</p>
                                                </div>
                                            </div>

                                            {/* Logout */}
                                            <div className={`p-2 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile menu toggle */}
                            <button
                                className={`md:hidden p-2 rounded-xl ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-slate-600'}`}
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    <AnimatePresence>
                        {mobileOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={`md:hidden overflow-hidden border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                            >
                                <nav className="flex flex-col gap-1 py-3">
                                    {navItems.map(item => {
                                        const active = location.pathname === item.to;
                                        return (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                                                    ? `${isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-700'}`
                                                    : `${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100'}`
                                                    }`}
                                            >
                                                <item.icon size={18} />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                    {/* Mobile XP + Streak */}
                                    <div className="flex gap-2 px-4 pt-2">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                                            <Flame size={14} /> {user?.streak || 0}d streak
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${isDark ? 'bg-yellow-500/15 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                                            <Zap size={14} /> {(user?.xp || 0).toLocaleString()} XP
                                        </div>
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* ── Page Content ── */}
            <main className="flex-1 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
                    <Outlet />
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className={`border-t py-6 px-6 text-center text-xs ${isDark ? 'border-slate-800/60 text-slate-600' : 'border-gray-200 text-slate-400'}`}>
                © 2025 KidsCode Arena · Built with ❤️ for young coders everywhere
            </footer>
        </div>
    );
}
