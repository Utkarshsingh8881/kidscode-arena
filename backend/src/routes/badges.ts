import { Router, Response } from 'express';
import { badges } from '../config/database';

const router = Router();

// Get all badges
router.get('/', (_req: any, res: Response): void => {
    res.json(badges);
});

export default router;
