import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import TripLayout from '@/layouts/TripLayout';
import MainLayout from '@/layouts/MainLayout';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Public landing
import LandingPage from '@/pages/LandingPage';

// App pages
import AllTripsPage from '@/pages/app/AllTripsPage';
import AddTripPage from '@/pages/app/AddTripPage';
import StatisticsPage from '@/pages/app/StatisticsPage';
import ProfilePage from '@/pages/app/ProfilePage';

// Trip 
import OverviewPage from '@/pages/trip/OverviewPage';
import TodoPage from '@/pages/trip/TodoPage';
import PlacesPage from '@/pages/trip/PlacesPage';
import BookingPage from '@/pages/trip/BookingPage';
import NotesPage from '@/pages/trip/NotesPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route element={<AppLayout />}>
                    <Route path="/trips" element={<AllTripsPage />} />
                    <Route path="/trips/new" element={<AddTripPage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/trips/:tripId" element={<TripLayout />}>
                        <Route index element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={<OverviewPage />} />
                        <Route path="todo" element={<TodoPage />} />
                        <Route path="places" element={<PlacesPage />} />
                        <Route path="booking" element={<BookingPage />} />
                        <Route path="notes" element={<NotesPage />} />
                    </Route>
                </Route>
            </Route>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
