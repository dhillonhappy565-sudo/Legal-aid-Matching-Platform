import { useState } from "react";

function DashboardLawyer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("overview"); 

  const assignedCases = [
    {
      id: "CASE-101",
      citizen: "Aman Sharma",
      topic: "Property dispute",
      status: "In progress",
      nextDate: "2025-02-20",
    },
    {
      id: "CASE-102",
      citizen: "Neha Verma",
      topic: "Domestic violence",
      status: "In review",
      nextDate: "2025-02-25",
    },
  ];

  const incomingRequests = [
    {
      id: "REQ-201",
      citizen: "Rahul Mehta",
      topic: "Job termination",
      urgency: "High",
      submitted: "2025-02-12",
    },
  ];

  const activeCount = assignedCases.filter(
    (c) => c.status === "In progress" || c.status === "In review"
  ).length;
  const closedCount = assignedCases.filter((c) => c.status === "Closed").length;
  const pendingRequests = incomingRequests.length;

  const handleRequestDecision = (id, decision) => {
    alert(
      `In a real app, this would ${decision} request ${id} by calling the backend.`
    );
  };

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
              Lawyer Dashboard
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
              className={navButtonClasses("assigned")}
              onClick={() => setSection("assigned")}
            >
              Assigned cases
            </button>
            <button
              className={navButtonClasses("requests")}
              onClick={() => setSection("requests")}
            >
              Case requests
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
            <p className="font-semibold text-slate-900 mb-2">Lawyer Menu</p>
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
              className={navButtonClasses("assigned")}
              onClick={() => {
                setSection("assigned");
                setSidebarOpen(false);
              }}
            >
              Assigned cases
            </button>
            <button
              className={navButtonClasses("requests")}
              onClick={() => {
                setSection("requests");
                setSidebarOpen(false);
              }}
            >
              Case requests
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
        {/* Mobile top bar inside dashboard */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="text-sm font-semibold text-slate-800">
              Lawyer Dashboard
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
                : section === "assigned"
                ? "Assigned cases"
                : section === "requests"
                ? "Case requests"
                : section === "messages"
                ? "Messages"
                : "Profile"}
            </h1>
            <p className="text-sm text-slate-600">
              {section === "overview" &&
                "Summary of the cases you are handling and new requests waiting for your response."}
              {section === "assigned" &&
                "See the cases that have been assigned to you for legal support."}
              {section === "requests" &&
                "Review new case requests from citizens before accepting them."}
              {section === "messages" &&
                "This area will later show communication with citizens and NGOs."}
              {section === "profile" &&
                "Here you will later manage your professional details and contact information."}
            </p>
          </section>

          {/* OVERVIEW SECTION */}
          {section === "overview" && (
            <>
              {/* Summary cards */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">Active cases</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {activeCount}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    Closed cases (example)
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {closedCount}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    Pending requests
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {pendingRequests}
                  </p>
                </div>
              </section>

              {/* Short note */}
              <section className="bg-white rounded-xl border p-4 text-sm text-slate-700">
                This overview is intentionally simple. When your backend is
                ready, you can plug in real counts and upcoming hearing dates
                for each case.
              </section>
            </>
          )}

          {/* ASSIGNED CASES SECTION */}
          {section === "assigned" && (
            <section className="bg-white rounded-xl border p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  Assigned cases
                </h2>
                <p className="text-xs text-slate-500">
                  These are the cases you are currently handling.
                </p>
              </div>

              {assignedCases.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No cases have been assigned to you yet.
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
                          Citizen
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Topic
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Status
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Next date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedCases.map((c) => (
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
                            {c.nextDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* CASE REQUESTS SECTION */}
          {section === "requests" && (
            <section className="bg-white rounded-xl border p-4 md:p-5 text-sm text-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  Case requests
                </h2>
                <p className="text-xs text-slate-500">
                  Example data – will later come from backend.
                </p>
              </div>

              {incomingRequests.length === 0 ? (
                <p>No new requests at the moment.</p>
              ) : (
                <div className="space-y-3">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {req.topic}
                        </p>
                        <p className="text-xs text-slate-500">
                          {req.citizen} • Urgency: {req.urgency}
                        </p>
                        <p className="text-xs text-slate-400">
                          Submitted: {req.submitted}
                        </p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() =>
                            handleRequestDecision(req.id, "accept")
                          }
                          className="px-3 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleRequestDecision(req.id, "reject")
                          }
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

          {/* MESSAGES SECTION */}
          {section === "messages" && (
            <section className="bg-white rounded-xl border p-4 text-sm text-slate-700">
              <p className="mb-1 font-medium">Messages</p>
              <p>
                Later, this section will show chat or message history between
                you and citizens/NGOs. For now, it is just a placeholder to show
                how the layout will look.
              </p>
            </section>
          )}

          {/* PROFILE SECTION */}
          {section === "profile" && (
            <section className="bg-white rounded-xl border p-4 text-sm text-slate-700 space-y-2">
              <p className="font-medium">Profile (placeholder)</p>
              <p>
                This is where your professional details (name, bar registration,
                expertise, location) will be displayed and edited once the
                profile API is connected.
              </p>
              <p>
                The goal is to keep the layout simple so you can plug in real
                data without big changes later.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardLawyer;
