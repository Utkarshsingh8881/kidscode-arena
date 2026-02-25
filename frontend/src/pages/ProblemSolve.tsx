import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import {
    Play, Send, Lightbulb, RotateCcw, CheckCircle2, XCircle,
    Clock, MemoryStick, ChevronLeft, ChevronDown, ChevronUp, Trophy, Loader2, Terminal
} from 'lucide-react';
import toast from 'react-hot-toast';

const LANG_IDS: Record<string, string> = {
    python: 'python', javascript: 'javascript', java: 'java', cpp: 'cpp',
};

const LANG_LABELS: Record<string, string> = {
    python: '🐍 Python', javascript: '⚡ JavaScript', java: '☕ Java', cpp: '⚔️ C++',
};

export default function ProblemSolve() {
    const { id } = useParams<{ id: string }>();
    const { user, theme } = useAuthStore();
    const navigate = useNavigate();
    const isDark = theme === 'dark';

    const [problem, setProblem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState('');
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'problem' | 'submissions'>('problem');
    const [showHint, setShowHint] = useState(false);
    const [hintIndex, setHintIndex] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [useCustomInput, setUseCustomInput] = useState(false);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Timer
    useEffect(() => {
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const { data } = await api.get(`/problems/${id}`);
                setProblem(data);
                setCode(data.starterCode?.[language] || '');
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    useEffect(() => {
        if (problem) {
            const saved = localStorage.getItem(`code_${id}_${language}`);
            setCode(saved || problem.starterCode?.[language] || '');
        }
    }, [language, problem]);

    // Auto-save
    useEffect(() => {
        if (code && id) {
            localStorage.setItem(`code_${id}_${language}`, code);
        }
    }, [code, language, id]);

    const handleRun = async () => {
        setRunning(true);
        setResult(null);
        try {
            const { data } = await api.post(`/problems/${id}/run`, {
                code, language, customInput: useCustomInput ? customInput : undefined,
            });
            setResult({ ...data, type: 'run' });
        } catch (e: any) {
            toast.error('Run failed: ' + (e.response?.data?.error || e.message));
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setResult(null);
        try {
            const { data } = await api.post(`/problems/${id}/submit`, { code, language });
            setResult({ ...data, type: 'submit' });
            if (data.status === 'accepted') {
                toast.success('🎉 Accepted! +' + problem.xpReward + ' XP earned!');
                // Refresh submissions
                const subRes = await api.get(`/problems/${id}/submissions`);
                setSubmissions(subRes.data);
            } else {
                toast.error('Wrong Answer – check your logic and try again!');
            }
        } catch (e: any) {
            toast.error('Submit failed: ' + (e.response?.data?.error || e.message));
        } finally {
            setSubmitting(false);
        }
    };

    const loadSubmissions = async () => {
        const { data } = await api.get(`/problems/${id}/submissions`);
        setSubmissions(data);
        setActiveTab('submissions');
    };

    const resetCode = () => {
        if (problem) {
            setCode(problem.starterCode?.[language] || '');
            localStorage.removeItem(`code_${id}_${language}`);
            toast.success('Code reset!');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <Loader2 size={40} className="animate-spin text-primary-500" />
        </div>
    );
    if (!problem) return <div>Problem not found</div>;

    const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
    const editorTheme = isDark ? 'vs-dark' : 'light';
    const diffColors = {
        easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <button
                    onClick={() => navigate('/problems')}
                    className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
                >
                    <ChevronLeft size={18} />
                    Back
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className={`font-display text-xl font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {problem.title}
                        </h1>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${diffColors[problem.difficulty as keyof typeof diffColors]}`}>
                            {problem.difficulty}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                            +{problem.xpReward} XP
                        </span>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'} bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl`}>
                    <Clock size={14} />
                    {formatTime(timer)}
                </div>
            </div>

            {/* Main split pane */}
            <div className="flex-1 grid lg:grid-cols-2 gap-4 min-h-0">

                {/* Left: Problem description */}
                <div className={`${card} border rounded-2xl overflow-hidden flex flex-col`}>
                    {/* Tabs */}
                    <div className={`flex border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        {['problem', 'submissions'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => tab === 'submissions' ? loadSubmissions() : setActiveTab('problem')}
                                className={`px-5 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab
                                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                                        : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`
                                    }`}
                            >
                                {tab === 'problem' ? '📄 Problem' : '📊 Submissions'}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5">
                        {activeTab === 'problem' ? (
                            <div className="space-y-4">
                                {/* Topics */}
                                <div className="flex flex-wrap gap-2">
                                    {problem.topics.map((t: string) => (
                                        <span key={t} className={`text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-slate-600'}`}>{t}</span>
                                    ))}
                                </div>

                                {/* Description */}
                                <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
                                    <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {problem.description}
                                    </div>
                                </div>

                                {/* Test cases */}
                                {problem.testCases?.filter((tc: any) => !tc.isHidden).length > 0 && (
                                    <div>
                                        <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Examples:</h4>
                                        {problem.testCases.filter((tc: any) => !tc.isHidden).map((tc: any, i: number) => (
                                            <div key={i} className={`mb-3 p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                                {tc.input && (
                                                    <div className="mb-2">
                                                        <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Input:</span>
                                                        <pre className={`text-xs font-mono mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{tc.input}</pre>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expected Output:</span>
                                                    <pre className={`text-xs font-mono mt-1 text-green-600 dark:text-green-400`}>{tc.expectedOutput}</pre>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Hints */}
                                {problem.hints?.length > 0 && (
                                    <div>
                                        <button
                                            onClick={() => setShowHint(!showHint)}
                                            className={`flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400 hover:opacity-80 transition-opacity`}
                                        >
                                            <Lightbulb size={16} className="text-yellow-500" />
                                            {showHint ? 'Hide Hint' : 'Show Hint'}
                                            {showHint ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                        <AnimatePresence>
                                            {showHint && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
                                                >
                                                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                                        💡 {problem.hints[hintIndex]}
                                                    </p>
                                                    {problem.hints.length > 1 && (
                                                        <button
                                                            onClick={() => setHintIndex((hintIndex + 1) % problem.hints.length)}
                                                            className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 hover:underline"
                                                        >
                                                            Next hint →
                                                        </button>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {submissions.length === 0 ? (
                                    <div className="text-center py-10">
                                        <Trophy size={40} className={`mx-auto mb-2 opacity-30 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                                        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No submissions yet</p>
                                    </div>
                                ) : submissions.map((sub) => (
                                    <div key={sub.id} className={`p-3 rounded-xl border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sub.status === 'accepted'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {sub.status === 'accepted' ? '✅ Accepted' : '❌ Wrong Answer'}
                                            </span>
                                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {new Date(sub.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span>⚡ {sub.language}</span>
                                            {sub.executionTime && <span>🕐 {sub.executionTime}ms</span>}
                                            {sub.memory && <span>💾 {sub.memory.toFixed(1)}MB</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Code Editor */}
                <div className={`${card} border rounded-2xl overflow-hidden flex flex-col`}>
                    {/* Editor toolbar */}
                    <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className={`text-sm font-semibold px-3 py-1.5 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        >
                            {problem.languages.map((lang: string) => (
                                <option key={lang} value={lang}>{LANG_LABELS[lang] || lang}</option>
                            ))}
                        </select>
                        <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Auto-saved ✓</span>
                        <button onClick={resetCode} title="Reset code" className={`ml-auto p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}>
                            <RotateCcw size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                        </button>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 min-h-0">
                        <Editor
                            height="100%"
                            language={LANG_IDS[language]}
                            value={code}
                            onChange={val => setCode(val || '')}
                            theme={editorTheme}
                            options={{
                                fontSize: 14,
                                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                lineNumbers: 'on',
                                renderLineHighlight: 'all',
                                padding: { top: 12, bottom: 12 },
                                smoothScrolling: true,
                                cursorSmoothCaretAnimation: 'on',
                                bracketPairColorization: { enabled: true },
                            }}
                        />
                    </div>

                    {/* Custom input toggle */}
                    <div className={`px-4 py-2 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useCustomInput}
                                onChange={e => setUseCustomInput(e.target.checked)}
                                className="rounded accent-primary-500"
                            />
                            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <Terminal size={12} className="inline mr-1" />
                                Custom Input
                            </span>
                        </label>
                        {useCustomInput && (
                            <textarea
                                value={customInput}
                                onChange={e => setCustomInput(e.target.value)}
                                placeholder="Enter your test input here..."
                                rows={3}
                                className={`w-full mt-2 px-3 py-2 text-xs font-mono rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none`}
                            />
                        )}
                    </div>

                    {/* Run/Submit buttons */}
                    <div className={`flex gap-3 p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <button
                            onClick={handleRun}
                            disabled={running || submitting}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-900'} disabled:opacity-50`}
                        >
                            {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                            Run
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={running || submitting}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-sm disabled:opacity-50"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {submitting ? 'Submitting...' : 'Submit Solution'}
                        </button>
                    </div>

                    {/* Result panel */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-200'} overflow-hidden`}
                            >
                                <div className={`p-4 max-h-48 overflow-y-auto ${result.status === 'accepted' ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        {result.status === 'accepted' ? (
                                            <><CheckCircle2 size={18} className="text-green-500" /> <span className="font-bold text-green-700 dark:text-green-400">All Tests Passed! 🎉</span></>
                                        ) : result.type === 'run' ? (
                                            <><Terminal size={18} className="text-blue-500" /> <span className="font-bold text-blue-700 dark:text-blue-400">Run Results</span></>
                                        ) : (
                                            <><XCircle size={18} className="text-red-500" /> <span className="font-bold text-red-700 dark:text-red-400">Wrong Answer</span></>
                                        )}
                                        {result.executionTime && (
                                            <span className={`ml-auto text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                ⚡ {result.executionTime}ms
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {result.testResults?.map((tr: any, i: number) => (
                                            <div key={i} className={`text-xs p-2 rounded-lg ${tr.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                                <div className="flex items-center gap-1.5 font-semibold">
                                                    {tr.passed ? '✅' : '❌'} Test {i + 1}
                                                </div>
                                                {!tr.passed && tr.input !== '[Hidden]' && (
                                                    <div className="mt-1 space-y-0.5 font-mono">
                                                        <div className={isDark ? 'text-slate-300' : 'text-slate-600'}>In: <span className="font-semibold">{tr.input}</span></div>
                                                        <div className="text-green-600 dark:text-green-400">Expected: <span className="font-semibold">{tr.expected}</span></div>
                                                        <div className="text-red-600 dark:text-red-400">Got: <span className="font-semibold">{tr.actual}</span></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
