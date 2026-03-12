import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { axiosClient } from "../../api/axiosClient";


function DashboardNGO() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("overview"); 
  const navigate = useNavigate();
const logout = useAuthStore((state) => state.logout);
const [isEditingNgo, setIsEditingNgo] = useState(false);
const user = useAuthStore((state) => state.user);

const [ngoProfile, setNgoProfile] = useState({
  name: "Helping Hands NGO",
  registrationId: "NGO-12345",
  type: "Registered Society",
  city: "Delhi",
  state: "Delhi",
  focusAreas: ["Domestic Violence Support"],
  services: ["Legal Guidance"],
  modes: ["Chat Support"],
  languages: ["Hindi", "English"]
});

const handleNgoInputChange = (e) => {
  const { name, value } = e.target;
  setNgoProfile(prev => ({ ...prev, [name]: value }));
};
const handleNgoCheckbox = (field, value) => {
  setNgoProfile(prev => {
    const exists = prev[field]?.includes(value);

    return {
      ...prev,
      [field]: exists
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    };
  });
};

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
// CHAT STATES
const [conversations, setConversations] = useState([
  {
    id: 1,
    participantName: "Sita Devi",
    participantType: "CITIZEN",
    online: false,
    lastMessage: "Okay thank you NGO team",
    lastUpdated: "11:10 AM",
    messages: [
      {
        id: 1,
        sender: "CITIZEN",
        text: "We need help for domestic violence",
        timestamp: "11:00 AM",
      },
      {
        id: 2,
        sender: "NGO",
        text: "We will assist you, don't worry",
        timestamp: "11:05 AM",
      },
    ],
  }
]);

const [activeConversation, setActiveConversation] = useState(null);
const [messageText, setMessageText] = useState("");

const sendMessage = () => {
  if (!messageText.trim() || !activeConversation) return;

  const newMessage = {
    id: Date.now(),
    sender: "NGO",
    text: messageText,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  setConversations(prev =>
    prev.map(conv =>
      conv.id === activeConversation.id
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageText,
            lastUpdated: newMessage.timestamp,
          }
        : conv
    )
  );

  setActiveConversation(prev => ({
    ...prev,
    messages: [...prev.messages, newMessage],
  }));

  setMessageText("");
};

// Citizen requests to NGO
const [ngoAppointmentRequests, setNgoAppointmentRequests] = useState([
  {
    id: "NAPT-1",
    citizen: "Sita Devi",
    caseName: "Domestic Violence Support",
    date: "2026-01-14",
    time: "03:00 PM",
    mode: "In-person",
    location: "NGO Center - Sector 9",
    notes: "Need counselling and legal guidance",
    status: "PENDING",
  },
  {
    id: "NAPT-2",
    citizen: "Rohit Kumar",
    caseName: "Labour Rights Issue",
    date: "2026-01-18",
    time: "11:30 AM",
    mode: "Online Meeting",
    location: "",
    notes: "Need awareness and help filing complaint",
    status: "PENDING",
  },
]);

// Confirmed NGO Appointments
const [ngoConfirmedAppointments, setNgoConfirmedAppointments] = useState([
  {
    id: "NAPT-3",
    citizen: "Community Group",
    caseName: "Land Rights Awareness",
    date: "2026-01-20",
    time: "01:00 PM",
    mode: "Call",
    location: "",
    notes: "Guidance session",
    status: "CONFIRMED",
  },
]);

const acceptNgoAppointment = (id) => {
  const appt = ngoAppointmentRequests.find(a => a.id === id);
  if (!appt) return;

  appt.status = "CONFIRMED";

  setNgoConfirmedAppointments(prev => [...prev, appt]);
  setNgoAppointmentRequests(prev => prev.filter(a => a.id !== id));

  alert("Appointment Accepted");
};

const rejectNgoAppointment = (id) => {
  setNgoAppointmentRequests(prev =>
    prev.map(a =>
      a.id === id ? { ...a, status: "REJECTED" } : a
    )
  );
  alert("Appointment Rejected");
};

