import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { setPersonalProfile, setFavoriteSongs } from '../features/onboarding/onboardingSlice';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/Snackbar';
import { Formik, Form, Field, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';

const MAX_SONGS = 5;

const profileSchema = Yup.object({
    fullName: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Full name is required'),
    age: Yup.number()
        .typeError('Age must be a number')
        .min(13, 'Must be at least 13 years old')
        .max(120, 'Invalid age')
        .required('Age is required'),
    email: Yup.string()
        .matches(
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            'Please enter a valid email with domain'
        )
        .required('Email is required'),
    songs: Yup.array()
        .of(Yup.string().required('Song name is required'))
        .min(1, 'Add at least one song')
        .max(MAX_SONGS, `Maximum ${MAX_SONGS} songs allowed`),
});

export const Home = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const [isEditing, setIsEditing] = useState(false);
    const username = useAppSelector((state) => state.auth.username);
    const { personalProfile, favoriteSongs } = useAppSelector(
        (state) => state.onboarding
    );

    const handleLogout = () => {
        dispatch(logout());
        snackbar.show('Logged out successfully', 'neutral');
        navigate('/login');
    };

    const filteredSongs = favoriteSongs.filter((song: string) => song.trim());

    return (
        <div className="min-h-screen py-8 px-4 sm:py-12">
            <div className="max-w-2xl mx-auto">
                <div className="card p-6 sm:p-8 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center overflow-hidden ring-4 ring-indigo-100 shadow-lg shadow-indigo-500/20">
                                {personalProfile.profilePicture ? (
                                    <img
                                        src={personalProfile.profilePicture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xl sm:text-2xl font-semibold text-white">
                                        {personalProfile.fullName?.charAt(0) || username?.charAt(0) || 'U'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                                    Welcome back, {personalProfile.fullName?.split(' ')[0] || username}!
                                </h1>
                                <p className="text-sm text-slate-500 mt-0.5">Great to see you again</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary px-4 py-2 text-sm cursor-pointer"
                        >
                            Log out
                        </button>
                    </div>
                </div>

                <div className="card p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-900">Your Profile</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {isEditing ? (
                        <Formik
                            initialValues={{
                                fullName: personalProfile.fullName,
                                age: personalProfile.age,
                                email: personalProfile.email,
                                profilePicture: personalProfile.profilePicture,
                                songs: favoriteSongs.length ? favoriteSongs : [''],
                            }}
                            validationSchema={profileSchema}
                            onSubmit={(values) => {
                                dispatch(setPersonalProfile({
                                    fullName: values.fullName,
                                    age: values.age,
                                    email: values.email,
                                    profilePicture: values.profilePicture,
                                }));
                                dispatch(setFavoriteSongs(values.songs));
                                snackbar.show('Profile updated', 'success');
                                setIsEditing(false);
                            }}
                        >
                            {({ values, errors, touched, isValid }) => {
                                const canAddMore = values.songs.length < MAX_SONGS;

                                return (
                                    <Form className="space-y-4">
                                        <div>
                                            <label htmlFor="fullName" className="label">Full Name</label>
                                            <Field
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                className={`input ${touched.fullName && errors.fullName ? 'input-error' : ''}`}
                                            />
                                            {touched.fullName && errors.fullName && (
                                                <p className="error-text">{errors.fullName}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="age" className="label">Age</label>
                                                <Field
                                                    id="age"
                                                    name="age"
                                                    type="number"
                                                    className={`input ${touched.age && errors.age ? 'input-error' : ''}`}
                                                />
                                                {touched.age && errors.age && (
                                                    <p className="error-text">{errors.age}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="label">Email</label>
                                                <Field
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    className={`input ${touched.email && errors.email ? 'input-error' : ''}`}
                                                />
                                                {touched.email && errors.email && (
                                                    <p className="error-text">{errors.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <label className="label mb-3">Favorite Songs</label>
                                            <FieldArray name="songs">
                                                {({ push, remove }) => (
                                                    <div className="space-y-3">
                                                        {values.songs.map((_: string, index: number) => {
                                                            const fieldName = `songs.${index}`;
                                                            const fieldTouched = getIn(touched, fieldName);
                                                            const fieldError = getIn(errors, fieldName);
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="group flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
                                                                >
                                                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 flex-shrink-0 mt-0.5">
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <Field
                                                                            name={fieldName}
                                                                            placeholder={`Song ${index + 1}`}
                                                                            className={`input ${fieldTouched && fieldError ? 'input-error' : ''}`}
                                                                        />
                                                                        {fieldTouched && fieldError && (
                                                                            <p className="error-text">{fieldError}</p>
                                                                        )}
                                                                    </div>
                                                                    {values.songs.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => remove(index)}
                                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                                                                            aria-label="Remove song"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}

                                                        {canAddMore ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => push('')}
                                                                className="flex items-center gap-2 w-full p-3 text-sm font-medium text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border border-dashed border-indigo-200 rounded-xl transition-all duration-200 hover:border-indigo-300 cursor-pointer"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                                Add another song ({values.songs.length}/{MAX_SONGS})
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center gap-2 p-3 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl">
                                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Maximum {MAX_SONGS} songs reached
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </FieldArray>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={!isValid}
                                                className="btn btn-primary w-full py-2.5 text-sm"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                                    <p className="text-sm font-medium text-slate-900">{personalProfile.fullName}</p>
                                </div>
                                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-sm font-medium text-slate-900">{personalProfile.email}</p>
                                </div>
                                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Age</p>
                                    <p className="text-sm font-medium text-slate-900">{personalProfile.age} years old</p>
                                </div>
                            </div>

                            {filteredSongs.length > 0 && (
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Favorite Songs</p>
                                    <div className="flex flex-wrap gap-2">
                                        {filteredSongs.map((song: string, index: number) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                </svg>
                                                {song}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
