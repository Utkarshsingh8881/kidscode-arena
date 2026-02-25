import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mentorSlots, users } from '../config/database';
import { authenticate, AuthRequest, authorize } from '../middleware/auth';

const router = Router();

// Get all mentors
router.get('/mentors', (_req: Request, res: Response): void => {
    const mentors = users
        .filter(u => u.role === 'mentor')
        .map(({ password, ...m }) => ({
            ...m,
            specialization: 'Python, JavaScript, Algorithms',
            rating: 4.8,
            sessionsCompleted: 47,
            bio: 'Experienced coding mentor with 10+ years in software engineering. Passionate about teaching kids to code!',
        }));
    res.json(mentors);
});

// Get available slots for a mentor
router.get('/slots/:mentorId', (req: Request, res: Response): void => {
    const slots = mentorSlots
        .filter(s => s.mentorId === req.params.mentorId && s.status === 'available')
        .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
    res.json(slots);
});

// Get all slots (admin)
router.get('/slots', authenticate, (req: AuthRequest, res: Response): void => {
    const enriched = mentorSlots.map(slot => {
        const mentor = users.find(u => u.id === slot.mentorId);
        const student = slot.studentId ? users.find(u => u.id === slot.studentId) : null;
        return {
            ...slot,
            mentorName: mentor?.username || 'Unknown',
            studentName: student?.username,
        };
    });
    res.json(enriched);
});

// Book a slot
router.post('/book/:slotId', authenticate, (req: AuthRequest, res: Response): void => {
    const slot = mentorSlots.find(s => s.id === req.params.slotId);
    if (!slot) {
        res.status(404).json({ error: 'Slot not found' });
        return;
    }
    if (slot.isBooked) {
        res.status(400).json({ error: 'Slot already booked' });
        return;
    }
    slot.isBooked = true;
    slot.studentId = req.user!.id;
    slot.status = 'booked';
    slot.meetingLink = `https://meet.google.com/${uuidv4().substring(0, 12)}`;
    res.json({ message: 'Booking confirmed!', slot });
});

// Cancel booking
router.post('/cancel/:slotId', authenticate, (req: AuthRequest, res: Response): void => {
    const slot = mentorSlots.find(s => s.id === req.params.slotId);
    if (!slot) {
        res.status(404).json({ error: 'Slot not found' });
        return;
    }
    if (slot.studentId !== req.user!.id && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Not authorized' });
        return;
    }
    slot.isBooked = false;
    slot.studentId = undefined;
    slot.status = 'available';
    slot.meetingLink = undefined;
    res.json({ message: 'Booking cancelled' });
});

// Get my bookings
router.get('/my-bookings', authenticate, (req: AuthRequest, res: Response): void => {
    const mySlots = mentorSlots
        .filter(s => s.studentId === req.user!.id)
        .map(slot => {
            const mentor = users.find(u => u.id === slot.mentorId);
            return { ...slot, mentorName: mentor?.username || 'Unknown', mentorAvatar: mentor?.avatar };
        });
    res.json(mySlots);
});

// Mentor: Add slot
router.post('/slots', authenticate, authorize('mentor', 'admin'), (req: AuthRequest, res: Response): void => {
    const { date, startTime, endTime, duration, price } = req.body;
    const newSlot: any = {
        id: uuidv4(),
        mentorId: req.user!.id,
        date,
        startTime,
        endTime,
        duration: duration || 1,
        isBooked: false,
        price: price || 25,
        status: 'available',
    };
    mentorSlots.push(newSlot);
    res.status(201).json(newSlot);
});

export default router;
