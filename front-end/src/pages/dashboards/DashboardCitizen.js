import { useState } from "react";

function DashboardCitizen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("overview"); 


  const sampleRequests = [
    {
      id: "REQ-001",
      topic: "Property dispute",
      status: "In review",
      helper: "Not assigned",
      lastUpdated: "2025-02-10",
    },
    {
      id: "REQ-002",
      topic: "Job termination",
      status: "In progress",
      helper: "Adv. Singh",
      lastUpdated: "2025-02-14",
    },
  ];

  const openCount = sampleRequests.filter(
    (r) => r.status === "In review" || r.status === "In progress"
  ).length;
  const closedCount = sampleRequests.filter(
    (r) => r.status === "Closed"
  ).length;

  const handleNewRequest = () => {
    alert(
      "Here you will later open a form to describe your legal issue. For now this is just a placeholder button."
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
              Citizen Dashboard
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
              className={navButtonClasses("requests")}
              onClick={() => setSection("requests")}
            >
              My Requests
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
            <p className="font-semibold text-slate-900 mb-2">Citizen Menu</p>
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
              className={navButtonClasses("requests")}
              onClick={() => {
                setSection("requests");
                setSidebarOpen(false);
              }}
            >
              My Requests
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
              Citizen Dashboard
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
          {/* Heading depends on section */}
          <section className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1 capitalize">
              {section === "overview"
                ? "Overview"
                : section === "requests"
                ? "My Requests"
                : section === "messages"
                ? "Messages"
                : "Profile"}
            </h1>
            <p className="text-sm text-slate-600">
              {section === "overview" &&
                "Summary of your legal help requests and general information."}
              {section === "requests" &&
                "View the legal help requests you have created and their status."}
              {section === "messages" &&
                "This area will later show communication with assigned helpers."}
              {section === "profile" &&
                "Here you will later manage your personal details and contact information."}
            </p>
          </section>

          {/* Content based on selected section */}
          {section === "overview" && (
            <>
              {/* Summary cards */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">Open requests</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {openCount}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    Closed requests
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {closedCount}
                  </p>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    Next step / reminder
                  </p>
                  <p className="text-sm text-slate-700">
                    This area can later show upcoming dates or important notes
                    once they are available from the backend.
                  </p>
                </div>
              </section>

              {/* Short note */}
              <section className="bg-white rounded-xl border p-4 text-sm text-slate-700">
                This is a simple citizen overview. As your backend grows, you
                can plug real case data here instead of these examples.
              </section>
            </>
          )}

          {section === "requests" && (
            <section className="bg-white rounded-xl border p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  My requests
                </h2>
                <button
                  onClick={handleNewRequest}
                  className="text-xs px-3 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  New request
                </button>
              </div>

              {sampleRequests.length === 0 ? (
                <p className="text-sm text-slate-600">
                  You have not created any requests yet.
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
                          Topic
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Status
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Helper
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-slate-600">
                          Last updated
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRequests.map((req) => (
                        <tr key={req.id} className="border-b last:border-0">
                          <td className="px-2 py-2 whitespace-nowrap">
                            {req.id}
                          </td>
                          <td className="px-2 py-2">{req.topic}</td>
                          <td className="px-2 py-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-slate-300">
                              {req.status}
                            </span>
                          </td>
                          <td className="px-2 py-2">{req.helper}</td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            {req.lastUpdated}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {section === "messages" && (
            <section className="bg-white rounded-xl border p-4 text-sm text-slate-700">
              <p className="mb-1 font-medium">Messages</p>
              <p>
                Later, this section will show chat or message history between
                you and assigned lawyers/NGOs. For now, it is just a placeholder
                to show how the layout will look.
              </p>
            </section>
          )}

          {section === "profile" && (
            <section className="bg-white rounded-xl border p-4 text-sm text-slate-700 space-y-2">
              <p className="font-medium">Profile (placeholder)</p>
              <p>
                This is where your profile fields (name, contact info, location)
                will be displayed and edited once the profile API is connected.
              </p>
              <p>
                Keeping this simple helps you plug in real data later without
                changing the layout.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardCitizen;
