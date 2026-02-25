import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'kidscode-arena-super-secret-key-2024';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        email: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }
        next();
    };
};

export const rateLimiter = (() => {
    const requests = new Map<string, { count: number; resetTime: number }>();
    const WINDOW_MS = 60 * 1000; // 1 minute
    const MAX_REQUESTS = 100;

    return (req: Request, res: Response, next: NextFunction): void => {
        const ip = req.ip || 'unknown';
        const now = Date.now();
        const record = requests.get(ip);

        if (!record || now > record.resetTime) {
            requests.set(ip, { count: 1, resetTime: now + WINDOW_MS });
            next();
            return;
        }

        if (record.count >= MAX_REQUESTS) {
            res.status(429).json({ error: 'Too many requests. Please try again later.' });
            return;
        }

        record.count++;
        next();
    };
})();

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
    const sanitize = (obj: any): any => {
        if (typeof obj === 'string') {
            return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>]/g, (c) => c === '<' ? '&lt;' : '&gt;');
        }
        if (Array.isArray(obj)) return obj.map(sanitize);
        if (obj && typeof obj === 'object') {
            const result: any = {};
            for (const key of Object.keys(obj)) {
                result[key] = sanitize(obj[key]);
            }
            return result;
        }
        return obj;
    };
    if (req.body) req.body = sanitize(req.body);
    next();
};