const rescheduleNgoAppointment = () => {
  alert("Future enhancement: Reschedule UI will open here");
};


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
  className={navButtonClasses("appointments")}
  onClick={() => setSection("appointments")}
>
  Appointments
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
  className={navButtonClasses("appointments")}
  onClick={() => setSection("appointments")}
>
  Appointments
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

{section === "appointments" && (
  <section className="bg-white rounded-xl border p-5">

    <h2 className="text-lg font-semibold mb-2">Appointments</h2>
    <p className="text-sm text-slate-600 mb-4">
      Manage appointments requested by citizens with your NGO
    </p>

    {/* ---------- APPOINTMENT REQUESTS ---------- */}
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">
        Appointment Requests
      </h3>

      {ngoAppointmentRequests.length === 0 ? (
        <p className="text-sm text-slate-500">
          No pending appointment requests
        </p>
      ) : (
        <div className="space-y-3">
          {ngoAppointmentRequests.map(req => (
            <div
              key={req.id}
              className="border rounded-lg p-3 hover:shadow transition"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{req.citizen}</p>

                <span className="px-3 py-1 text-xs rounded-full border text-yellow-600 border-yellow-600">
                  Pending
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Case / Support Area: {req.caseName}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Date: {req.date} — Time: {req.time}
              </p>

              <p className="text-xs text-slate-500">
                Mode: {req.mode}
              </p>

              {req.mode === "In-person" && req.location && (
                <p className="text-xs text-slate-600">
                  Location: {req.location}
                </p>
              )}

              {req.notes && (
                <p className="text-xs text-slate-500 mt-1">
                  Note: {req.notes}
                </p>
              )}

              <div className="flex gap-2 mt-3 text-xs">
                <button
                  onClick={() => acceptNgoAppointment(req.id)}
                  className="px-3 py-1 rounded-full border border-green-600 text-green-600 hover:bg-green-50"
                >
                  Accept
                </button>

                <button
                  onClick={rescheduleNgoAppointment}
                  className="px-3 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Reschedule
                </button>

                <button
                  onClick={() => rejectNgoAppointment(req.id)}
                  className="px-3 py-1 rounded-full border border-red-600 text-red-600 hover:bg-red-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <hr className="my-4" />

    {/* ---------- CONFIRMED APPOINTMENTS ---------- */}
    <div>
      <h3 className="text-sm font-semibold mb-2">
        Confirmed Appointments
      </h3>

      {ngoConfirmedAppointments.length === 0 ? (
        <p className="text-sm text-slate-500">
          No confirmed appointments yet
        </p>
      ) : (
        <div className="space-y-3">
          {ngoConfirmedAppointments.map(appt => (
            <div
              key={appt.id}
              className="border rounded-lg p-3 hover:shadow transition"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{appt.citizen}</p>

                <span className="px-3 py-1 text-xs rounded-full border text-green-600 border-green-600">
                  Confirmed
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Case / Support: {appt.caseName}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Date: {appt.date} — Time: {appt.time}
              </p>

              <p className="text-xs text-slate-500">
                Mode: {appt.mode}
              </p>

              {appt.mode === "In-person" && appt.location && (
                <p className="text-xs text-slate-600">
                  Location: {appt.location}
                </p>
              )}

              {appt.notes && (
                <p className="text-xs text-slate-500 mt-1">
                  Note: {appt.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

  </section>
)}

          {/* MESSAGES */}
          {section === "messages" && (
  <section className="bg-white rounded-xl border h-[70vh] flex overflow-hidden">
    
    {/* LEFT: Conversation List */}
    <aside className="w-64 border-r bg-slate-50 p-3 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-3">Conversations</h3>

      {conversations.length === 0 ? (
        <p className="text-xs text-slate-500">No conversations yet</p>
      ) : (
        conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => setActiveConversation(conv)}
            className={`p-2 rounded cursor-pointer mb-2 ${
              activeConversation?.id === conv.id
                ? "bg-green-100"
                : "hover:bg-slate-100"
            }`}
          >
            <p className="text-sm font-medium">{conv.participantName}</p>

            <p className="text-xs text-slate-500 truncate">
              {conv.lastMessage || "Start chatting"}
            </p>

            <span className="text-xs">
              {conv.online ? "🟢 Online" : "🔴 Offline"}
            </span>
          </div>
        ))
      )}
    </aside>

    {/* RIGHT: Chat Window */}
    <div className="flex-1 flex flex-col">

      {!activeConversation ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
          Select a conversation to start chatting
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="border-b p-3">
            <p className="text-sm font-semibold">
              {activeConversation.participantName}
            </p>
            <p className="text-xs text-slate-500">
              {activeConversation.participantType} •{" "}
              {activeConversation.online ? "🟢 Online" : "🔴 Offline"}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-slate-50">
            {activeConversation.messages.length === 0 ? (
              <p className="text-xs text-slate-500">No messages yet</p>
            ) : (
              activeConversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`max-w-xs p-2 rounded text-sm ${
                    msg.sender === "NGO"
                      ? "ml-auto bg-green-600 text-white"
                      : "mr-auto bg-white border"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] opacity-70 mt-1 text-right">
                    {msg.timestamp}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>

  </section>
)}


          {/* PROFILE */}
          {section === "profile" && (
  <section className="bg-white rounded-xl border p-4 text-sm text-slate-700">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-3">
      <p className="font-semibold text-base">NGO Profile</p>

      {!isEditingNgo ? (
        <button
          onClick={() => setIsEditingNgo(true)}
          className="px-4 py-1 text-sm rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Edit Profile
        </button>
      ) : (
        <div className="flex gap-2">
          <button
  onClick={async () => {
    try {
        await axiosClient.post("/api/ngo/profile/save", ngoProfile, {
  headers: {
    Authorization: `Bearer ${user?.token}`
  }
});

//       await axiosClient.post("/api/ngo/profile/save", ngoProfile, {
//   headers: { 
//     userId: user?.id,
//     Authorization: `Bearer ${useAuthStore.getState().accessToken}`
//   }
// });

      alert("Profile Saved");
      setIsEditingNgo(false);
    } catch (err) {
      alert("Failed to save NGO Profile");
      console.error(err);
    }
  }}
  className="px-4 py-1 text-sm rounded border border-green-600 text-green-600 hover:bg-green-50"
>
  Save
</button>


          <button
            onClick={() => setIsEditingNgo(false)}
            className="px-4 py-1 text-sm rounded border border-slate-400 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>

    {/* ---------------- VIEW MODE ---------------- */}
    {!isEditingNgo && (
      <div className="space-y-4">

        <div>
          <p className="font-semibold">Organisation Details</p>
          <p>Name: {ngoProfile.name}</p>
          <p>Registration ID: {ngoProfile.registrationId}</p>
          <p>Type: {ngoProfile.type}</p>
          <p>Location: {ngoProfile.city}, {ngoProfile.state}</p>
        </div>

        <div>
          <p className="font-semibold">Focus Areas</p>
          {ngoProfile.focusAreas.length === 0
            ? <p>- Not Added -</p>
            : ngoProfile.focusAreas.map(f => (
                <span key={f} className="inline-block px-2 py-1 border rounded mr-2 mb-1">
                  {f}
                </span>
              ))
          }
        </div>

        <div>
          <p className="font-semibold">Services Provided</p>
          {ngoProfile.services.length === 0
            ? <p>- Not Added -</p>
            : ngoProfile.services.map(f => (
                <span key={f} className="inline-block px-2 py-1 border rounded mr-2 mb-1">
                  {f}
                </span>
              ))
          }
        </div>

        <div>
          <p className="font-semibold">Modes of Support</p>
          {ngoProfile.modes.length === 0
            ? <p>- Not Added -</p>
            : ngoProfile.modes.map(f => (
                <span key={f} className="inline-block px-2 py-1 border rounded mr-2 mb-1">
                  {f}
                </span>
              ))
          }
        </div>

        <div>
          <p className="font-semibold">Languages</p>
          {ngoProfile.languages.length === 0
            ? <p>- Not Added -</p>
            : ngoProfile.languages.map(f => (
                <span key={f} className="inline-block px-2 py-1 border rounded mr-2 mb-1">
                  {f}
                </span>
              ))
          }
        </div>
      </div>
    )}

    {/* ---------------- EDIT MODE ---------------- */}
    {isEditingNgo && (
      <div className="space-y-4">

        {/* ORG DETAILS */}
        <div>
          <p className="font-semibold mb-1">Organisation Details</p>

          <input
            name="name"
            value={ngoProfile.name}
            onChange={handleNgoInputChange}
            className="border rounded p-2 w-full mb-2"
            placeholder="NGO Name"
          />

          <input
            name="registrationId"
            value={ngoProfile.registrationId}
            onChange={handleNgoInputChange}
            className="border rounded p-2 w-full mb-2"
            placeholder="Registration ID"
          />

          <input
            name="type"
            value={ngoProfile.type}
            onChange={handleNgoInputChange}
            className="border rounded p-2 w-full mb-2"
            placeholder="NGO Type"
          />

          <div className="flex gap-2">
            <input
              name="city"
              value={ngoProfile.city}
              onChange={handleNgoInputChange}
              className="border rounded p-2 w-1/2"
              placeholder="City"
            />
            <input
              name="state"
              value={ngoProfile.state}
              onChange={handleNgoInputChange}
              className="border rounded p-2 w-1/2"
              placeholder="State"
            />
          </div>
        </div>

        {/* FOCUS AREAS */}
        <div>
          <p className="font-semibold mb-1">Focus Areas</p>

          {[
            "Domestic Violence Support",
            "Women & Child Rights",
            "Labour & Workers Rights",
            "Human Rights Protection",
            "Legal Awareness & Education",
            "Consumer Awareness",
            "Public Interest / Community Rights",
            "Counseling & Psychological Support",
          ].map(area => (
            <label key={area} className="flex gap-2 mb-1">
              <input
                type="checkbox"
                checked={ngoProfile.focusAreas.includes(area)}
                onChange={() => handleNgoCheckbox("focusAreas", area)}
              />
              {area}
            </label>
          ))}
        </div>

        {/* SERVICES */}
        <div>
          <p className="font-semibold mb-1">Services Provided</p>

          {[
            "Legal Guidance",
            "Counseling Support",
            "Awareness Programs",
            "Help Connecting With Lawyers",
            "Complaint Filing Assistance",
            "Documentation Help",
            "Court Support Assistance",
          ].map(service => (
            <label key={service} className="flex gap-2 mb-1">
              <input
                type="checkbox"
                checked={ngoProfile.services.includes(service)}
                onChange={() => handleNgoCheckbox("services", service)}
              />
              {service}
            </label>
          ))}
        </div>

        {/* MODES */}
        <div>
          <p className="font-semibold mb-1">Modes of Support</p>

          {[
            "Chat Support",
            "Call Support",
            "In-Person Support",
            "Online Meeting Support"
          ].map(mode => (
            <label key={mode} className="flex gap-2 mb-1">
              <input
                type="checkbox"
                checked={ngoProfile.modes.includes(mode)}
                onChange={() => handleNgoCheckbox("modes", mode)}
              />
              {mode}
            </label>
          ))}
        </div>

        {/* LANGUAGES */}
        <div>
          <p className="font-semibold mb-1">Languages</p>

          {[
            "Hindi",
            "English",
            "Punjabi",
            "Bengali",
            "Marathi",
            "Tamil",
            "Telugu"
          ].map(lang => (
            <label key={lang} className="flex gap-2 mb-1">
              <input
                type="checkbox"
                checked={ngoProfile.languages.includes(lang)}
                onChange={() => handleNgoCheckbox("languages", lang)}
              />
              {lang}
            </label>
          ))}
        </div>

      </div>
    )}

  </section>
)}

        </div>
      </main>
    </div>
  );
}

export default DashboardNGO;
