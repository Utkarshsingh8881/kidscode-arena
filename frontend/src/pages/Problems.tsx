import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Search, Filter, ChevronRight, CheckCircle2, Lock, Code, Flame } from 'lucide-react';

interface Problem {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    grade: number[];
    topics: string[];
    languages: string[];
    xpReward: number;
}

const difficultyColors = {
    easy: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
    hard: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
};

const languageEmojis: Record<string, string> = {
    python: '🐍', javascript: '⚡', java: '☕', cpp: '⚔️',
};

const allTopics = ['basics', 'math', 'strings', 'arrays', 'loops', 'conditionals', 'recursion', 'algorithms', 'dynamic-programming', 'hash-map'];

export default function Problems() {
    const { user, theme } = useAuthStore();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [grade, setGrade] = useState('');
    const [language, setLanguage] = useState('');
    const [topic, setTopic] = useState('');
    const isDark = theme === 'dark';

    useEffect(() => {
        fetchProblems();
    }, [difficulty, grade, language, topic]);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (difficulty) params.set('difficulty', difficulty);
            if (grade) params.set('grade', grade);
            if (language) params.set('language', language);
            if (topic) params.set('topic', topic);
            const { data } = await api.get(`/problems?${params}`);
            setProblems(data);
        } finally {
            setLoading(false);
        }
    };

    const filtered = problems.filter(p =>
        !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.topics.some(t => t.includes(search.toLowerCase()))
    );

    const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
    const select = `px-3 py-2 rounded-xl text-sm border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`;

    const solved = new Set(user?.solvedProblems || []);
    const easyCount = filtered.filter(p => p.difficulty === 'easy').length;
    const medCount = filtered.filter(p => p.difficulty === 'medium').length;
    const hardCount = filtered.filter(p => p.difficulty === 'hard').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`font-display text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Problem Bank 💡
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Sharpen your skills. Pick a challenge and start coding!
                </p>
            </div>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-3">
                {[
                    { label: `${filtered.length} Total`, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
                    { label: `${easyCount} Easy`, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
                    { label: `${medCount} Medium`, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
                    { label: `${hardCount} Hard`, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
                    { label: `${solved.size} Solved`, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
                ].map(c => (
                    <span key={c.label} className={`text-xs font-bold px-3 py-1.5 rounded-full ${c.color}`}>{c.label}</span>
                ))}
            </div>

            {/* Filters */}
            <div className={`${card} border rounded-2xl p-4`}>
                <div className="flex flex-wrap gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search problems..."
                            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-300 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        />
                    </div>

                    <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={select}>
                        <option value="">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <select value={grade} onChange={e => setGrade(e.target.value)} className={select}>
                        <option value="">All Grades</option>
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 3} value={i + 3}>Grade {i + 3}</option>
                        ))}
                    </select>

                    <select value={language} onChange={e => setLanguage(e.target.value)} className={select}>
                        <option value="">All Languages</option>
                        <option value="python">🐍 Python</option>
                        <option value="javascript">⚡ JavaScript</option>
                        <option value="java">☕ Java</option>
                        <option value="cpp">⚔️ C++</option>
                    </select>

                    <select value={topic} onChange={e => setTopic(e.target.value)} className={select}>
                        <option value="">All Topics</option>
                        {allTopics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {(difficulty || grade || language || topic || search) && (
                        <button
                            onClick={() => { setDifficulty(''); setGrade(''); setLanguage(''); setTopic(''); setSearch(''); }}
                            className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Clear ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Problems List */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className={`font-display text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No problems found</h3>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Try adjusting your filters</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((problem, i) => {
                        const isSolved = solved.has(problem.id);
                        const dc = difficultyColors[problem.difficulty];
                        const isLocked = user?.subscription === 'free' && problem.difficulty === 'hard' && i > 2;

                        return (
                            <motion.div
                                key={problem.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className={`${card} border rounded-2xl p-4 hover:shadow-md transition-all duration-200 group`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Status icon */}
                                    <div className="shrink-0">
                                        {isLocked ? (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                                                <Lock size={16} className="text-gray-400" />
                                            </div>
                                        ) : isSolved ? (
                                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <CheckCircle2 size={18} className="text-green-500" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                                <Code size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & meta */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Link
                                                to={isLocked ? '#' : `/problems/${problem.id}`}
                                                className={`font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'} ${isSolved ? 'line-through opacity-70' : ''}`}
                                            >
                                                {problem.title}
                                            </Link>
                                            {isLocked && <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-semibold px-2 py-0.5 rounded-full">PRO</span>}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${dc.bg} ${dc.text}`}>
                                                {problem.difficulty}
                                            </span>
                                            {problem.topics.slice(0, 3).map(t => (
                                                <span key={t} className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-slate-500'}`}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div className="hidden sm:flex items-center gap-1">
                                        {problem.languages.map(lang => (
                                            <span key={lang} title={lang} className="text-lg">{languageEmojis[lang] || '📝'}</span>
                                        ))}
                                    </div>

                                    {/* XP */}
                                    <div className={`shrink-0 text-right hidden sm:block`}>
                                        <span className={`text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full flex items-center gap-1`}>
                                            <Flame size={11} />
                                            +{problem.xpReward} XP
                                        </span>
                                    </div>

                                    {/* Arrow */}
                                    {!isLocked && (
                                        <Link to={`/problems/${problem.id}`} className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors">
                                            <ChevronRight size={20} />
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
