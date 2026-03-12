import { useState, useEffect } from "react";
import { axiosClient } from "../../api/axiosClient";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

import AdminMap from "../../components/AdminMap";

import AdminAnalyticsCharts from "../../components/AdminAnalyticsCharts";

function DashboardAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("overview"); 
 const [pendingUsers, setPendingUsers] = useState([]);
const [allUsers, setAllUsers] = useState([]);

const navigate = useNavigate();
const logout = useAuthStore((state) => state.logout);

const [systemLogs, setSystemLogs] = useState([]);
const [logCategory, setLogCategory] = useState("ALL");
const [search, setSearch] = useState("");
const [loadingLogs, setLoadingLogs] = useState(false);

const [caseModalOpen, setCaseModalOpen] = useState(false);
const [selectedCase, setSelectedCase] = useState(null);
const [mappings, setMappings] = useState([
  { external: "NGO Name", internal: "Organization Name" },
  { external: "Contact Person", internal: "Primary Contact Name" },
  { external: "Email", internal: "Contact Email" },
]);

const [existingJobs, setExistingJobs] = useState([
  { id: 1, name: "NGO Darpan — Weekly Sync" },
  { id: 2, name: "Bar Council Import — Monthly" },
  { id: 3, name: "Custom CSV Import" }
]);

const [jobs, setJobs] = useState([]);
const [selectedJob, setSelectedJob] = useState(null);

const addMapping = () => {
  setMappings([...mappings, { external: "", internal: "" }]);
};

const removeMapping = (index) => {
  setMappings(mappings.filter((_, i) => i !== index));
};

const updateMapping = (index, key, value) => {
  const updated = [...mappings];
  updated[index][key] = value;
  setMappings(updated);
};
const [directory, setDirectory] = useState([]);
const [role, setRole] = useState("NGO");
const runImport = async () => {
  try {
    const res = await axiosClient.post("/admin/directory/import/ngo-darpan");
    alert("NGO Import Started Successfully 🚀");
    console.log(res.data);
  } catch (err) {
    console.error(err);
    alert("Import Failed ❌ Check backend logs");
  }
};

const runCsvImport = async () => {
  try {
    const res = await axiosClient.post("/admin/directory/import/csv");
    // alert("CSV Import Done: " + res.data.imported + " NGOs Loaded");
    alert("CSV Import Done: NGOs Loaded");
  } catch (e) {
    alert("Import failed");
  }
};

const [overview, setOverview] = useState(null);
const accessToken = useAuthStore(state => state.accessToken);

useEffect(() => {
  if (!accessToken) return;

  axiosClient.get("/analytics/overview")
    .then(res => setOverview(res.data))
    .catch(err => console.error("Analytics load failed", err));
}, [accessToken]);


const handleLogout = async () => {
  try {
    await axiosClient.post("/auth/logout"); // 🔥 backend log
  } catch (err) {
    console.error("Logout log failed", err);
  } finally {
    logout();               // clear tokens
    navigate("/signin");    // redirect
  }
};


const openCaseModal = async (caseId) => {
  try {
    const res = await axiosClient.get(`/admin/cases/${caseId}`);
    setSelectedCase(res.data);
    setCaseModalOpen(true);
  } catch (err) {
    console.error("Failed to fetch case", err);
    alert("Unable to load case details");
  }
};

const [lastRun, setLastRun] = useState(null);

useEffect(() => {
 if (section !== "ingestion") return;

 axiosClient.get("/admin/directory/runs/latest")
   .then(res => setLastRun(res.data))
   .catch(() => {});
}, [section]);


useEffect(() => {
  if (section !== "ingestion") return;

  axiosClient.get("/admin/ingestion/jobs")
    .then(res => {
      setJobs(res.data);
      if (res.data.length > 0) setSelectedJob(res.data[0].id);
    })
    .catch(() => {});
}, [section]);

useEffect(() => {
  if (section !== "directory") return;

  axiosClient.get("/admin/directory/profiles/all")
    .then(res => setDirectory(res.data))
    .catch(() => alert("Failed loading directory"));
}, [section]);


