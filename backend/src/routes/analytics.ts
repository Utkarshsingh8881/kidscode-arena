import { Router, Response } from 'express';
import { users, problems, submissions, hackathons, badges as allBadges } from '../config/database';
import { authenticate, AuthRequest, authorize } from '../middleware/auth';

const router = Router();

// Get dashboard stats for student
router.get('/student', authenticate, (req: AuthRequest, res: Response): void => {
    const user = users.find(u => u.id === req.user!.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    const userSubmissions = submissions.filter(s => s.userId === user.id);
    const totalSubmissions = userSubmissions.length;
    const acceptedSubmissions = userSubmissions.filter(s => s.status === 'accepted').length;
    const solvedByDifficulty = {
        easy: 0, medium: 0, hard: 0,
    };
    user.solvedProblems.forEach(pid => {
        const p = problems.find(prob => prob.id === pid);
        if (p) solvedByDifficulty[p.difficulty]++;
    });

    const languageStats: Record<string, number> = {};
    userSubmissions.filter(s => s.status === 'accepted').forEach(s => {
        languageStats[s.language] = (languageStats[s.language] || 0) + 1;
    });

    // Activity heatmap (last 90 days)
    const heatmap: Record<string, number> = {};
    for (let i = 0; i < 90; i++) {
        const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
        heatmap[date] = Math.floor(Math.random() * 5);
    }
    // Ensure today has activity
    heatmap[new Date().toISOString().split('T')[0]] = Math.floor(Math.random() * 4) + 1;

    // Weekly progress
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - (6 - i) * 86400000);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            problems: Math.floor(Math.random() * 5),
            xp: Math.floor(Math.random() * 200),
        };
    });

    const earnedBadges = allBadges.filter(b => user.badges.includes(b.id));

    res.json({
        profile: {
            username: user.username,
            avatar: user.avatar,
            level: user.level,
            xp: user.xp,
            xpToNextLevel: (user.level) * 200,
            rank: user.rank,
            grade: user.grade,
            streak: user.streak,
            longestStreak: user.longestStreak,
            streakFreezeAvailable: !user.streakFreezeUsed,
            subscription: user.subscription,
            memberSince: user.createdAt,
        },
        stats: {
            totalSolved: user.solvedProblems.length,
            totalSubmissions,
            acceptedSubmissions,
            acceptanceRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
            solvedByDifficulty,
            languageStats,
            totalProblems: problems.filter(p => p.isActive).length,
        },
        heatmap,
        weeklyProgress,
        badges: earnedBadges,
        recentSubmissions: userSubmissions.slice(-5).reverse(),
    });
});

// Admin analytics
router.get('/admin', authenticate, authorize('admin'), (_req: AuthRequest, res: Response): void => {
    const totalUsers = users.filter(u => u.role === 'student').length;
    const activeUsers = users.filter(u => {
        const lastActive = new Date(u.lastActiveDate);
        const dayAgo = new Date(Date.now() - 86400000);
        return lastActive > dayAgo && u.role === 'student';
    }).length;

    const totalSubmissionsCount = submissions.length;
    const todaySubmissions = submissions.filter(s => {
        const subDate = new Date(s.createdAt).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return subDate === today;
    }).length;

    // Daily submissions chart (last 30 days)
    const dailySubmissions = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(Date.now() - (29 - i) * 86400000);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            submissions: Math.floor(Math.random() * 100) + 20,
            users: Math.floor(Math.random() * 30) + 5,
        };
    });

    // Revenue data
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            subscriptions: Math.floor(Math.random() * 5000) + 2000,
            mentoring: Math.floor(Math.random() * 3000) + 1000,
            hackathons: Math.floor(Math.random() * 1000) + 500,
        };
    });

    const gradeDistribution = Array.from({ length: 10 }, (_, i) => ({
        grade: i + 3,
        students: users.filter(u => u.grade === i + 3 && u.role === 'student').length || Math.floor(Math.random() * 20) + 5,
    }));

    res.json({
        overview: {
            totalUsers,
            activeUsers,
            totalProblems: problems.length,
            totalSubmissions: totalSubmissionsCount,
            todaySubmissions,
            proUsers: users.filter(u => u.subscription === 'pro').length,
            totalHackathons: hackathons.length,
            totalRevenue: '$12,450',
        },
        dailySubmissions,
        monthlyRevenue,
        gradeDistribution,
        recentUsers: users
            .filter(u => u.role === 'student')
            .slice(-10)
            .reverse()
            .map(({ password, ...u }) => u),
    });
});

// Developer dashboard
router.get('/developer', authenticate, authorize('developer', 'admin'), (_req: AuthRequest, res: Response): void => {
    const systemHealth = {
        apiResponseTime: '45ms',
        uptime: '99.97%',
        errorRate: '0.02%',
        activeConnections: 142,
        cpuUsage: '23%',
        memoryUsage: '61%',
    };

    const recentLogs = [
        { timestamp: new Date().toISOString(), level: 'info', message: 'New user registered: student_007' },
        { timestamp: new Date(Date.now() - 300000).toISOString(), level: 'warn', message: 'Rate limit reached for IP 192.168.1.45' },
        { timestamp: new Date(Date.now() - 600000).toISOString(), level: 'info', message: 'Hackathon #12 started' },
        { timestamp: new Date(Date.now() - 900000).toISOString(), level: 'error', message: 'Code execution timeout for submission sub-789' },
        { timestamp: new Date(Date.now() - 1200000).toISOString(), level: 'info', message: 'Daily challenge rotated' },
    ];

    const bugReports = [
        { id: 'bug-001', title: 'Code editor not loading on Safari', status: 'open', priority: 'high', reporter: 'student-002', createdAt: '2024-10-20' },
        { id: 'bug-002', title: 'Streak not updating after midnight', status: 'in-progress', priority: 'medium', reporter: 'student-001', createdAt: '2024-10-19' },
        { id: 'bug-003', title: 'Certificate generation fails for special characters', status: 'resolved', priority: 'low', reporter: 'student-003', createdAt: '2024-10-18' },
    ];

    res.json({
        systemHealth,
        recentLogs,
        bugReports,
        questionBank: {
            total: problems.length,
            active: problems.filter(p => p.isActive).length,
            byDifficulty: {
                easy: problems.filter(p => p.difficulty === 'easy').length,
                medium: problems.filter(p => p.difficulty === 'medium').length,
                hard: problems.filter(p => p.difficulty === 'hard').length,
            },
        },
        submissions: {
            total: submissions.length,
            today: submissions.filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString()).length,
        },
    });
});

export default router;
