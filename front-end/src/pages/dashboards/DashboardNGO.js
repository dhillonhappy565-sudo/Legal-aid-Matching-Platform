import { useState } from "react";

function DashboardNGO() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("overview"); 

  const communityCases = [
    {
      id: "CASE-301",
      citizen: "Sita Devi",
      topic: "Domestic violence",
      status: "In progress",
      location: "Village A",
    },
    {
      id: "CASE-302",
      citizen: "Village group",
      topic: "Land rights",
      status: "In review",
      location: "Block B",
    },
  ];

  const programs = [
    {
      id: "PRG-01",
      title: "Legal awareness camp",
      date: "2025-02-22",
      location: "Community Hall, Ward 4",
    },
    {
      id: "PRG-02",
      title: "Women rights workshop",
      date: "2025-03-05",
      location: "Govt School, Sector 9",
    },
  ];

  const activeCases = communityCases.filter(
    (c) => c.status === "In progress" || c.status === "In review"
  ).length;
  const closedCases = communityCases.filter(
    (c) => c.status === "Closed"
  ).length;

  const navButtonClasses = (key) =>
    `w-full text-left px-2 py-1 rounded text-sm ${
      section === key ? "bg-slate-100 font-semibold" : "hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-50 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 bg-white border-r">
        <div className="w-full p-4 flex flex-col gap-4">
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="text-sm font-semibold text-slate-800">
              NGO Dashboard
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
              className={navButtonClasses("cases")}
              onClick={() => setSection("cases")}
            >
              Community cases
            </button>
            <button
              className={navButtonClasses("programs")}
              onClick={() => setSection("programs")}
            >
              Programs & clinics
            </button>
            <button
              className={navButtonClasses("messages")}
              onClick={() => setSection("messages")}
            >
              Messages
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
            <p className="font-semibold text-slate-900 mb-2">NGO Menu</p>
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
              className={navButtonClasses("cases")}
              onClick={() => {
                setSection("cases");
                setSidebarOpen(false);
              }}
            >
              Community cases
            </button>
            <button
              className={navButtonClasses("programs")}
              onClick={() => {
                setSection("programs");
                setSidebarOpen(false);
              }}
            >
              Programs & clinics
            </button>
            <button
              className={navButtonClasses("messages")}
              onClick={() => {
                setSection("messages");
                setSidebarOpen(false);
              }}
            >
              Messages
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
              NGO Dashboard
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
                : section === "cases"
                ? "Community cases"
                : section === "programs"
                ? "Programs & clinics"
                : section === "messages"
                ? "Messages"
                : "Profile"}
            </h1>
            <p className="text-sm text-slate-600">
              {section === "overview" &&
                "Summary of the community cases and programs your NGO is handling."}
              {section === "cases" &&
                "View community cases that your NGO is supporting or coordinating."}
              {section === "programs" &&
                "Keep track of your legal awareness camps and outreach programs."}
              {section === "messages" &&
                "This area will later show communication between your NGO, citizens and lawyers."}
              {section === "profile" &&
                "Here you will later manage your organisation details and contact information."}
            </p>
          </section>

          {/* OVERVIEW */}
          {section === "overview" && (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    Active community cases
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {activeCases}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    Closed cases (example)
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {closedCases}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    Upcoming programs
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {programs.length}
                  </p>
                </div>
              </section>

              <section className="bg-white rounded-xl border p-4 text-sm text-slate-700">
                This NGO overview keeps things simple. Later, you can replace
                these example numbers with real data from your backend (cases,
                beneficiaries, outreach statistics).
              </section>
            </>
          )}

          {/* COMMUNITY CASES */}
          {section === "cases" && (
            <section className="bg-white rounded-xl border p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  Community cases
                </h2>
                <p className="text-xs text-slate-500">
                  Example data – later use real cases.
                </p>
              </div>

              {communityCases.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No cases are linked to your NGO yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          ID
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Beneficiary
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Topic
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Status
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {communityCases.map((c) => (
                        <tr key={c.id} className="border-b last:border-0">
                          <td className="px-2 py-2 whitespace-nowrap">
                            {c.id}
                          </td>
                          <td className="px-2 py-2">{c.citizen}</td>
                          <td className="px-2 py-2">{c.topic}</td>
                          <td className="px-2 py-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-slate-300">
                              {c.status}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            {c.location}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* PROGRAMS & CLINICS */}
          {section === "programs" && (
            <section className="bg-white rounded-xl border p-4 md:p-5 text-sm text-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  Programs & clinics
                </h2>
                <p className="text-xs text-slate-500">
                  Example future outreach activities.
                </p>
              </div>

              {programs.length === 0 ? (
                <p>No upcoming programs listed yet.</p>
              ) : (
                <div className="space-y-3">
                  {programs.map((p) => (
                    <div
                      key={p.id}
                      className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {p.location}
                        </p>
                        <p className="text-xs text-slate-400">Date: {p.date}</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        Later, you can add buttons here to mark attendance or
                        record impact.
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* MESSAGES */}
          {section === "messages" && (
            <section className="bg-white rounded-xl border p-4 text-sm text-slate-700">
              <p className="mb-1 font-medium">Messages</p>
              <p>
                This placeholder section represents future conversations between
                your NGO, citizens, and lawyers. When messaging APIs are ready,
                you can render message threads here.
              </p>
            </section>
          )}

          {/* PROFILE */}
          {section === "profile" && (
            <section className="bg-white rounded-xl border p-4 text-sm text-slate-700 space-y-2">
              <p className="font-medium">Profile (placeholder)</p>
              <p>
                This is where your organisation details (name, registration
                number, focus areas, contact info) will be displayed and edited
                when profile APIs are connected.
              </p>
              <p>
                Layout is kept simple so you can directly plug dynamic data
                later without redesign.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardNGO;
