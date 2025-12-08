import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

function PendingApprovalPage() {
  const { user } = useAuthStore();

  const roleLabel =
    user?.role === "Lawyer"
      ? "Lawyer"
      : user?.role === "NGO"
      ? "NGO"
      : user?.role || "User";

  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border shadow-sm p-6 md:p-7 text-center">
        <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center text-2xl mx-auto mb-3">
          ⏳
        </div>
        <h1 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
          Account under review
        </h1>
        <p className="text-sm text-slate-600 mb-3">
          Your {roleLabel} account is currently waiting for admin verification.
          Once approved, you will be able to access your full dashboard and
          start using the platform.
        </p>
        <p className="text-xs text-slate-500 mb-5">
          You can safely close this tab. When approval is completed, you can
          log in again and you&apos;ll be redirected to your dashboard.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
        >
          Go to home page
        </Link>
      </div>
    </div>
  );
}

export default PendingApprovalPage;
