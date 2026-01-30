import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { completeOnboarding } from '../../features/onboarding/onboardingSlice';
import { useSnackbar } from '../Snackbar';

export const Success = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (hasRedirected.current) return;
        hasRedirected.current = true;

        dispatch(completeOnboarding());
        snackbar.show('Onboarding completed successfully!', 'success');

        const timer = setTimeout(() => {
            navigate('/home');
        }, 3000);

        return () => clearTimeout(timer);
    }, [dispatch, navigate, snackbar]);

    return (
        <div className="py-6 text-center">
            <div className="flex flex-col items-center space-y-5">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-in zoom-in duration-300">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: '2s' }} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-slate-900">You're all set!</h2>
                    <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
                        Your profile is complete. Redirecting to dashboard...
                    </p>
                </div>

                <div className="flex items-center gap-1.5 pt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Redirecting in 3 seconds...
                </div>

                <button
                    onClick={() => navigate('/home')}
                    className="btn btn-primary px-8 py-2.5 text-sm mt-2"
                >
                    Go to Dashboard Now
                </button>
            </div>
        </div>
    );
};
