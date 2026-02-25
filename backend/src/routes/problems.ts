import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { problems, submissions, users, dailyChallenges, badges } from '../config/database';
import { authenticate, AuthRequest, authorize } from '../middleware/auth';

const router = Router();

// Get all problems with filtering
router.get('/', (_req: Request, res: Response): void => {
    const { grade, difficulty, language, topic, search } = _req.query;

    let filtered = problems.filter(p => p.isActive);

    if (grade) filtered = filtered.filter(p => p.grade.includes(Number(grade)));
    if (difficulty) filtered = filtered.filter(p => p.difficulty === difficulty);
    if (language) filtered = filtered.filter(p => p.languages.includes(language as string));
    if (topic) filtered = filtered.filter(p => p.topics.includes(topic as string));
    if (search) {
        const s = (search as string).toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
        );
    }

    // Don't send solutions to client
    const sanitized = filtered.map(({ solution, ...p }) => p);
    res.json(sanitized);
});

// Get single problem
router.get('/:id', (req: Request, res: Response): void => {
    const problem = problems.find(p => p.id === req.params.id);
    if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
    }
    const { solution, ...sanitized } = problem;
    res.json(sanitized);
});

// Get daily challenge
router.get('/daily/today', (_req: Request, res: Response): void => {
    const today = new Date().toISOString().split('T')[0];
    let challenge = dailyChallenges.find(dc => dc.date === today);
    if (!challenge) {
        // Auto-create one
        const randomProblem = problems[Math.floor(Math.random() * problems.length)];
        challenge = {
            id: uuidv4(),
            problemId: randomProblem.id,
            date: today,
            bonusXp: 50,
        };
        dailyChallenges.push(challenge);
    }
    const problem = problems.find(p => p.id === challenge!.problemId);
    res.json({ ...challenge, problem });
});

// Submit solution
router.post('/:id/submit', authenticate, (req: AuthRequest, res: Response): void => {
    const problem = problems.find(p => p.id === req.params.id);
    if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
    }

    const { code, language } = req.body;
    if (!code || !language) {
        res.status(400).json({ error: 'Code and language are required' });
        return;
    }

    // Simulate code execution with test cases
    const testResults = problem.testCases.map(tc => {
        // Simple simulation - in production, use Judge0 API
        const passed = simulateExecution(code, language, tc.input, tc.expectedOutput);
        return {
            passed,
            input: tc.isHidden ? '[Hidden]' : tc.input,
            expected: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
            actual: passed ? tc.expectedOutput : 'Incorrect output',
        };
    });

    const allPassed = testResults.every(r => r.passed);
    const status = allPassed ? 'accepted' : 'wrong_answer';

    const submission: any = {
        id: uuidv4(),
        userId: req.user!.id,
        problemId: problem.id,
        language,
        code,
        status,
        executionTime: Math.floor(Math.random() * 100) + 20,
        memory: Math.random() * 10 + 5,
        output: testResults[0]?.actual || '',
        createdAt: new Date().toISOString(),
        testResults,
    };

    submissions.push(submission);

    // Award XP if accepted and not previously solved
    if (allPassed) {
        const user = users.find(u => u.id === req.user!.id);
        if (user && !user.solvedProblems.includes(problem.id)) {
            user.solvedProblems.push(problem.id);
            user.xp += problem.xpReward;

            // Check daily challenge bonus
            const today = new Date().toISOString().split('T')[0];
            const dailyChallenge = dailyChallenges.find(dc => dc.date === today && dc.problemId === problem.id);
            if (dailyChallenge) {
                user.xp += dailyChallenge.bonusXp;
            }

            // Update streak
            const lastActive = new Date(user.lastActiveDate).toISOString().split('T')[0];
            const todayDate = new Date().toISOString().split('T')[0];
            if (lastActive !== todayDate) {
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                if (lastActive === yesterday) {
                    user.streak++;
                } else if (!user.streakFreezeUsed) {
                    user.streak = 1;
                }
                user.lastActiveDate = new Date().toISOString();
            }
            if (user.streak > user.longestStreak) {
                user.longestStreak = user.streak;
            }

            // Update level and rank
            user.level = Math.floor(user.xp / 200) + 1;
            if (user.xp >= 5000) user.rank = 'Diamond';
            else if (user.xp >= 3000) user.rank = 'Platinum';
            else if (user.xp >= 2000) user.rank = 'Gold';
            else if (user.xp >= 1000) user.rank = 'Silver';
            else user.rank = 'Bronze';

            // Check badge unlocks
            checkAndAwardBadges(user);
        }
    }

    res.json(submission);
});

