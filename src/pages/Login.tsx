import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';
import { useSnackbar } from '../components/Snackbar';
import { validateUser, TEST_CREDENTIALS } from '../utils/userStorage';

const loginSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

export const Login = () => {
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const isCompleted = useAppSelector((state) => state.onboarding.isCompleted);

    if (isAuthenticated) {
        return <Navigate to={isCompleted ? '/home' : '/onboarding'} replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-500">Sign in to your account</p>
                </div>

                <div className="mb-6 p-4 rounded-xl bg-teal-50/70 border border-teal-200">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-teal-700">Demo Credentials</span>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p className="text-teal-700">
                            <span className="font-medium">Username:</span>{' '}
                            <code className="px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded font-mono text-xs">{TEST_CREDENTIALS.username}</code>
                        </p>
                        <p className="text-teal-700">
                            <span className="font-medium">Password:</span>{' '}
                            <code className="px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded font-mono text-xs">{TEST_CREDENTIALS.password}</code>
                        </p>
                    </div>
                </div>

                <div className="card p-6">
                    {error && (
                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={(values) => {
                            if (validateUser(values.username, values.password)) {
                                dispatch(login(values.username));
                                snackbar.show('Signed in successfully', 'success');
                                navigate('/onboarding');
                            } else {
                                setError('Invalid username or password');
                                snackbar.show('Invalid credentials', 'error');
                            }
                        }}
                    >
                        {({ errors, touched, isValid, dirty }) => (
                            <Form className="space-y-5">
                                <div>
                                    <label htmlFor="username" className="label">
                                        Username
                                    </label>
                                    <Field
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        className={`input ${touched.username && errors.username ? 'input-error' : ''}`}
                                        placeholder="Enter your username"
                                    />
                                    {touched.username && errors.username && (
                                        <p className="error-text">{errors.username}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        className={`input ${touched.password && errors.password ? 'input-error' : ''}`}
                                        placeholder="Enter your password"
                                    />
                                    {touched.password && errors.password && (
                                        <p className="error-text">{errors.password}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isValid || !dirty}
                                    className="btn btn-primary w-full py-2.5 text-sm"
                                >
                                    Sign in
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};
