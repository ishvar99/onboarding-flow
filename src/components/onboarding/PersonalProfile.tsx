import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    setPersonalProfile,
    nextStep,
} from '../../features/onboarding/onboardingSlice';

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
            'Please enter a valid email with domain (e.g., user@example.com)'
        )
        .required('Email is required'),
});

export const PersonalProfile = () => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { personalProfile } = useAppSelector((state) => state.onboarding);

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: string) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFieldValue('profilePicture', reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Personal Profile</h2>
                <p className="mt-1 text-sm text-slate-500">Let's start with your basic information</p>
            </div>

            <Formik
                initialValues={{
                    fullName: personalProfile.fullName,
                    age: personalProfile.age,
                    email: personalProfile.email,
                    profilePicture: personalProfile.profilePicture,
                }}
                validationSchema={profileSchema}
                onSubmit={(values) => {
                    dispatch(setPersonalProfile(values));
                    dispatch(nextStep());
                }}
            >
                {({ errors, touched, values, setFieldValue, isValid }) => (
                    <Form className="space-y-5">
                        <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                                    {values.profilePicture ? (
                                        <img
                                            src={values.profilePicture}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg className="w-7 h-7 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform duration-200 group-hover:scale-110">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                hidden
                                onChange={(e) => handleFileChange(e, setFieldValue)}
                            />
                            <div>
                                <p className="text-sm font-medium text-slate-700">Profile photo</p>
                                <p className="text-xs text-slate-400 mt-0.5">Click to upload</p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="fullName" className="label">Full Name</label>
                            <Field
                                id="fullName"
                                name="fullName"
                                type="text"
                                className={`input ${touched.fullName && errors.fullName ? 'input-error' : ''}`}
                                placeholder="John Doe"
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
                                    placeholder="25"
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
                                    placeholder="you@example.com"
                                />
                                {touched.email && errors.email && (
                                    <p className="error-text">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-full py-2.5 text-sm"
                            >
                                Continue
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
