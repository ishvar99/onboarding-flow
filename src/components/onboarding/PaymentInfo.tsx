import type { ChangeEvent } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    setPaymentInfo,
    nextStep,
    prevStep,
} from '../../features/onboarding/onboardingSlice';

const validateExpiryDate = (value: string | undefined): boolean => {
    if (!value) return false;
    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!match) return false;

    const [, monthStr, yearStr] = match;
    const month = parseInt(monthStr, 10);
    const year = 2000 + parseInt(yearStr, 10);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
};

const paymentSchema = Yup.object({
    cardNumber: Yup.string()
        .matches(/^\d{16}$/, 'Card number must be 16 digits')
        .required('Card number is required'),
    expiryDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY')
        .test('future-date', 'Card has expired', validateExpiryDate)
        .required('Expiry date is required'),
    cvv: Yup.string()
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
        .required('CVV is required'),
});

const handleCardNumberInput = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setFieldValue('cardNumber', value);
};

const handleExpiryInput = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
) => {
    let value = e.target.value.replace(/[^\d/]/g, '');

    if (value.length === 2 && !value.includes('/')) {
        value = value + '/';
    }

    value = value.slice(0, 5);
    setFieldValue('expiryDate', value);
};

const handleCvvInput = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFieldValue('cvv', value);
};

export const PaymentInfo = () => {
    const dispatch = useAppDispatch();
    const { paymentInfo } = useAppSelector((state) => state.onboarding);

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
                <p className="mt-1 text-sm text-slate-500">Secure billing information for your account</p>
            </div>

            <div className="flex items-center gap-2 p-3 mb-6 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div>
                    <p className="text-xs font-medium text-emerald-700">Secure & encrypted</p>
                    <p className="text-[10px] text-emerald-600/70">Your data is protected</p>
                </div>
            </div>

            <Formik
                initialValues={{
                    cardNumber: paymentInfo.cardNumber,
                    expiryDate: paymentInfo.expiryDate,
                    cvv: paymentInfo.cvv,
                }}
                validationSchema={paymentSchema}
                onSubmit={(values) => {
                    dispatch(setPaymentInfo(values));
                    dispatch(nextStep());
                }}
            >
                {({ errors, touched, isValid, setFieldValue, values }) => (
                    <Form className="space-y-4">
                        <div>
                            <label htmlFor="cardNumber" className="label">Card Number</label>
                            <div className="relative">
                                <Field
                                    id="cardNumber"
                                    name="cardNumber"
                                    placeholder="1234567890123456"
                                    value={values.cardNumber}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleCardNumberInput(e, setFieldValue)}
                                    inputMode="numeric"
                                    autoComplete="cc-number"
                                    className={`input !pl-11 ${touched.cardNumber && errors.cardNumber ? 'input-error' : ''}`}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                            </div>
                            {touched.cardNumber && errors.cardNumber && (
                                <p className="error-text">{errors.cardNumber}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiryDate" className="label">Expiry Date</label>
                                <Field
                                    id="expiryDate"
                                    name="expiryDate"
                                    placeholder="MM/YY"
                                    value={values.expiryDate}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleExpiryInput(e, setFieldValue)}
                                    inputMode="numeric"
                                    autoComplete="cc-exp"
                                    className={`input ${touched.expiryDate && errors.expiryDate ? 'input-error' : ''}`}
                                />
                                {touched.expiryDate && errors.expiryDate && (
                                    <p className="error-text">{errors.expiryDate}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="cvv" className="label">CVV</label>
                                <Field
                                    id="cvv"
                                    name="cvv"
                                    type="password"
                                    placeholder="•••"
                                    value={values.cvv}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleCvvInput(e, setFieldValue)}
                                    inputMode="numeric"
                                    autoComplete="cc-csc"
                                    className={`input ${touched.cvv && errors.cvv ? 'input-error' : ''}`}
                                />
                                {touched.cvv && errors.cvv && (
                                    <p className="error-text">{errors.cvv}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => dispatch(prevStep())}
                                className="btn btn-secondary flex-1 py-2.5 text-sm"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary flex-1 py-2.5 text-sm"
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