useEffect(() => {
  if (section === "verifications") {
    axiosClient
      .get("/admin/pending-users")
      .then((res) => {
        setPendingUsers(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch pending users", err);
      });
  }
}, [section]);
useEffect(() => {
  axiosClient
    .get("/admin/users")
    .then((res) => {
      setAllUsers(res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch users", err);
    });
}, []);


useEffect(() => {
  if (section !== "system") return;

  setLoadingLogs(true);

  axiosClient
    .get("/admin/system-logs", {
      params: {
        category: logCategory === "ALL" ? null : logCategory,
        search: search || null
      }
    })
    .then((res) => {
      setSystemLogs(res.data.content);
    })
    .catch((err) => {
      console.error("Failed to fetch system logs", err);
    })
    .finally(() => {
      setLoadingLogs(false);
    });
}, [section, logCategory, search]);


  const totalUsers = allUsers.length;
  const lawyerCount = allUsers.filter((u) => u.role === "LAWYER").length;
  const ngoCount = allUsers.filter((u) => u.role === "NGO").length;
  const pendingCount = pendingUsers.length;

  // --- Analytics dummy data (later replace with backend API data) ---

const userGrowthData = [
  { month: "Aug", users: 120 },
  { month: "Sep", users: 180 },
  { month: "Oct", users: 260 },
  { month: "Nov", users: 340 },
  { month: "Dec", users: 420 },
  { month: "Jan", users: totalUsers }
];

const caseGrowthData = [
  { month: "Aug", cases: 40 },
  { month: "Sep", cases: 90 },
  { month: "Oct", cases: 140 },
  { month: "Nov", cases: 210 },
  { month: "Dec", cases: 260 },
  { month: "Jan", cases: 300 }
];

const categoryData = [
  { name: "Family", value: 120 },
  { name: "Criminal", value: 80 },
  { name: "Property", value: 60 },
  { name: "Labor", value: 40 },
  { name: "Civil", value: 30 }
];

const roleDistribution = [
  { name: "Citizens", value: totalUsers - lawyerCount - ngoCount - 1 },
  { name: "Lawyers", value: lawyerCount },
  { name: "NGOs", value: ngoCount },
  { name: "Admins", value: 1 }
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

  const navButtonClasses = (key) =>
    `w-full text-left px-2 py-1 rounded text-sm ${
      section === key ? "bg-slate-100 font-semibold" : "hover:bg-slate-100"
    }`;

  const handleDecision = (id, action) => {
  axiosClient
    .put(`/admin/${action}/${id}`)
    .then(() => {
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    })
    .catch((err) => {
      console.error(`Failed to ${action} user`, err);
    });
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
  className={navButtonClasses("ingestion")}
  onClick={() => setSection("ingestion")}
>
  Directory Ingestion
</button>

<button
  className={navButtonClasses("directory")}
  onClick={() => setSection("directory")}
>
  Filterable Directory
</button>

            <button
  className="w-full text-left px-2 py-1 rounded text-sm hover:bg-slate-100"
  onClick={() => navigate("/profile")}
>
  Profile
</button>

            <button
  onClick={handleLogout}
  className="w-full text-left px-2 py-1 rounded text-sm text-red-600 hover:bg-red-50"
>
  Logout
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
  className={navButtonClasses("ingestion")}
  onClick={() => setSection("ingestion")}
>
  Directory Ingestion
</button>

<button
  className={navButtonClasses("directory")}
  onClick={() => setSection("directory")}
>
  Filterable Directory
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
            <button
  onClick={() => {
    handleLogout();
    setSidebarOpen(false);
  }}
  className="w-full text-left px-2 py-1 rounded text-sm text-red-600 hover:bg-red-50"
>
  Logout
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
                : section === "ingestion"
? "Directory Ingestion"
: section === "directory"
? "Filterable Directory"

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
  {/* --- KPI CARDS (your existing ones kept) --- */}
  <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-slate-500 mb-1">Total Users</p>
      <p className="text-2xl font-semibold">{totalUsers}</p>
    </div>

    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-slate-500 mb-1">Lawyers</p>
      <p className="text-2xl font-semibold">{lawyerCount}</p>
    </div>

    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-slate-500 mb-1">NGOs</p>
      <p className="text-2xl font-semibold">{ngoCount}</p>
    </div>

    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-slate-500 mb-1">Pending Verifications</p>
      <p className="text-2xl font-semibold">{pendingCount}</p>
    </div>
  </section>

  <div className="mb-6">
  <AdminAnalyticsCharts />
</div>


  {/* Map Section */}
<div className="mt-6">
  <AdminMap />
</div>


  {/* --- LINE CHARTS --- */}
  <div className="grid md:grid-cols-2 gap-6 mb-6">

    {/* User Growth */}
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3">User Growth</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={userGrowthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month"/>
          <YAxis/>
          <Tooltip/>
          <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Case Growth */}
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3">Cases Submitted</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={caseGrowthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month"/>
          <YAxis/>
          <Tooltip/>
          <Line type="monotone" dataKey="cases" stroke="#22c55e" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    </div>

  </div>


  {/* --- BAR + PIE --- */}
  <div className="grid md:grid-cols-2 gap-6">

    {/* Case Categories */}
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3">Case Categories</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={categoryData}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Bar dataKey="value" fill="#f59e0b"/>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Role Distribution */}
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3">Role Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={roleDistribution}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
          >
            {roleDistribution.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]}/>
            ))}
          </Pie>
          <Tooltip/>
          <Legend/>
        </PieChart>
      </ResponsiveContainer>
    </div>

  </div>
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
                                {user.email}
                        </p>
                        <p className="text-xs text-slate-500">
                          Role: {user.role} • {user.email}
                        </p>
                        
                        <p className="text-xs text-slate-400">
  Status: Pending approval
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
                        <td className="px-2 py-2">{u.email}</td>
                        <td className="px-2 py-2">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {section === "system" && (
  <section className="bg-white rounded-xl border p-4 md:p-5 space-y-4">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h2 className="text-sm md:text-base font-semibold text-slate-900">
          System Logs
        </h2>
        <p className="text-xs text-slate-500">
          Track user, admin, security, and system activities
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
  value={logCategory}
  onChange={(e) => setLogCategory(e.target.value)}
  className="border rounded-lg px-2 py-1 text-xs"
>
  <option value="ALL">All</option>
  <option value="ADMIN">Admin</option>
  <option value="USER">User</option>
  <option value="SECURITY">Security</option>
  <option value="SYSTEM">System</option>
</select>


        <input
  type="text"
  placeholder="Search email"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border rounded-lg px-2 py-1 text-xs"
/>

      </div>
    </div>

    {/* Logs Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">
              Time
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">
              Category
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">
              Action
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">
              Actor
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">
              Target
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
  {loadingLogs && (
    <tr>
      <td colSpan="6" className="text-center py-4 text-sm text-slate-500">
        Loading logs...
      </td>
    </tr>
  )}

  {!loadingLogs && systemLogs.length === 0 && (
    <tr>
      <td colSpan="6" className="text-center py-4 text-sm text-slate-500">
        No system logs found
      </td>
    </tr>
  )}

  {!loadingLogs &&
    systemLogs.map((log) => (
      <tr
        key={log.id}
        className="border-b last:border-0 hover:bg-slate-50"
      >
        <td className="px-3 py-2 text-xs text-slate-500">
          {new Date(log.timestamp).toLocaleString()}
        </td>

        <td className="px-3 py-2">
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
            {log.category}
          </span>
        </td>

        <td className="px-3 py-2 text-sm flex gap-2 items-center">
  {log.action}

  {log.action === "CASE_CREATED" && log.targetId && (
    <button
      onClick={() => openCaseModal(log.targetId)}
      className="text-xs px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50"
    >
      View Case
    </button>
  )}
</td>


        <td className="px-3 py-2 text-xs">
          {log.actorEmail}
        </td>

        <td className="px-3 py-2 text-xs">
          {log.targetEmail}
        </td>

        <td className="px-3 py-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              log.status === "SUCCESS"
                ? "bg-green-100 text-green-700"
                : log.status === "WARNING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {log.status}
          </span>
        </td>
      </tr>
    ))}
</tbody>

      </table>
    </div>

    {/* Footer */}
    <p className="text-xs text-slate-400">
      Showing latest system activities. Older logs can be archived automatically.
    </p>

  </section>
)}

