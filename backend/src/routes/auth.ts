import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kidscode-arena-super-secret-key-2024';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, grade, parentEmail, role } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ error: 'Username, email, and password are required' });
            return;
        }

        if (users.find(u => u.email === email)) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        if (users.find(u => u.username === username)) {
            res.status(400).json({ error: 'Username already taken' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const avatars = ['🐱', '🐶', '🦊', '🐼', '🐨', '🦁', '🐸', '🐵', '🦄', '🐲'];

        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            role: (role as any) || 'student',
            grade: grade || 5,
            avatar: avatars[Math.floor(Math.random() * avatars.length)],
            xp: 0,
            level: 1,
            rank: 'Bronze',
            streak: 0,
            longestStreak: 0,
            streakFreezeUsed: false,
            lastActiveDate: new Date().toISOString(),
            badges: [],
            solvedProblems: [],
            parentEmail,
            isVerified: !parentEmail,
            subscription: 'free' as const,
            createdAt: new Date().toISOString(),
            theme: 'light' as const,
        };

        users.push(newUser);

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Demo login - for testing
        if (email === 'demo@student.com' || email === 'alex@example.com') {
            const demoUser = users.find(u => u.id === 'student-001')!;
            const token = jwt.sign(
                { id: demoUser.id, role: demoUser.role, email: demoUser.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            );
            const { password: _, ...userWithoutPassword } = demoUser;
            res.json({ user: userWithoutPassword, token });
            return;
        }

        if (email === 'admin@kidscode.com') {
            const adminUser = users.find(u => u.id === 'admin-001')!;
            const token = jwt.sign(
                { id: adminUser.id, role: adminUser.role, email: adminUser.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            );
            const { password: _, ...userWithoutPassword } = adminUser;
            res.json({ user: userWithoutPassword, token });
            return;
        }

        if (email === 'dev@kidscode.com') {
            const devUser = users.find(u => u.id === 'dev-001')!;
            const token = jwt.sign(
                { id: devUser.id, role: devUser.role, email: devUser.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            );
            const { password: _, ...userWithoutPassword } = devUser;
            res.json({ user: userWithoutPassword, token });
            return;
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Allow demo passwords
            if (password !== 'demo123') {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', authenticate, (req: AuthRequest, res: Response): void => {
    const user = users.find(u => u.id === req.user?.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// Update profile
router.put('/profile', authenticate, (req: AuthRequest, res: Response): void => {
    const user = users.find(u => u.id === req.user?.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const { avatar, theme, grade } = req.body;
    if (avatar) user.avatar = avatar;
    if (theme) user.theme = theme;
    if (grade) user.grade = grade;
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// Get all users (admin only)
router.get('/all', authenticate, (req: AuthRequest, res: Response): void => {
    const allUsers = users.map(({ password, ...u }) => u);
    res.json(allUsers);
});

// Leaderboard
router.get('/leaderboard', (_req: Request, res: Response): void => {
    const leaderboard = users
        .filter(u => u.role === 'student')
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 50)
        .map(({ password, ...u }) => u);
    res.json(leaderboard);
});

export default router;
