# React Onboarding Flow Application

A frontend-only React + TypeScript application with login, multi-step onboarding, Redux state management, and localStorage persistence.

## Tech Stack

- **React 18** with Hooks
- **TypeScript** (strict typing)
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Formik + Yup** for form handling/validation
- **MUI v5** for UI components

## Getting Started

```bash
npm install
npm run dev
```

### Login Credentials

```
Username: user123
Password: password123
```

## Features

### Authentication
- Login with hardcoded credentials
- Persisted login state across browser sessions
- Protected routes

### Multi-Step Onboarding
1. **Personal Profile** - Name, age, email, profile picture upload
2. **Favorite Songs** - Dynamic add/remove song list
3. **Payment Info** - Card number, expiry, CVV
4. **Success** - Completion confirmation

### State Persistence

The app uses manual localStorage persistence (no redux-persist):

```typescript
// On store creation - rehydrate from localStorage
const preloadedState = loadState();

// On state change - save to localStorage
store.subscribe(() => saveState(store.getState()));
```

**Persistence Behavior:**
- Close browser mid-onboarding → Resume from last step
- Complete onboarding → Redirect directly to Home
- Login persists across sessions

## Project Structure

```
src/
├─ app/
│   ├─ store.ts          # Redux store with persistence
│   └─ hooks.ts          # Typed dispatch/selector hooks
├─ features/
│   ├─ auth/
│   │   └─ authSlice.ts  # Login/logout state
│   └─ onboarding/
│       └─ onboardingSlice.ts  # Step + form data
├─ pages/
│   ├─ Login.tsx
│   ├─ Onboarding.tsx
│   └─ Home.tsx
├─ components/
│   └─ onboarding/
│       ├─ PersonalProfile.tsx
│       ├─ FavoriteSongs.tsx
│       ├─ PaymentInfo.tsx
│       └─ Success.tsx
├─ routes/
│   ├─ OnboardingGuard.tsx
│   └─ HomeGuard.tsx
├─ utils/
│   └─ localStorage.ts   # Load/save state helpers
└─ App.tsx
```

## Build

```bash
npm run build
```