{section === "ingestion" && (
  <section className="space-y-6">

{/* HEADER */}
<div className="bg-white border rounded-xl p-5">
  
  <div className="bg-white border rounded-xl p-5 flex items-center justify-between">
  <div>
    <h2 className="text-lg font-semibold">
      Directory Ingestion — Integrate external directories (NGO Darpan, Bar Council)
    </h2>
    <p className="text-sm text-slate-600">
      Manage external data sources, configure mappings, and automate directory updates.
    </p>
  </div>

  <div className="flex gap-3">
    <select
      value={selectedJob || ""}
      onChange={(e) => setSelectedJob(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm"
    >
      {jobs.length === 0 && <option>No Jobs Available</option>}
      {jobs.map(job => (
        <option key={job.id} value={job.id}>
          {job.name}
        </option>
      ))}
    </select>

    <button
      onClick={() => alert("Create new job form coming next 🚀")}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg"
    >
      Add New Job
    </button>
  </div>
</div>

</div>



{/* STEP 1 */}
<div className="bg-white border rounded-xl p-5">
  <h3 className="text-lg font-semibold mb-2">
    1️⃣ Select Data Source
  </h3>

  <div className="grid grid-cols-2 gap-3 text-sm">
    <label className="flex gap-2 items-center">
      <input type="radio" name="source" defaultChecked />
      NGO Darpan
    </label>

    <label className="flex gap-2 items-center">
      <input type="radio" name="source" />
      Bar Council of India
    </label>

    <label className="flex gap-2 items-center">
      <input type="radio" name="source" />
      CSV Upload
    </label>

    <label className="flex gap-2 items-center">
      <input type="radio" name="source" />
      API Endpoint
    </label>
  </div>
</div>



{/* STEP 2 */}
<div className="bg-white border rounded-xl p-5">
  <h3 className="text-lg font-semibold mb-2">
    2️⃣ Configure Authentication
  </h3>

  <div className="flex items-center gap-3 mb-3">
    <span className="text-sm">Use OAuth 2.0</span>
    <input type="checkbox" />
  </div>

  <input
    className="border rounded-lg px-3 py-2 w-full text-sm"
    placeholder="🔑 Enter API Key"
  />
  <p className="text-xs text-slate-500 mt-1">
    This key will be securely stored and encrypted.
  </p>
</div>



{/* STEP 3 */}
<div className="bg-white border rounded-xl p-5">
  <h3 className="text-base font-semibold mb-2">
    3️⃣ Map Data Fields
  </h3>

  <p className="text-xs text-slate-500 mb-3">
    Align external data fields to LegalMatch Pro's internal schema.
  </p>

  {mappings.map((map, index) => (
    <div key={index} className="grid grid-cols-2 gap-4 mb-3">

      {/* External */}
      <select
        value={map.external}
        onChange={(e) => updateMapping(index, "external", e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option>NGO Name</option>
        <option>Contact Person</option>
        <option>Email</option>
        <option>Phone</option>
        <option>Address</option>
      </select>

      {/* Internal */}
      <div className="flex items-center gap-2">
        <select
          value={map.internal}
          onChange={(e) => updateMapping(index, "internal", e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1"
        >
          <option>Organization Name</option>
          <option>Primary Contact Name</option>
          <option>Contact Email</option>
          <option>Contact Phone</option>
          <option>Office Address</option>
        </select>

        {/* Delete */}
        <button
          onClick={() => removeMapping(index)}
          className="text-red-600 text-lg"
        >
          🗑
        </button>
      </div>
    </div>
  ))}

  <button
    onClick={addMapping}
    className="mt-2 border rounded px-4 py-2 text-sm"
  >
    Add Another Mapping
  </button>
</div>



{/* STEP 4 */}
<div className="bg-white border rounded-xl p-5">
  <h3 className="text-lg font-semibold mb-2">
    4️⃣ Data Preview & Validation
  </h3>

  <table className="w-full text-sm border rounded-lg overflow-hidden">
    <thead className="bg-slate-50 border-b">
      <tr>
        <th className="p-2 text-left">ID</th>
        <th className="p-2 text-left">Name</th>
        <th className="p-2 text-left">Type</th>
        <th className="p-2 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="p-2">NGO1001</td>
        <td className="p-2">LegalAid Corps</td>
        <td className="p-2">NGO</td>
        <td className="p-2 text-green-600">Matched</td>
      </tr>

      <tr className="border-b">
        <td className="p-2">NGO1002</td>
        <td className="p-2">Justice Alliance</td>
        <td className="p-2">NGO</td>
        <td className="p-2 text-blue-600">New Record</td>
      </tr>
    </tbody>
  </table>

  <p className="text-xs text-slate-500 mt-2">
    Showing 5 of 1500+ potential records. Full import will process all valid entries.
  </p>
</div>



{/* STEP 5 */}
<div className="bg-white border rounded-xl p-5">
  <h3 className="text-lg font-semibold mb-2">
    5️⃣ Conflict Resolution
  </h3>

  <div className="space-y-2 text-sm">
    <label className="flex gap-2 items-center">
      <input type="radio" name="conflict" defaultChecked />
      Skip existing records
    </label>

    <label className="flex gap-2 items-center">
      <input type="radio" name="conflict" />
      Update existing records
    </label>

    <label className="flex gap-2 items-center">
      <input type="radio" name="conflict" />
      Create new record
    </label>
  </div>
</div>



{/* STEP 6 */}
<div className="bg-white border rounded-xl p-5">
  <h3 className="text-lg font-semibold mb-2">
    6️⃣ Schedule & Run
  </h3>

  <label className="flex gap-2 items-center text-sm">
    <input type="radio" name="schedule" defaultChecked />
    Run Manually (run once now)
  </label>

  <label className="flex gap-2 items-center text-sm">
    <input type="radio" name="schedule" />
    Schedule Import (automatic, recurring)
  </label>
</div>



{/* LAST RUN SUMMARY */}
<div className="bg-white border rounded-xl p-5">
  <h3 className="text-lg font-semibold mb-2">
    📊 Last Run Summary
  </h3>

  <p className="text-sm text-slate-600 mb-3">
    Overview of the most recent directory import.
  </p>

  <div className="grid grid-cols-3 text-center text-xl font-semibold">
  <div>
    {lastRun?.imported || 0}
    <p className="text-sm text-slate-500">Imported</p>
  </div>

  <div>
    {lastRun?.updated || 0}
    <p className="text-sm text-slate-500">Updated</p>
  </div>

  <div className="text-red-600">
    {lastRun?.skipped || 0}
    <p className="text-sm text-slate-500">Skipped</p>
  </div>
</div>


  <p className="text-xs text-slate-500 mt-3">
    Last run completed: 2025-01-01 10:30 UTC
  </p>
</div>


{/* BUTTONS */}
<div className="flex justify-end gap-3">
  <button className="px-4 py-2 border rounded-lg">
    Save Job
  </button>

  <button
  onClick={runCsvImport}
  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
>
  Run Import Now
</button>

</div>

</section>
)}

{section === "directory" && (
  <section className="flex gap-6">

    {/* ------------ LEFT FILTER PANEL ------------ */}
    <div className="w-72 bg-white border rounded-xl p-5 space-y-5">

      <h2 className="text-lg font-semibold">Filters</h2>

      {/* ROLE */}
      <div>
        <p className="text-sm font-medium mb-2">Role</p>
        <div className="flex gap-6 text-sm">
          <span
  className={`cursor-pointer ${role==="LAWYER" ? "text-purple-600 font-semibold" : ""}`}
  onClick={() => setRole("LAWYER")}
>
  Lawyer
</span>

<span
  className={`cursor-pointer ${role==="NGO" ? "text-purple-600 font-semibold" : ""}`}
  onClick={() => setRole("NGO")}
>
  NGO
</span>
        </div>
      </div>

      {/* PRACTICE AREAS */}
      <div>
        <p className="text-sm font-medium mb-2">Practice Areas</p>

        <div className="flex flex-wrap gap-2">
          {[
            "Family Law","Property Disputes","Human Rights",
            "Environmental Law","Corporate Law","Litigation",
            "Criminal Defense","Victim Support","Intellectual Property"
          ].map(tag => (
            <span
              key={tag}
              className="px-3 py-1 text-xs border rounded-full bg-slate-50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* AVAILABILITY */}
      <div>
        <p className="text-sm font-medium mb-2">Availability</p>
        <select className="border rounded-lg px-3 py-2 text-sm w-full">
          <option>Select availability</option>
        </select>
      </div>

      {/* VERIFIED */}
      <div>
        <p className="text-sm font-medium mb-2">Verified Status</p>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 
          peer-focus:outline-none rounded-full peer 
          peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {/* MAX DISTANCE */}
      <div>
        <p className="text-sm font-medium mb-2">
          Max Distance: 100 km
        </p>
        <input
          type="range"
          className="w-full accent-purple-600"
          defaultValue={50}
        />
      </div>

      {/* LANGUAGES */}
      <div>
        <p className="text-sm font-medium mb-2">Languages</p>

        <div className="flex flex-wrap gap-2">
          {[
            "English","Hindi","Bengali","Tamil",
            "Telugu","Kannada","Malayalam","Gujarati"
          ].map(lang => (
            <span
              key={lang}
              className="px-3 py-1 text-xs border rounded-full bg-slate-50"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* SORT */}
      <div>
        <p className="text-sm font-medium mb-2">Sort By</p>
        <select className="border rounded-lg px-3 py-2 text-sm w-full">
          <option>Relevance</option>
        </select>
      </div>
    </div>

    {/* ------------ RIGHT LIST PANEL ------------ */}
    <div className="flex-1">

      {/* Top Bar */}
      <div className="flex items-center gap-3 mb-4">

        <input
          className="border rounded-lg px-3 py-2 text-sm w-64"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          className="border rounded-lg px-3 py-2 text-sm w-64"
          placeholder="Location"
        />

        <div className="flex items-center gap-2 text-sm">
          <span>Radius: 50 km</span>
          <input
            type="range"
            className="accent-purple-600"
            defaultValue={50}
          />
        </div>

        <button className="px-4 py-2 border rounded-lg text-sm">
          List
        </button>

        <button className="px-4 py-2 border rounded-lg text-sm">
          Map
        </button>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold mb-3">
        Matching Profiles ({directory.length})
      </h2>

      {/* Profiles Grid */}
      <div className="grid grid-cols-3 gap-4">

        {directory
          .filter(d => d.type === role)
          .filter(d =>
            d.name?.toLowerCase().includes(search.toLowerCase()) ||
  d.specialization?.toLowerCase().includes(search.toLowerCase())
          )
          .map(d => (
            <div
              key={d.id}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="w-12 h-12 bg-slate-200 rounded-full mb-3" />
              
              <h3 className="font-semibold text-slate-800">
                {d.name}
              </h3>

              <p className="text-sm text-slate-500">
                📍 {d.state || "Unknown"}
              </p>

              <p className="text-sm text-blue-600 mt-1">
                {d.email || "No email"}
              </p>
              <p className="text-xs mt-2">
  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
    {d.specialization || "Not Provided"}
  </span>
</p>

            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-4">
        <button className="text-sm">&lt; Previous</button>
        <button className="px-3 py-1 border rounded">1</button>
        <button className="px-3 py-1">2</button>
        <button className="text-sm">Next &gt;</button>
      </div>
    </div>

  </section>
)}




          {/* PROFILE */}
          
        </div>

        {caseModalOpen && selectedCase && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[650px] max-h-[90vh] overflow-y-auto">

      <h2 className="text-xl font-semibold mb-2">
        Case #{selectedCase.id}
      </h2>

      <p className="text-sm text-slate-500 mb-4">
        Submitted: {selectedCase.createdAt?.split("T")[0]}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">

        <p><strong>Citizen:</strong> {selectedCase.citizenEmail}</p>
        <p><strong>Target:</strong> {selectedCase.target}</p>

        <p><strong>Status:</strong> {selectedCase.status}</p>
        <p><strong>Assigned To:</strong> {selectedCase.assignedTo || "Not Assigned"}</p>

        <p><strong>Category:</strong> {selectedCase.category}</p>
        <p><strong>Sub-Category:</strong> {selectedCase.subCategory}</p>

        <p><strong>Urgency:</strong> {selectedCase.urgency}</p>
        <p><strong>Location:</strong> {selectedCase.location}</p>

        <p><strong>Preferred Language:</strong> {selectedCase.preferredLanguage}</p>
        <p><strong>Help Mode:</strong> {selectedCase.helpMode}</p>

        <p className="col-span-2">
          <strong>Involved Parties:</strong> {selectedCase.involvedParties || "—"}
        </p>

        <p className="col-span-2">
          <strong>Additional Notes:</strong> {selectedCase.additionalNotes || "—"}
        </p>
      </div>

      <div className="mt-4 bg-slate-50 p-3 rounded">
        <p className="text-sm">{selectedCase.description}</p>
      </div>

      <button
        onClick={() => setCaseModalOpen(false)}
        className="mt-4 px-4 py-2 border rounded"
      >
        Close
      </button>
    </div>
  </div>
)}


      </main>
    </div>
  );
}

export default DashboardAdmin;
