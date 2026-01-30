import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type SnackbarType = 'success' | 'error' | 'neutral';

interface SnackbarState {
    message: string;
    type: SnackbarType;
    isVisible: boolean;
}

interface SnackbarContextValue {
    show: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error('useSnackbar must be used within SnackbarProvider');
    return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<SnackbarState>({
        message: '',
        type: 'neutral',
        isVisible: false,
    });

    const show = useCallback((message: string, type: SnackbarType = 'neutral') => {
        setState({ message, type, isVisible: true });
        setTimeout(() => {
            setState((prev) => ({ ...prev, isVisible: false }));
        }, 3000);
    }, []);

    return (
        <SnackbarContext.Provider value={{ show }}>
            {children}

            <div
                className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          transition-all duration-300 ease-out
          ${state.isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }
        `}
            >
                <div
                    className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg
            text-sm font-medium
            ${state.type === 'success'
                            ? 'bg-emerald-600 text-white'
                            : state.type === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-800 text-white'
                        }
          `}
                >
                    {state.type === 'success' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {state.type === 'error' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {state.message}
                </div>
            </div>
        </SnackbarContext.Provider>
    );
};
