import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { SnackbarProvider } from './components/Snackbar';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { OnboardingGuard } from './routes/OnboardingGuard';
import { HomeGuard } from './routes/HomeGuard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<OnboardingGuard />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<HomeGuard />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/30">
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </div>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
