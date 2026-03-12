import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { axiosClient } from "../../api/axiosClient";


function DashboardLawyer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("overview"); 
  const navigate = useNavigate();
const logout = useAuthStore((state) => state.logout);
const [isEditingProfile, setIsEditingProfile] = useState(false);

const [lawyerProfile, setLawyerProfile] = useState({
  fullName: "",
  barNumber: "",
  barState: "",
  experience: "",
  city: "",
  primaryAreas: "",
  otherAreas: "",
  bio: "",
  modes: [],
  availabilityStatus: "",
  languages: ""
});

const [savedProfileSnapshot, setSavedProfileSnapshot] = useState(null);

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

const handleProfileChange = (e) => {
  const { name, value } = e.target;
  setLawyerProfile(prev => ({ ...prev, [name]: value }));
};
const handlePrimaryAreasChange = (e) => {
  const options = e.target.options;
  const values = [];

  for (let i = 0; i < options.length; i++) {
    if (options[i].selected) values.push(options[i].value);
  }

  setLawyerProfile(prev => ({
    ...prev,
    primaryAreas: values
  }));
};
const handlePrimaryAreaCheckbox = (area) => {
  setLawyerProfile(prev => {
    const alreadySelected = prev.primaryAreas.includes(area);

    return {
      ...prev,
      primaryAreas: alreadySelected
        ? prev.primaryAreas.filter(a => a !== area)   // remove if exists
        : [...prev.primaryAreas, area]                // add if not
    };
  });
};


const handleModeToggle = (mode) => {
  setLawyerProfile(prev => {
    const exists = prev.modes.includes(mode);
    return {
      ...prev,
      modes: exists
        ? prev.modes.filter(m => m !== mode)
        : [...prev.modes, mode]
    };
  });
};

const startEditingProfile = () => {
  setSavedProfileSnapshot(lawyerProfile);
  setIsEditingProfile(true);
};

const cancelEditingProfile = () => {
  setLawyerProfile(savedProfileSnapshot);
  setIsEditingProfile(false);
};

const saveProfile = () => {

  // basic validation
  if (!lawyerProfile.fullName || !lawyerProfile.barNumber || !lawyerProfile.primaryArea) {
    alert("Please fill the required fields (Name, Bar Number, Primary Practice Area)");
    return;
  }

  // later this will call backend API
  alert("Profile saved successfully ✔ (for now stored locally)");

  setSavedProfileSnapshot(lawyerProfile);
  setIsEditingProfile(false);
};


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

  // CHAT STATES
const [conversations, setConversations] = useState([
  {
    id: 1,
    participantName: "Aman Sharma",
    participantType: "CITIZEN",
    online: true,
    lastMessage: "Thank you sir",
    lastUpdated: "10:30 AM",
    messages: [
      {
        id: 1,
        sender: "CITIZEN",
        text: "Hello sir, I need help",
        timestamp: "10:20 AM",
      },
      {
        id: 2,
        sender: "LAWYER",
        text: "Yes tell me",
        timestamp: "10:22 AM",
      },
    ],
  }
]);
// Appointment Requests (pending from citizens)
const [appointmentRequests, setAppointmentRequests] = useState([
  {
    id: "APT-1",
    citizen: "Aman Sharma",
    caseName: "Property Dispute",
    date: "2026-01-10",
    time: "04:00 PM",
    mode: "In-person",
    location: "Delhi Court Complex",
    notes: "Need to discuss next legal step",
    status: "PENDING",
  },
  {
    id: "APT-2",
    citizen: "Neha Verma",
    caseName: "Domestic Violence",
    date: "2026-01-12",
    time: "11:00 AM",
    mode: "Online Meeting",
    location: "",
    notes: "Want to understand case progress",
    status: "PENDING",
  },
]);

// Confirmed Appointments
const [confirmedAppointments, setConfirmedAppointments] = useState([
  {
    id: "APT-3",
    citizen: "Rahul Mehta",
    caseName: "Job Termination",
    date: "2026-01-15",
    time: "02:00 PM",
    mode: "Call",
    location: "",
    notes: "Case guidance discussion",
    status: "CONFIRMED",
  },
]);

