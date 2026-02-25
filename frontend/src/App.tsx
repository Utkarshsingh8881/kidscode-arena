import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemSolve from './pages/ProblemSolve';
import Hackathons from './pages/Hackathons';
import Mentors from './pages/Mentors';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import DevDashboard from './pages/DevDashboard';
import Profile from './pages/Profile';
import Layout from './components/Layout';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

export default function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
          <Route path="/problems/:id" element={<ProtectedRoute><ProblemSolve /></ProtectedRoute>} />
          <Route path="/hackathons" element={<ProtectedRoute><Hackathons /></ProtectedRoute>} />
          <Route path="/mentors" element={<ProtectedRoute><Mentors /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dev" element={<ProtectedRoute roles={['developer', 'admin']}><DevDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}
