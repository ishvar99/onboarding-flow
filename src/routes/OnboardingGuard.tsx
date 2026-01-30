import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export const OnboardingGuard = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const isCompleted = useAppSelector((state) => state.onboarding.isCompleted);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isCompleted) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};