const acceptAppointment = (id) => {
  const appt = appointmentRequests.find(a => a.id === id);
  if (!appt) return;

  appt.status = "CONFIRMED";
  setConfirmedAppointments(prev => [...prev, appt]);
  setAppointmentRequests(prev => prev.filter(a => a.id !== id));

  alert("Appointment Accepted");
};

const rejectAppointment = (id) => {
  setAppointmentRequests(prev =>
    prev.map(a =>
      a.id === id ? { ...a, status: "REJECTED" } : a
    )
  );
  alert("Appointment Rejected");
};

const rescheduleAppointment = (id) => {
  alert("In future, this will open reschedule UI");
};


const [activeConversation, setActiveConversation] = useState(null);
const [messageText, setMessageText] = useState("");

const sendMessage = () => {
  if (!messageText.trim() || !activeConversation) return;

  const newMessage = {
    id: Date.now(),
    sender: "LAWYER",
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

          {section === "appointments" && (
  <section className="bg-white rounded-xl border p-5">
    
    <h2 className="text-lg font-semibold mb-2">Appointments</h2>
    <p className="text-sm text-slate-600 mb-4">
      Manage consultation appointments requested by citizens
    </p>

    {/* ---------------- APPOINTMENT REQUESTS ---------------- */}
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">
        Appointment Requests
      </h3>

      {appointmentRequests.length === 0 ? (
        <p className="text-sm text-slate-500">
          No pending appointment requests
        </p>
      ) : (
        <div className="space-y-3">
          {appointmentRequests.map(req => (
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
                Case: {req.caseName}
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
                  onClick={() => acceptAppointment(req.id)}
                  className="px-3 py-1 rounded-full border border-green-600 text-green-600 hover:bg-green-50"
                >
                  Accept
                </button>

                <button
                  onClick={() => rescheduleAppointment(req.id)}
                  className="px-3 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Reschedule
                </button>

                <button
                  onClick={() => rejectAppointment(req.id)}
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

    {/* ---------------- CONFIRMED APPOINTMENTS ---------------- */}
    <div>
      <h3 className="text-sm font-semibold mb-2">
        Confirmed Appointments
      </h3>

      {confirmedAppointments.length === 0 ? (
        <p className="text-sm text-slate-500">
          No confirmed appointments yet
        </p>
      ) : (
        <div className="space-y-3">
          {confirmedAppointments.map(appt => (
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
                Case: {appt.caseName}
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


          {/* MESSAGES SECTION */}
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
                ? "bg-blue-100"
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
                    msg.sender === "LAWYER"
                      ? "ml-auto bg-blue-600 text-white"
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
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>

  </section>
)}


          {/* PROFILE SECTION */}
          {section === "profile" && (
  <section className="bg-white rounded-xl border p-5">

    <h2 className="text-lg font-semibold mb-1">Lawyer Profile</h2>

    {!isEditingProfile && (
      <p className="text-sm text-slate-600 mb-4">
        Your profile information used for matching with citizen cases.
      </p>
    )}

    {/* VIEW MODE */}
    {!isEditingProfile && (
      <>
        <div className="space-y-3 text-sm">

          <div>
            <p className="font-semibold">Professional Details</p>
            <p>Name: {lawyerProfile.fullName || "Not filled"}</p>
            <p>Bar Number: {lawyerProfile.barNumber || "Not filled"}</p>
            <p>Bar State: {lawyerProfile.barState || "Not filled"}</p>
            <p>Experience: {lawyerProfile.experience || "Not filled"}</p>
            <p>City: {lawyerProfile.city || "Not filled"}</p>
          </div>

          <div>
            <p className="font-semibold">Practice Areas</p>
            <p>Primary: {lawyerProfile.primaryArea || "Not filled"}</p>
            <p>Other Areas: {lawyerProfile.otherAreas || "Not filled"}</p>
            <p>Bio: {lawyerProfile.bio || "Not filled"}</p>
          </div>

          <div>
            <p className="font-semibold">Modes Supported</p>
            <p>
              {lawyerProfile.modes.length === 0
                ? "Not selected"
                : lawyerProfile.modes.join(", ")}
            </p>
          </div>

          <div>
            <p className="font-semibold">Availability Status</p>
            <p>{lawyerProfile.availabilityStatus || "Not filled"}</p>
          </div>

          <div>
            <p className="font-semibold">Languages</p>
            <p>{lawyerProfile.languages || "Not filled"}</p>
          </div>
        </div>

        <button
          onClick={startEditingProfile}
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Edit Profile
        </button>
      </>
    )}

    {/* EDIT MODE */}
    {isEditingProfile && (
      <div className="space-y-4 mt-2">

        {/* Section A */}
        <div>
          <p className="font-semibold mb-1">Professional Details</p>

          <input
            name="fullName"
            value={lawyerProfile.fullName}
            onChange={handleProfileChange}
            placeholder="Full Name"
            className="w-full border rounded p-2 mb-2 text-sm"
          />

          <input
            name="barNumber"
            value={lawyerProfile.barNumber}
            onChange={handleProfileChange}
            placeholder="Bar Council Registration Number"
            className="w-full border rounded p-2 mb-2 text-sm"
          />

          <input
            name="barState"
            value={lawyerProfile.barState}
            onChange={handleProfileChange}
            placeholder="Bar Council State"
            className="w-full border rounded p-2 mb-2 text-sm"
          />

          <input
            name="experience"
            value={lawyerProfile.experience}
            onChange={handleProfileChange}
            placeholder="Years of Experience"
            className="w-full border rounded p-2 mb-2 text-sm"
          />

          <input
            name="city"
            value={lawyerProfile.city}
            onChange={handleProfileChange}
            placeholder="City / Practice Location"
            className="w-full border rounded p-2 mb-2 text-sm"
          />
        </div>

        {/* Section B */}
        <div>
          <p className="font-semibold mb-1">Practice Areas</p>

          <label className="text-sm font-semibold">Primary Practice Areas</label>

<div className="border rounded p-3 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">

  {[
    "Family Law",
    "Criminal Law",
    "Civil Disputes",
    "Property / Land Disputes",
    "Domestic Violence",
    "Women & Child Rights",
    "Labour & Employment Law",
    "Consumer Protection",
    "Contract & Corporate Law",
    "Financial / Banking Issues",
    "Human Rights",
    "Public Interest Litigation",
    "Cyber Law",
    "Education Related Issues",
    "General Legal Help"
  ].map(area => (
    <label key={area} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={lawyerProfile.primaryAreas.includes(area)}
        onChange={() => handlePrimaryAreaCheckbox(area)}
      />
      {area}
    </label>
  ))}

</div>




          <input
            name="otherAreas"
            value={lawyerProfile.otherAreas}
            onChange={handleProfileChange}
            placeholder="Other Areas (comma separated)"
            className="w-full border rounded p-2 mb-2 text-sm"
          />

          <textarea
            name="bio"
            value={lawyerProfile.bio}
            onChange={handleProfileChange}
            placeholder="Short professional bio"
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        {/* Section C */}
        <div>
          <p className="font-semibold mb-1">Modes Supported</p>

          <div className="flex gap-3 text-sm">
            <label>
              <input
                type="checkbox"
                checked={lawyerProfile.modes.includes("Chat")}
                onChange={() => handleModeToggle("Chat")}
              /> Chat
            </label>

            <label>
              <input
                type="checkbox"
                checked={lawyerProfile.modes.includes("Call")}
                onChange={() => handleModeToggle("Call")}
              /> Call
            </label>

            <label>
              <input
                type="checkbox"
                checked={lawyerProfile.modes.includes("In-person")}
                onChange={() => handleModeToggle("In-person")}
              /> In-person
            </label>
          </div>
        </div>

        {/* Section D */}
        <div>
          <p className="font-semibold mb-1">Availability Status</p>

          <select
            name="availabilityStatus"
            value={lawyerProfile.availabilityStatus}
            onChange={handleProfileChange}
            className="border rounded p-2 w-full text-sm"
          >
            <option value="">Select</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Limited">Limited Availability</option>
          </select>
        </div>

        {/* Section E */}
        <div>
          <p className="font-semibold mb-1">Languages</p>

          <input
            name="languages"
            value={lawyerProfile.languages}
            onChange={handleProfileChange}
            placeholder="e.g. English, Hindi, Punjabi"
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          >
            Save Changes
          </button>

          <button
            onClick={cancelEditingProfile}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
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

export default DashboardLawyer;