// Run code (without submitting)
router.post('/:id/run', authenticate, (req: AuthRequest, res: Response): void => {
    const problem = problems.find(p => p.id === req.params.id);
    if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
    }

    const { code, language, customInput } = req.body;

    // Only test against visible test cases or custom input
    const testCases = customInput
        ? [{ input: customInput, expectedOutput: '', isHidden: false }]
        : problem.testCases.filter(tc => !tc.isHidden);

    const testResults = testCases.map(tc => {
        const passed = customInput ? true : simulateExecution(code, language, tc.input, tc.expectedOutput);
        return {
            passed,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: passed ? tc.expectedOutput : 'Incorrect output',
        };
    });

    res.json({
        testResults,
        executionTime: Math.floor(Math.random() * 100) + 20,
        memory: Math.random() * 10 + 5,
    });
});

// Get user submissions for a problem
router.get('/:id/submissions', authenticate, (req: AuthRequest, res: Response): void => {
    const userSubmissions = submissions
        .filter(s => s.problemId === req.params.id && s.userId === req.user!.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(userSubmissions);
});

// Admin: Create problem
router.post('/', authenticate, authorize('admin', 'developer'), (req: AuthRequest, res: Response): void => {
    const newProblem: any = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString(),
        createdBy: req.user!.id,
        isActive: true,
    };
    problems.push(newProblem);
    res.status(201).json(newProblem);
});

// Admin: Update problem
router.put('/:id', authenticate, authorize('admin', 'developer'), (req: AuthRequest, res: Response): void => {
    const index = problems.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ error: 'Problem not found' });
        return;
    }
    problems[index] = { ...problems[index], ...req.body };
    res.json(problems[index]);
});

// Admin: Delete problem
router.delete('/:id', authenticate, authorize('admin'), (req: AuthRequest, res: Response): void => {
    const index = problems.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ error: 'Problem not found' });
        return;
    }
    problems[index].isActive = false;
    res.json({ message: 'Problem deactivated' });
});

// Get all topics
router.get('/meta/topics', (_req: Request, res: Response): void => {
    const topics = [...new Set(problems.flatMap(p => p.topics))];
    res.json(topics);
});

// Helper functions
function simulateExecution(code: string, language: string, input: string, expectedOutput: string): boolean {
    // Simple simulation - checks if code contains key patterns
    // In production, this would call Judge0 API
    if (!code.trim()) return false;
    // For demo, accept if code is non-empty and contains reasonable patterns
    const codeLen = code.trim().length;
    if (codeLen < 5) return false;
    // Simulate ~80% pass rate for non-trivial code
    return Math.random() > 0.2 || codeLen > 50;
}

function checkAndAwardBadges(user: any): void {
    const badgeChecks = [
        { id: 'first-solve', condition: user.solvedProblems.length >= 1 },
        { id: 'ten-solves', condition: user.solvedProblems.length >= 10 },
        { id: 'fifty-solves', condition: user.solvedProblems.length >= 50 },
        { id: 'streak-7', condition: user.streak >= 7 },
        { id: 'streak-14', condition: user.streak >= 14 },
        { id: 'streak-30', condition: user.streak >= 30 },
    ];

    for (const check of badgeChecks) {
        if (check.condition && !user.badges.includes(check.id)) {
            user.badges.push(check.id);
            const badge = badges.find(b => b.id === check.id);
            if (badge) user.xp += badge.xpBonus;
        }
    }
}

export default router;
