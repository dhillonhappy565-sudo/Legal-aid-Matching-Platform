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
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Header */}
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

        {/* Main */}
        <main className="flex-1">
          {!isHydrated ? (
            <div className="min-h-[calc(100vh-96px)] flex items-center justify-center">
              <p className="text-sm text-slate-600">Loading session...</p>
            </div>
          ) : (
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Dashboards */}
              <Route
                path="/dashboard/citizen"
                element={
                  <PrivateRoute allowedRoles={["CITIZEN"]}>
                    <DashboardCitizen />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard/lawyer"
                element={
                  <PrivateRoute
                    allowedRoles={["LAWYER"]}
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
                  <PrivateRoute allowedRoles={["ADMIN"]}>
                    <DashboardAdmin />
                  </PrivateRoute>
                }
              />

              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute
                    allowedRoles={["CITIZEN", "LAWYER", "NGO", "ADMIN"]}
                  >
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

              {/* Pending approval */}
              <Route
                path="/pending-approval"
                element={
                  <PrivateRoute allowedRoles={["LAWYER", "NGO"]}>
                    <PendingApprovalPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
