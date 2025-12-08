import { useState } from "react";

function DashboardAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("overview"); 

  const pendingUsers = [
    {
      id: 1,
      name: "Adv. Karan Mehta",
      role: "Lawyer",
      email: "karan.mehta@example.com",
      submitted: "2025-02-12",
    },
    {
      id: 2,
      name: "JusticeCare NGO",
      role: "NGO",
      email: "contact@justicecare.org",
      submitted: "2025-02-10",
    },
  ];

  const allUsers = [
    { id: 1, name: "Rohit Kumar", role: "Citizen" },
    { id: 2, name: "Adv. Karan Mehta", role: "Lawyer" },
    { id: 3, name: "JusticeCare NGO", role: "NGO" },
    { id: 4, name: "Admin User", role: "Admin" },
  ];

  const totalUsers = allUsers.length;
  const lawyerCount = allUsers.filter((u) => u.role === "Lawyer").length;
  const ngoCount = allUsers.filter((u) => u.role === "NGO").length;
  const pendingCount = pendingUsers.length;

  const navButtonClasses = (key) =>
    `w-full text-left px-2 py-1 rounded text-sm ${
      section === key ? "bg-slate-100 font-semibold" : "hover:bg-slate-100"
    }`;

  const handleDecision = (id, action) => {
    alert(
      `In a real app, this would ${action} user with id ${id} by calling an admin API.`
    );
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-50 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 bg-white border-r">
        <div className="w-full p-4 flex flex-col gap-4">
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="text-sm font-semibold text-slate-800">
              Admin Dashboard
            </p>
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Menu
            </p>
            <button
              className={navButtonClasses("overview")}
              onClick={() => setSection("overview")}
            >
              Overview
            </button>
            <button
              className={navButtonClasses("verifications")}
              onClick={() => setSection("verifications")}
            >
              Verification queue
            </button>
            <button
              className={navButtonClasses("users")}
              onClick={() => setSection("users")}
            >
              Users
            </button>
            <button
              className={navButtonClasses("system")}
              onClick={() => setSection("system")}
            >
              System notes
            </button>
            <button
              className={navButtonClasses("profile")}
              onClick={() => setSection("profile")}
            >
              Profile
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar toggle + overlay */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed top-[56px] left-0 h-[calc(100vh-56px)] w-56 bg-white border-r z-30 transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900 mb-2">Admin Menu</p>
            <button
              className={navButtonClasses("overview")}
              onClick={() => {
                setSection("overview");
                setSidebarOpen(false);
              }}
            >
              Overview
            </button>
            <button
              className={navButtonClasses("verifications")}
              onClick={() => {
                setSection("verifications");
                setSidebarOpen(false);
              }}
            >
              Verification queue
            </button>
            <button
              className={navButtonClasses("users")}
              onClick={() => {
                setSection("users");
                setSidebarOpen(false);
              }}
            >
              Users
            </button>
            <button
              className={navButtonClasses("system")}
              onClick={() => {
                setSection("system");
                setSidebarOpen(false);
              }}
            >
              System notes
            </button>
            <button
              className={navButtonClasses("profile")}
              onClick={() => {
                setSection("profile");
                setSidebarOpen(false);
              }}
            >
              Profile
            </button>
          </div>
        </aside>
      </div>

      {/* Main content */}
      <main className="flex-1">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="text-sm font-semibold text-slate-800">
              Admin Dashboard
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-sm px-3 py-1 rounded-full border border-slate-300"
          >
            Menu
          </button>
        </div>

        {/* Page content */}
        <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
          {/* Heading */}
          <section className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">
              {section === "overview"
                ? "Overview"
                : section === "verifications"
                ? "Verification queue"
                : section === "users"
                ? "Users"
                : section === "system"
                ? "System notes"
                : "Profile"}
            </h1>
            <p className="text-sm text-slate-600">
              {section === "overview" &&
                "Quick summary of users and pending verification tasks for this platform."}
              {section === "verifications" &&
                "Approve or reject lawyers and NGOs before they can access the system."}
              {section === "users" &&
                "Simple view of users by role. Later this can be replaced by a proper admin users table."}
              {section === "system" &&
                "High-level notes about the system status, logs or configuration (placeholder)."}
              {section === "profile" &&
                "Manage your own admin details when the profile API is connected."}
            </p>
          </section>

          {/* OVERVIEW */}
          {section === "overview" && (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">Total users</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {totalUsers}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">Lawyers</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {lawyerCount}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">NGOs</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {ngoCount}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    Pending verifications
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {pendingCount}
                  </p>
                </div>
              </section>

              <section className="bg-white rounded-xl border p-4 text-sm text-slate-700">
                This overview is intentionally simple. As you build your backend
                APIs, you can replace these example counts with live data and
                add more system stats (active sessions, recent logins, etc.).
              </section>
            </>
          )}

          {/* VERIFICATION QUEUE */}
          {section === "verifications" && (
            <section className="bg-white rounded-xl border p-4 md:p-5 text-sm text-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  Pending verification
                </h2>
                <p className="text-xs text-slate-500">
                  Example data – later use real pending lawyer/NGO accounts.
                </p>
              </div>

              {pendingUsers.length === 0 ? (
                <p>No pending accounts to review right now.</p>
              ) : (
                <div className="space-y-3">
                  {pendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Role: {user.role} • {user.email}
                        </p>
                        <p className="text-xs text-slate-400">
                          Submitted: {user.submitted}
                        </p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => handleDecision(user.id, "approve")}
                          className="px-3 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(user.id, "reject")}
                          className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* USERS SECTION */}
          {section === "users" && (
            <section className="bg-white rounded-xl border p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  Users (simple view)
                </h2>
                <p className="text-xs text-slate-500">
                  Example list – later connect to real user management.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left px-2 py-2 font-medium text-slate-600">
                        ID
                      </th>
                      <th className="text-left px-2 py-2 font-medium text-slate-600">
                        Name
                      </th>
                      <th className="text-left px-2 py-2 font-medium text-slate-600">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="px-2 py-2 whitespace-nowrap">
                          {u.id}
                        </td>
                        <td className="px-2 py-2">{u.name}</td>
                        <td className="px-2 py-2">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SYSTEM NOTES */}
          {section === "system" && (
            <section className="bg-white rounded-xl border p-4 text-sm text-slate-700 space-y-2">
              <p className="font-medium">System notes (placeholder)</p>
              <p>
                This section can later be used for logs, configuration notes, or
                admin-only settings. Keeping it simple now makes it easy to
                extend later.
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600">
                <li>Show last admin login, recent changes, or alerts.</li>
                <li>Link to system health, API status, etc.</li>
              </ul>
            </section>
          )}

          {/* PROFILE */}
          {section === "profile" && (
            <section className="bg-white rounded-xl border p-4 text-sm text-slate-700 space-y-2">
              <p className="font-medium">Profile (placeholder)</p>
              <p>
                Here you will later manage your admin profile, such as name and
                contact details. If you support multiple admins, you can also
                show roles and permissions.
              </p>
              <p>
                Again, the layout is kept minimal so it is easy to plug in your
                backend data without big UI changes.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardAdmin;
