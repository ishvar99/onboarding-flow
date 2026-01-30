import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PersonalProfile {
    fullName: string;
    age: string;
    email: string;
    profilePicture: string;
}

interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export interface OnboardingState {
    currentStep: number;
    isCompleted: boolean;
    personalProfile: PersonalProfile;
    favoriteSongs: string[];
    paymentInfo: PaymentInfo;
}

const initialState: OnboardingState = {
    currentStep: 1,
    isCompleted: false,
    personalProfile: {
        fullName: '',
        age: '',
        email: '',
        profilePicture: '',
    },
    favoriteSongs: [''],
    paymentInfo: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    },
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setStep(state, action: PayloadAction<number>) {
            state.currentStep = action.payload;
        },
        nextStep(state) {
            if (state.currentStep < 4) {
                state.currentStep += 1;
            }
        },
        prevStep(state) {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
            }
        },
        setPersonalProfile(state, action: PayloadAction<PersonalProfile>) {
            state.personalProfile = action.payload;
        },
        setFavoriteSongs(state, action: PayloadAction<string[]>) {
            state.favoriteSongs = action.payload;
        },
        setPaymentInfo(state, action: PayloadAction<PaymentInfo>) {
            state.paymentInfo = action.payload;
        },
        completeOnboarding(state) {
            state.isCompleted = true;
        },
        resetOnboarding() {
            return initialState;
        },
    },
});

export const {
    setStep,
    nextStep,
    prevStep,
    setPersonalProfile,
    setFavoriteSongs,
    setPaymentInfo,
    completeOnboarding,
    resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
