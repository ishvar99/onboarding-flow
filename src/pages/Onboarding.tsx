import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useSnackbar } from '../components/Snackbar';
import { PersonalProfile } from '../components/onboarding/PersonalProfile';
import { FavoriteSongs } from '../components/onboarding/FavoriteSongs';
import { PaymentInfo } from '../components/onboarding/PaymentInfo';
import { Success } from '../components/onboarding/Success';

const steps = [
    { label: 'Profile', description: 'Your details' },
    { label: 'Music', description: 'Your taste' },
    { label: 'Payment', description: 'Billing info' },
    { label: 'Done', description: 'All set' },
];

const stepComponents: Record<number, React.ReactNode> = {
    1: <PersonalProfile />,
    2: <FavoriteSongs />,
    3: <PaymentInfo />,
    4: <Success />,
};

export const Onboarding = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const currentStep = useAppSelector((state) => state.onboarding.currentStep);

    const handleLogout = () => {
        dispatch(logout());
        snackbar.show('Logged out successfully', 'neutral');
        navigate('/login');
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:py-12">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">Onboarding</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary px-3 py-1.5 text-xs cursor-pointer"
                    >
                        Log out
                    </button>
                </div>

                <div className="mb-8">
                    <div className="mb-6">
                        <span className="text-sm font-medium text-slate-500">
                            Step {currentStep} of {steps.length}
                        </span>
                    </div>

                    <div className="relative flex justify-between mb-3">
                        <div className="absolute top-5 left-0 right-0 h-px bg-slate-200/80" style={{ marginLeft: '20px', marginRight: '20px' }} />
                        
                        {steps.map((step, index) => {
                            const stepNum = index + 1;
                            const isCompleted = currentStep > stepNum;
                            const isCurrent = currentStep === stepNum;
                            const isPending = currentStep < stepNum;

                            return (
                                <div key={step.label} className="flex flex-col items-center relative z-10 bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/30">
                                    <div className="relative">
                                        {isCurrent && (
                                            <span className="absolute inset-0 rounded-full bg-indigo-400 animate-soft-ping" />
                                        )}
                                        <div
                                            className={`
                          relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                          transition-all duration-300 ease-out
                          ${isCompleted
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-100'
                                                    : isCurrent
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                        : 'bg-slate-100 text-slate-400'
                                                }
                        `}
                                        >
                                            {isCompleted ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                stepNum
                                            )}
                                        </div>
                                    </div>
                                    <span className={`
                    mt-2 text-xs font-medium transition-colors duration-200
                    ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-600' : 'text-slate-400'}
                  `}>
                                        {step.label}
                                    </span>
                                    <span className={`
                    text-[10px] transition-colors duration-200
                    ${isPending ? 'text-slate-300' : 'text-slate-400'}
                  `}>
                                        {step.description}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
                        <div
                            className="h-full progress-bar-shimmer rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="card p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {stepComponents[currentStep]}
                </div>
            </div>
        </div>
    );
};
