import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import problemRoutes from './routes/problems';
import hackathonRoutes from './routes/hackathons';
import mentorRoutes from './routes/mentors';
import analyticsRoutes from './routes/analytics';
import badgeRoutes from './routes/badges';
import { rateLimiter, sanitizeInput } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);
app.use(sanitizeInput);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/badges', badgeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.listen(PORT, () => {
    console.log(`🚀 KidsCode Arena API running on port ${PORT}`);
    console.log(`📚 ${require('./config/database').problems.length} problems loaded`);
    console.log(`👥 ${require('./config/database').users.length} users loaded`);
});

export default app;
