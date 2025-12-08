import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Pages
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/auth/SigninPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardCitizen from "./pages/dashboards/DashboardCitizen";
import DashboardLawyer from "./pages/dashboards/DashboardLawyer";
import DashboardNGO from "./pages/dashboards/DashboardNGO";
import DashboardAdmin from "./pages/dashboards/DashboardAdmin";
import ProfilePage from "./pages/ProfilePage";
import PendingApprovalPage from "./pages/auth/PendingApprovalPage";

import PrivateRoute from "./routes/PrivateRoute";
import { useAuthStore } from "./store/authStore";

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Simple header */}
        <header className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg">
                ⚖️
              </div>
              <span className="font-semibold text-slate-900 text-sm md:text-base">
                Legal Aid Matching Platform
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected dashboards */}
            

            <Route
              path="/dashboard/citizen"
              element={
                <PrivateRoute allowedRoles={["Citizen"]}>
                  <DashboardCitizen />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/lawyer"
              element={
                <PrivateRoute
                  allowedRoles={["Lawyer"]}
                  requireVerified={true}
                >
                  <DashboardLawyer />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/ngo"
              element={
                <PrivateRoute
                  allowedRoles={["NGO"]}
                  requireVerified={true}
                >
                  <DashboardNGO />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/admin"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />

            {/* Protected profile */}
            <Route
              path="/profile"
              element={
                <PrivateRoute
                  allowedRoles={["Citizen", "Lawyer", "NGO", "Admin"]}
                >
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            {/* Pending approval for Lawyer / NGO */}
            <Route
              path="/pending-approval"
              element={
                <PrivateRoute allowedRoles={["Lawyer", "NGO"]}>
                  <PendingApprovalPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
