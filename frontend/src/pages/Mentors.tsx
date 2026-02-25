import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Calendar, Clock, Star, Video, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Mentors() {
    const { user, theme } = useAuthStore();
    const [mentors, setMentors] = useState<any[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<any>(null);
    const [slots, setSlots] = useState<any[]>([]);
    const [myBookings, setMyBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const isDark = theme === 'dark';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mentorsRes, bookingsRes] = await Promise.all([
                    api.get('/mentors/mentors'),
                    api.get('/mentors/my-bookings'),
                ]);
                setMentors(mentorsRes.data);
                setMyBookings(bookingsRes.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSelectMentor = async (mentor: any) => {
        setSlotsLoading(true);
        setSelectedMentor(mentor);
        try {
            const { data } = await api.get(`/mentors/slots/${mentor.id}`);
            setSlots(data);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleBook = async (slotId: string) => {
        try {
            const { data } = await api.post(`/mentors/book/${slotId}`);
            toast.success('🎉 Session booked! Check your email for the meeting link.');
            setSlots(prev => prev.filter(s => s.id !== slotId));
            setMyBookings(prev => [...prev, data.slot]);
        } catch (e: any) {
            toast.error(e.response?.data?.error || 'Booking failed');
        }
    };

    const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
    const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`font-display text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>👨‍💻 1:1 Mentoring</h1>
                <p className={`text-sm mt-1 ${textMuted}`}>Book a session with expert coding mentors and supercharge your learning!</p>
            </div>

            {/* How it works */}
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'} border rounded-2xl p-6`}>
                <div className="grid sm:grid-cols-4 gap-4 text-center">
                    {[
                        { icon: '🔍', step: '1', text: 'Choose a mentor' },
                        { icon: '📅', step: '2', text: 'Pick a time slot' },
                        { icon: '💳', step: '3', text: 'Pay securely' },
                        { icon: '🎥', step: '4', text: 'Join via Google Meet' },
                    ].map(s => (
                        <div key={s.step}>
                            <div className="text-3xl mb-1">{s.icon}</div>
                            <div className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>Step {s.step}</div>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* My Bookings */}
            {myBookings.length > 0 && (
                <div>
                    <h2 className={`font-display text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>📋 My Sessions</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myBookings.map((booking) => (
                            <div key={booking.id} className={`${card} border rounded-2xl p-4`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{booking.mentorAvatar || '👨‍💻'}</span>
                                    <div>
                                        <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{booking.mentorName}</p>
                                        <p className={`text-xs ${textMuted}`}>{booking.date} at {booking.startTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${booking.status === 'booked' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                            'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {booking.status === 'booked' ? '✅ Confirmed' : booking.status}
                                    </span>
                                    <span className={`text-xs ${textMuted}`}>{booking.duration}h session</span>
                                </div>
                                {booking.meetingLink && (
                                    <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer"
                                        className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                                        <Video size={14} /> Join Meeting
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mentors Grid */}
            <div>
                <h2 className={`font-display text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>🌟 Our Expert Mentors</h2>
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentors.map((mentor, i) => (
                            <motion.div
                                key={mentor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`${card} border rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer ${selectedMentor?.id === mentor.id ? 'ring-2 ring-primary-500' : ''}`}
                                onClick={() => handleSelectMentor(mentor)}
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="text-4xl">{mentor.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mentor.username}</h3>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                                            ))}
                                            <span className={`text-xs ml-1 ${textMuted}`}>{mentor.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className={`text-xs leading-relaxed mb-4 ${textMuted}`}>{mentor.bio}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-xs ${textMuted}`}>Specializes in</p>
                                        <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{mentor.specialization}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-display font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>$25/hr</p>
                                        <p className={`text-xs ${textMuted}`}>{mentor.sessionsCompleted} sessions</p>
                                    </div>
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-bold py-2.5 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all">
                                    View Slots <ChevronRight size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Slots for selected mentor */}
            {selectedMentor && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className={`font-display text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        📅 Available Slots — {selectedMentor.username}
                    </h2>
                    {slotsLoading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}
                        </div>
                    ) : slots.length === 0 ? (
                        <div className={`${card} border rounded-2xl p-10 text-center`}>
                            <div className="text-5xl mb-4">📭</div>
                            <p className={`text-sm ${textMuted}`}>No available slots right now. Check back later!</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {slots.map((slot: any) => (
                                <div key={slot.id} className={`${card} border rounded-2xl p-4`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar size={16} className="text-primary-500" />
                                        <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{slot.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock size={14} className={textMuted} />
                                        <span className={`text-sm ${textMuted}`}>{slot.startTime} – {slot.endTime}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-slate-500'}`}>{slot.duration}h</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xl font-display font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>${slot.price}</span>
                                        <button
                                            onClick={() => handleBook(slot.id)}
                                            className="flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:shadow-md hover:scale-105 transition-all"
                                        >
                                            <CheckCircle2 size={14} />
                                            Book Session
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
