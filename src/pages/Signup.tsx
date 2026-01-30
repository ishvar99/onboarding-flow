import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';
import { useSnackbar } from '../components/Snackbar';
import { saveUser, userExists } from '../utils/userStorage';

const signupSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
        .required('Username is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

export const Signup = () => {
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
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Create an account</h1>
                    <p className="mt-2 text-sm text-slate-500">Get started with your onboarding</p>
                </div>

                {/* Card */}
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
                        initialValues={{ username: '', password: '', confirmPassword: '' }}
                        validationSchema={signupSchema}
                        onSubmit={(values) => {
                            if (userExists(values.username)) {
                                setError('Username already taken');
                                snackbar.show('Username already exists', 'error');
                                return;
                            }

                            saveUser({ username: values.username, password: values.password });
                            dispatch(login(values.username));
                            snackbar.show('Account created successfully', 'success');
                            navigate('/onboarding');
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
                                        placeholder="Choose a username"
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
                                        autoComplete="new-password"
                                        className={`input ${touched.password && errors.password ? 'input-error' : ''}`}
                                        placeholder="Create a password"
                                    />
                                    {touched.password && errors.password && (
                                        <p className="error-text">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="label">
                                        Confirm Password
                                    </label>
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        className={`input ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
                                        placeholder="Confirm your password"
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <p className="error-text">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isValid || !dirty}
                                    className="btn btn-primary w-full py-2.5 text-sm"
                                >
                                    Create account
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Login link */}
                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
