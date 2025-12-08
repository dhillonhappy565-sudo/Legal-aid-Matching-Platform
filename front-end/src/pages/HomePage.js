import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* Top section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
              Connecting citizens with trusted legal support.
            </h1>
            <p className="text-sm md:text-base text-slate-600 mb-5">
              Citizens can request help for their legal issues, while lawyers
              and NGOs offer guidance and support. Admins keep the platform
              verified and safe.
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to="/signup"
                state={{ role: "Citizen" }}
                className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Join as Citizen
              </Link>
              <Link
                to="/signup"
                state={{ role: "Lawyer" }}
                className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Join as Lawyer / NGO
              </Link>
            </div>
          </div>

          {/* Right side info card */}
          <div className="bg-white rounded-3xl border shadow-sm p-5 md:p-6">
            <p className="text-xs font-semibold text-blue-600 mb-1">
              How it works
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold">Citizens</span> submit their
                legal problems and track progress from a single dashboard.
              </li>
              <li>
                <span className="font-semibold">Lawyers & NGOs</span> review
                requests, accept cases, and update citizens on next steps.
              </li>
              <li>
                <span className="font-semibold">Admin</span> verifies
                professionals so that citizens receive support from trusted
                helpers only.
              </li>
            </ul>
          </div>
        </section>

        {/* Role cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border p-4 flex flex-col gap-2">
            <p className="text-xs font-semibold text-blue-600">For citizens</p>
            <p className="text-sm font-semibold text-slate-900">
              Ask for legal help
            </p>
            <p className="text-xs text-slate-600">
              Create requests, see who is assigned to your case, and follow
              updates in your citizen dashboard.
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-4 flex flex-col gap-2">
            <p className="text-xs font-semibold text-blue-600">
              For lawyers & NGOs
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Support the community
            </p>
            <p className="text-xs text-slate-600">
              Review incoming requests, take up cases, and record the support
              you are providing.
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-4 flex flex-col gap-2">
            <p className="text-xs font-semibold text-blue-600">For admin</p>
            <p className="text-sm font-semibold text-slate-900">
              Verify and manage
            </p>
            <p className="text-xs text-slate-600">
              Approve lawyers and NGOs, monitor usage, and keep the platform
              safe for everyone.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
