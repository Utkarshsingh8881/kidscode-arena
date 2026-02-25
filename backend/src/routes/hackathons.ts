import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { hackathons, users } from '../config/database';
import { authenticate, AuthRequest, authorize } from '../middleware/auth';

const router = Router();

// Get all hackathons
router.get('/', (_req: Request, res: Response): void => {
    const now = new Date();
    const enriched = hackathons.map(h => ({
        ...h,
        participantCount: h.participants.length,
        status: new Date(h.startTime) > now ? 'upcoming' : new Date(h.endTime) < now ? 'ended' : 'active',
    }));
    res.json(enriched);
});

// Get single hackathon
router.get('/:id', (req: Request, res: Response): void => {
    const hackathon = hackathons.find(h => h.id === req.params.id);
    if (!hackathon) {
        res.status(404).json({ error: 'Hackathon not found' });
        return;
    }
    const leaderboardWithNames = hackathon.leaderboard.map(entry => {
        const user = users.find(u => u.id === entry.userId);
        return { ...entry, username: user?.username || 'Unknown', avatar: user?.avatar || '👤' };
    });
    res.json({ ...hackathon, leaderboard: leaderboardWithNames });
});

// Register for hackathon
router.post('/:id/register', authenticate, (req: AuthRequest, res: Response): void => {
    const hackathon = hackathons.find(h => h.id === req.params.id);
    if (!hackathon) {
        res.status(404).json({ error: 'Hackathon not found' });
        return;
    }
    if (hackathon.participants.includes(req.user!.id)) {
        res.status(400).json({ error: 'Already registered' });
        return;
    }
    hackathon.participants.push(req.user!.id);
    res.json({ message: 'Registered successfully' });
});

// Get leaderboard
router.get('/:id/leaderboard', (req: Request, res: Response): void => {
    const hackathon = hackathons.find(h => h.id === req.params.id);
    if (!hackathon) {
        res.status(404).json({ error: 'Hackathon not found' });
        return;
    }
    const leaderboard = hackathon.leaderboard
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => {
            const user = users.find(u => u.id === entry.userId);
            return { rank: index + 1, ...entry, username: user?.username || 'Unknown', avatar: user?.avatar || '👤' };
        });
    res.json(leaderboard);
});

// Admin: Create hackathon
router.post('/', authenticate, authorize('admin', 'developer'), (req: AuthRequest, res: Response): void => {
    const newHackathon: any = {
        id: uuidv4(),
        ...req.body,
        participants: [],
        leaderboard: [],
        isActive: true,
        createdAt: new Date().toISOString(),
    };
    hackathons.push(newHackathon);
    res.status(201).json(newHackathon);
});

// Admin: Update hackathon
router.put('/:id', authenticate, authorize('admin', 'developer'), (req: AuthRequest, res: Response): void => {
    const index = hackathons.findIndex(h => h.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ error: 'Hackathon not found' });
        return;
    }
    hackathons[index] = { ...hackathons[index], ...req.body };
    res.json(hackathons[index]);
});

export default router;
