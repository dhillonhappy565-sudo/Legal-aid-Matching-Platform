import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { axiosClient } from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";

function SigninPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    if (!formData.password.trim())
      newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const redirectAfterLogin = (user) => {
    const from = location.state?.from?.pathname;

    if (from && from !== "/signin" && from !== "/signup") {
      navigate(from, { replace: true });
      return;
    }

    if (user.role === "Admin") {
      navigate("/dashboard/admin", { replace: true });
    } else if (user.role === "Citizen") {
      navigate("/dashboard/citizen", { replace: true });
    } else if (user.role === "Lawyer") {
      if (user.verified) {
        navigate("/dashboard/lawyer", { replace: true });
      } else {
        navigate("/pending-approval", { replace: true });
      }
    } else if (user.role === "NGO") {
      if (user.verified) {
        navigate("/dashboard/ngo", { replace: true });
      } else {
        navigate("/pending-approval", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      // Adjust endpoint as per your backend
      const res = await axiosClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { user, accessToken, refreshToken } = res.data;

      login({ user, accessToken, refreshToken });

      redirectAfterLogin(user);
    } catch (err) {
      console.error(err);
      let message = "Signin failed. Please check your details.";

      if (err.response?.data?.message) {
        message = err.response.data.message;
      }

      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT: Info / marketing (desktop) */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-10">
        <div className="max-w-md">
          <div className="rounded-3xl overflow-hidden shadow-xl mb-6">
            <img
              src="https://images.pexels.com/photos/5668773/pexels-photo-5668773.jpeg"
              alt="Signin Visual"
              className="w-full h-72 object-cover"
            />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
            Welcome back to your legal dashboard
          </h2>

          <p className="text-slate-600 leading-relaxed text-base mb-3">
            Citizens can track their legal help requests, while lawyers and NGOs
            manage the cases they are supporting.
          </p>

          <ul className="text-sm text-slate-600 space-y-1">
            <li>• View and update case details.</li>
            <li>• Communicate with assigned parties.</li>
            <li>• Maintain a transparent record of legal support.</li>
          </ul>
        </div>
      </div>

      {/* RIGHT: Signin card */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
          {/* Logo + title */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow">
              ⚖️
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mt-3">
              Sign in to your account
            </h1>
            <p className="text-sm text-slate-500 mt-1 text-center">
              Access your citizen, lawyer, NGO or admin dashboard.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-slate-100 rounded-full p-1 text-sm font-medium">
            <button
              disabled
              className="flex-1 text-center py-2 rounded-full bg-white shadow text-slate-900"
            >
              Login
            </button>
            <Link
              to="/signup"
              className="flex-1 text-center py-2 rounded-full text-slate-600 hover:text-slate-800"
            >
              Register
            </Link>
          </div>

          {/* Error */}
          {errors.general && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errors.general}
            </div>
          )}

          {/* Social logins (UI only for now) */}
          <div className="space-y-3 mb-5">
            <button
              type="button"
              className="w-full border border-slate-300 rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <span>🔵</span>
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              className="w-full border border-slate-300 rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <span>🐙</span>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-400 uppercase tracking-wide">
              or continue with email
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5 text-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5 text-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-3.5 h-3.5" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg 
              text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* No account yet */}
          <p className="text-xs text-center text-slate-500 mt-5">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;
