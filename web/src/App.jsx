import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import SmoothScroll from "./components/SmoothScroll";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/public/Home";
import HowItWorks from "./pages/public/HowItWorks";
import Features from "./pages/public/Features";
import SampleReport from "./pages/public/SampleReport";
import SignIn from "./pages/public/SignIn";
import SignUp from "./pages/public/SignUp";
import ForgotPassword from "./pages/public/ForgotPassword";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import HelpCenter from "./pages/public/HelpCenter";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsOfService from "./pages/public/TermsOfService";
import Security from "./pages/public/Security";
import EstimatePage from "./pages/protected/EstimatePage";
import ResultsPage from "./pages/protected/ResultsPage";
import ProfileDashboard from "./pages/protected/ProfileDashboard";
import AdminDashboard from "./pages/protected/AdminDashboard";

export default function App() {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              {/* Public pages */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/features" element={<Features />} />
                <Route path="/sample-report" element={<SampleReport />} />

                {/* Auth pages */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected pages */}
                <Route
                  path="/estimate"
                  element={
                    <ProtectedRoute>
                      <EstimatePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <ProfileDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/security" element={<Security />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </SmoothScroll>
    </ThemeProvider>
  );
}
