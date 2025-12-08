import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ROLES = ["Citizen", "Lawyer", "NGO"];

function SignupPage() {
  const location = useLocation();
  const preSelectedRole = location.state?.role || "Citizen";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: preSelectedRole,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((p) => ({ ...p, role }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    if (!formData.password.trim())
      newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      alert(
        formData.role === "Citizen"
          ? "Citizen account created. Redirecting to dashboard."
          : "Signup submitted! Your account requires admin approval."
      );
    }, 700);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT SIDE IMAGE & TEXT (Desktop only) */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-10">
        <div className="max-w-md">
          <div className="rounded-3xl overflow-hidden shadow-xl mb-6">
            <img
              src="https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg"
              className="w-full h-72 object-cover"
              alt="Signup Visual"
            />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
            Join our legal support community
          </h2>

          <p className="text-slate-600 leading-relaxed text-base">
            Citizens get timely help from trusted legal professionals.
            Lawyers and NGOs provide guidance and support to those who need it
            the most.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow">
              ⚖️
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mt-3">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Choose your role and start your legal journey.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-slate-100 rounded-full p-1 text-sm font-medium">
            <Link
              to="/signin"
              className="flex-1 text-center py-2 rounded-full text-slate-600 hover:text-slate-800"
            >
              Login
            </Link>
            <button
              disabled
              className="flex-1 text-center py-2 rounded-full bg-white shadow text-slate-900"
            >
              Register
            </button>
          </div>

          {/* ROLE SELECTION */}
          <div className="mb-5">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Sign up as
            </label>

            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((role) => {
                const active = formData.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`py-2 text-sm font-medium rounded-xl border transition  
                      ${
                        active
                          ? "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
                      }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            {formData.role !== "Citizen" && (
              <p className="text-xs text-yellow-600 mt-2">
                * {formData.role} accounts require admin approval.
              </p>
            )}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5 text-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="john_doe"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

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
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5 text-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg 
              text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Already have account */}
          <p className="text-xs text-center text-slate-500 mt-5">
            Already have an account?{" "}
            <Link className="text-blue-600 hover:underline" to="/signin">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
