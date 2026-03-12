import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import ProfilePage from "../ProfilePage";
import { axiosClient } from "../../api/axiosClient";
import { useEffect } from "react";


function DashboardCitizen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("overview"); 
  const navigate = useNavigate();
const logout = useAuthStore((state) => state.logout);
const [requestTarget, setRequestTarget] = useState(null);

// null | "LAWYER" | "NGO"

const [selectedCase, setSelectedCase] = useState(null);
const [isEditing, setIsEditing] = useState(false);

const [conversations, setConversations] = useState([]);
const [activeConversation, setActiveConversation] = useState(null);

const [messageText, setMessageText] = useState("");
const [showFilters, setShowFilters] = useState(false);
const [showNgoFilters, setShowNgoFilters] = useState(false);

const toggleFilters = () => {
  setShowFilters(prev => !prev);
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

// People citizen can book appointment with
const [appointmentContacts] = useState([
  {
    id: "L1",
    name: "Adv. Raj Kumar",
    type: "LAWYER",
    caseName: "Property Dispute",
  },
  {
    id: "N1",
    name: "Women Rights NGO",
    type: "NGO",
    caseName: "Domestic Violence Support",
  },
]);


const handleEditChange = (e) => {
  const { name, value } = e.target;
  setSelectedCase((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const fetchMyCases = async () => {
  try {
    setLoadingRequests(true);
    const res = await axiosClient.get("/cases/my");

    setRequests(res.data);
  } catch (err) {
    console.error("Failed to fetch cases", err);
    alert("Unable to load your cases");
  } finally {
    setLoadingRequests(false);
  }
};
const accessToken = useAuthStore((state) => state.accessToken);

useEffect(() => {
  if (accessToken) {
    fetchMyCases();
  }
}, [accessToken]);




const [caseForm, setCaseForm] = useState({
  title: "",
  description: "",
  category: "",
  subCategory: "",
  urgency: "",
  location: "",
  involvedParties: "",
  preferredLanguage: "",
  helpMode: "",
  additionalNotes: "",
  declaration: false,
});


const [caseErrors, setCaseErrors] = useState({});

  const [requests, setRequests] = useState([]);
const [loadingRequests, setLoadingRequests] = useState(false);

const [filters, setFilters] = useState({
  search: "",
  practiceAreas: [],
  languages: [],
  experience: "",
  availability: "",
  verifiedOnly: false,
  helpModes: [],
});

const [ngoFilters, setNgoFilters] = useState({
  search: "",
  focusAreas: [],
  languages: [],
  verifiedOnly: false,
});

const [profiles, setProfiles] = useState([]);
const [loading, setLoading] = useState(true)
const [selectedMatch, setSelectedMatch] = useState(null);

const [matches, setMatches] = useState([]);


  const handleMatchAction = (caseId, matchId, action) => {
  setMatches(prev =>
    prev.map(c =>
      c.caseId === caseId
        ? {
            ...c,
            matches: c.matches.map(m =>
              m.id === matchId
                ? { ...m, status: action }
                : m
            )
          }
        : c
    )
  );
};

useEffect(() => {
  const fetchProfiles = async () => {
    try {
      const res = await axiosClient.get("/citizen/directory/profiles");
      setProfiles(res.data || []);
    } catch (e) {
      console.error("Failed to load profiles", e);
    } finally {
      setLoading(false);
    }
  };

  fetchProfiles();
}, []);

useEffect(() => {
  if (accessToken) {
    axiosClient.get("/citizen/matches", {
      headers: { userEmail: useAuthStore.getState().user.email }
    })
    .then(res => setMatches(res.data))
    .catch(err => console.error("Failed to load matches", err));
  }
}, [accessToken]);


  
const filteredLawyers = profiles
  .filter(p => p.type?.toUpperCase() === "LAWYER")
  .filter(lawyer => {

    if (
      filters.search &&
      !(
        lawyer.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lawyer.state?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lawyer.specialization?.toLowerCase().includes(filters.search.toLowerCase())
      )
    ) return false;

    if (
      filters.practiceAreas.length > 0 &&
      !filters.practiceAreas.some(area =>
        (lawyer.specialization || "").includes(area)
      )
    ) return false;

   // if (filters.verifiedOnly) return false; // until real verified added

    return true;
  });
const filteredNgos = profiles
  .filter(p => p.type?.toUpperCase() === "NGO")
  .filter(ngo => {

    if (
      ngoFilters.search &&
      !(
        ngo.name?.toLowerCase().includes(ngoFilters.search.toLowerCase()) ||
        ngo.state?.toLowerCase().includes(ngoFilters.search.toLowerCase()) ||
        ngo.specialization?.toLowerCase().includes(ngoFilters.search.toLowerCase())
      )
    ) return false;

    if (
      ngoFilters.focusAreas.length > 0 &&
      !ngoFilters.focusAreas.some(area =>
        (ngo.specialization || "").includes(area)
      )
    ) return false;

    if (ngoFilters.verifiedOnly) return false; // until backend has field

    return true;
  });

const [search, setSearch] = useState("");



 const openCount = requests.filter(
  (r) => r.status === "IN_REVIEW" || r.status === "ASSIGNED"
).length;


const closedCount = requests.filter(
  (r) => r.status === "CLOSED"
).length;

const formatStatus = (status) => {
  if (!status) return "";
  return status.replace("_", " ").toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};


 const handleNewRequest = () => {
  setRequestTarget(null); // reset selection
  setSection("new-request");
};

const startChat = (participant, type) => {
  // Check if conversation already exists
  let existing = conversations.find(
    (c) => c.participantId === participant.externalId && c.participantType === type
  );
console.log("Profiles loaded:", profiles);

  if (!existing) {
    existing = {
      id: Date.now(),
      participantId: participant.externalId,
      participantType: type, // "LAWYER" or "NGO"
      participantName: participant.name,
      messages: [],
      lastMessage: "",
      lastUpdated: new Date().toISOString(),
    };

    setConversations((prev) => [...prev, existing]);
  }

  setActiveConversation(existing);
  setSection("messages");
};

// APPOINTMENTS
const [appointments, setAppointments] = useState([
  {
    id: 1,
    personId: "L1",
    withName: "Adv. Raj Kumar",
    withType: "LAWYER",
    caseName: "Property Dispute",
    date: "2026-01-10",
    time: "04:00 PM",
    mode: "In-person",
    location: "Delhi Court Complex",
    notes: "Need to discuss next legal step",
    status: "CONFIRMED",
  }
]);

const [newAppointment, setNewAppointment] = useState({
  personId: "",
  mode: "",
  date: "",
  time: "",
  location: "",
  purpose: "",
});


const submitAppointmentRequest = () => {
  if (
    !newAppointment.personId ||
    !newAppointment.mode ||
    !newAppointment.date ||
    !newAppointment.time
  ) {
    alert("Please fill all required fields");
    return;
  }

  const selected = appointmentContacts.find(
    (p) => p.id === newAppointment.personId
  );

  setAppointments((prev) => [
    ...prev,
    {
      id: Date.now(),
      personId: selected.id,
      withName: selected.name,
      withType: selected.type,
      caseName: selected.caseName,
      date: newAppointment.date,
      time: newAppointment.time,
      mode: newAppointment.mode,
      location: newAppointment.location || "",
      notes: newAppointment.purpose || "",
      status: "PENDING",
    },
  ]);

  alert("Appointment request submitted");

  setNewAppointment({
    personId: "",
    mode: "",
    date: "",
    time: "",
    location: "",
    purpose: "",
  });
};


const sendMessage = () => {
  if (!messageText.trim() || !activeConversation) return;

  const newMessage = {
    id: Date.now(),
    sender: "CITIZEN",
    text: messageText,
    timestamp: new Date().toLocaleTimeString(),
  };

  setConversations((prev) =>
    prev.map((conv) =>
      conv.id === activeConversation.id
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageText,
            lastUpdated: new Date().toISOString(),
          }
        : conv
    )
  );

  setActiveConversation((prev) => ({
    ...prev,
    messages: [...prev.messages, newMessage],
  }));

  setMessageText("");
};


  const navButtonClasses = (key) =>
    `w-full text-left px-2 py-1 rounded text-sm ${
      section === key ? "bg-slate-100 font-semibold" : "hover:bg-slate-100"
    }`;

    const handleCaseChange = (e) => {
  setCaseForm({ ...caseForm, [e.target.name]: e.target.value });
};

const validateCaseForm = () => {
  const errors = {};

  if (!caseForm.title) errors.title = "Case title is required";
  if (!caseForm.description) errors.description = "Case description is required";
  if (!caseForm.category) errors.category = "Category is required";
  if (!caseForm.subCategory) errors.subCategory = "Sub-category is required";
  if (!caseForm.urgency) errors.urgency = "Please select urgency level";
  if (!caseForm.location) errors.location = "Location is required";
  if (!caseForm.preferredLanguage) errors.preferredLanguage = "Language is required";
  if (!caseForm.helpMode) errors.helpMode = "Help mode is required";
  if (!caseForm.declaration)
    errors.declaration = "You must confirm the declaration";

  setCaseErrors(errors);
  return Object.keys(errors).length === 0;
};



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
  className={navButtonClasses("lawyer-directory")}
  onClick={() => setSection("lawyer-directory")}
>
  Lawyer Directory
</button>

<button
  className={navButtonClasses("ngo-directory")}
  onClick={() => setSection("ngo-directory")}
>
  NGO Directory
</button>

<button
  className={navButtonClasses("matches")}
  onClick={() => setSection("matches")}
>
  Matches
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
  className={navButtonClasses("lawyer-directory")}
  onClick={() => setSection("lawyer-directory")}
>
  Lawyer Directory
</button>

<button
  className={navButtonClasses("ngo-directory")}
  onClick={() => setSection("ngo-directory")}
>
  NGO Directory
</button>

<button
  className={navButtonClasses("matches")}
  onClick={() => setSection("matches")}
>
  Matches
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
  : section === "new-request"
  ? "Submit Case"
  : section === "lawyer-directory"
? "Lawyer Directory"
: section === "ngo-directory"
? "NGO Directory"
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

          {/* REQUESTS LIST */}
{section === "requests" && (
  <section className="bg-white rounded-xl border p-4 md:p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm md:text-base font-semibold text-slate-900">
        My Requests
      </h2>

      <button
        onClick={handleNewRequest}
        className="text-xs px-3 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        New request
      </button>
    </div>

    {requests.length === 0 ? (
      <p className="text-sm text-slate-600">
        You haven’t submitted any requests yet.
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
  <tr className="border-b bg-slate-50">
    <th className="text-left px-2 py-2">ID</th>
    <th className="text-left px-2 py-2">Title</th>
    <th className="text-left px-2 py-2">Status</th>
    <th className="text-left px-2 py-2">Assigned To</th>
    <th className="text-left px-2 py-2">Updated</th>
  </tr>
</thead>

          <tbody>
  {requests.map((req) => (
    <tr
      key={req.id}
      className="border-b last:border-0 cursor-pointer hover:bg-slate-50"
      onClick={() => {
        setSelectedCase(req);
        setSection("case-detail");
      }}
    >
      <td className="px-2 py-2">{req.id}</td>
      <td className="px-2 py-2">{req.title}</td>

      <td className="px-2 py-2">
        <span className="px-2 py-0.5 rounded-full text-xs border">
          {formatStatus(req.status)}

        </span>
      </td>

      <td className="px-2 py-2">
        {req.assignedTo || "Not assigned"}
      </td>

      <td className="px-2 py-2">
        {(req.updatedAt || req.createdAt)?.split("T")[0]}
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    )}
  </section>
)}

{section === "lawyer-directory" && (
  <section className="bg-white rounded-xl border p-5">
    <div className="flex items-center justify-between mb-3">
  <h2 className="text-lg font-semibold">Verified Lawyers</h2>

  <button
    onClick={toggleFilters}
    className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
  >
    {showFilters ? "Hide Filters" : "Filters"}
  </button>
</div>

    <p className="text-sm text-slate-600 mb-4">
      Browse verified lawyers by expertise and location
    </p>

    <input
  placeholder="Search by name, expertise or location"
  value={filters.search}
  onChange={(e) =>
    setFilters({ ...filters, search: e.target.value })
  }
  className="w-full border rounded px-3 py-2 mb-4"
/>

<button
  onClick={() =>
    setFilters({
      search: "",
      practiceAreas: [],
      languages: [],
      experience: "",
      availability: "",
      verifiedOnly: false,
      helpModes: [],
    })
  }
  className="w-full mt-3 text-sm border rounded px-3 py-2 hover:bg-slate-100"
>
  Reset Filters
</button>


    {showFilters && (
  <div className="border rounded-xl p-4 mb-4 bg-slate-50 space-y-5">

    {/* PRACTICE AREAS */}
    <div>
      <p className="text-sm font-semibold mb-2">Practice Areas</p>
      <div className="flex flex-wrap gap-2">
        {[
          "Family Law","Property Disputes","Criminal Defense","Civil Law",
          "Labour Law","Corporate Law","Consumer Protection","Human Rights",
          "Environmental Law","Cyber Law","Intellectual Property","Litigation"
        ].map(area => (
          <span
  key={area}
  onClick={() =>
    setFilters((prev) => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter((a) => a !== area)
        : [...prev.practiceAreas, area],
    }))
  }
  className={`px-3 py-1 text-xs border rounded-full cursor-pointer
    ${
      filters.practiceAreas.includes(area)
        ? "bg-blue-600 text-white"
        : "hover:bg-blue-50"
    }`}
>
  {area}
</span>

        ))}
      </div>
    </div>

    {/* LANGUAGES */}
    <div>
      <p className="text-sm font-semibold mb-2">Languages</p>
      <div className="flex flex-wrap gap-2">
        {[
          "English","Hindi","Punjabi","Bengali","Tamil","Telugu",
          "Kannada","Malayalam","Gujarati","Marathi","Urdu"
        ].map(lang => (
          <span
  key={lang}
  onClick={() =>
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }))
  }
  className={`px-3 py-1 text-xs border rounded-full cursor-pointer
    ${
      filters.languages.includes(lang)
        ? "bg-blue-600 text-white"
        : "hover:bg-blue-50"
    }`}
>
  {lang}
</span>

        ))}
      </div>
    </div>

    {/* EXPERIENCE */}
    <div>
      <p className="text-sm font-semibold mb-2">Experience</p>
      <select
  value={filters.experience}
  onChange={(e) =>
    setFilters({ ...filters, experience: e.target.value })
  }
  className="w-full border rounded px-3 py-2 text-sm"
>

        <option value="">Select experience</option>
        <option>0–2 years</option>
        <option>3–5 years</option>
        <option>6–10 years</option>
        <option>10+ years</option>
      </select>
    </div>

    {/* MODE OF HELP */}
    <div>
      <p className="text-sm font-semibold mb-2">Mode of Help</p>
      <div className="flex gap-3 text-sm">
        <label><input type="checkbox" /> Chat</label>
        <label><input type="checkbox" /> Call</label>
        <label><input type="checkbox" /> In-Person</label>
      </div>
    </div>

    {/* AVAILABILITY */}
    <select className="w-full border rounded px-3 py-2 text-sm">
      <option value="">Availability</option>
      <option>Available Now</option>
      <option>This Week</option>
      <option>Limited</option>
    </select>

    {/* VERIFIED */}
    <label className="flex items-center gap-2 text-sm">
      <input
  type="checkbox"
  checked={filters.verifiedOnly}
  onChange={(e) =>
    setFilters({ ...filters, verifiedOnly: e.target.checked })
  }
/>

      Show verified only
    </label>

    {/* SORT */}
    <select className="w-full border rounded px-3 py-2 text-sm">
      <option>Sort by relevance</option>
      <option>Experience (High → Low)</option>
      <option>Recently Active</option>
    </select>

  </div>
)}



    <div className="grid sm:grid-cols-2 gap-4">
      {filteredLawyers.map((lawyer) => (
  <div key={lawyer.externalId} className="border rounded-xl p-4 hover:shadow transition">

    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-slate-900">{lawyer.name}</h3>

      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        Verified
      </span>
    </div>

    <p className="text-sm text-slate-600 mb-2">
      📍 {lawyer.state || "Unknown"}
    </p>

    <div className="flex flex-wrap gap-2 mb-3">
      <span className="text-xs px-2 py-0.5 rounded border">
        {lawyer.specialization || "General Practice"}
      </span>
    </div>

    <button
      onClick={() => startChat(lawyer, "LAWYER")}
      className="text-xs px-3 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
    >
      💬 Chat
    </button>

  </div>
))}


    </div>
  </section>
)}


{section === "ngo-directory" && (
  <section className="bg-white rounded-xl border p-5">
    <div className="flex items-center justify-between mb-3">
  <h2 className="text-lg font-semibold">Verified NGOs</h2>

  <button
    onClick={() => setShowNgoFilters(prev => !prev)}
    className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
  >
    {showNgoFilters ? "Hide Filters" : "Filters"}
  </button>
</div>

    <p className="text-sm text-slate-600 mb-4">
      Browse NGOs providing legal and social support
    </p>

    <input
  placeholder="Search NGO by name, focus or location"
  value={ngoFilters.search}
  onChange={(e) =>
    setNgoFilters({ ...ngoFilters, search: e.target.value })
  }
  className="w-full border rounded px-3 py-2 mb-4"
/>

{showNgoFilters && (
<div className="border rounded-xl p-4 mb-4 bg-slate-50 space-y-4">

  {/* FOCUS AREAS */}
  <div>
    <p className="text-sm font-semibold mb-2">Focus Areas</p>
    <div className="flex flex-wrap gap-2">
      {[
        "Women Rights",
        "Domestic Violence",
        "Child Protection",
        "Labour Rights",
        "Human Rights",
        "Legal Awareness",
        "Senior Citizen Support",
      ].map(area => (
        <span
          key={area}
          onClick={() =>
            setNgoFilters(prev => ({
              ...prev,
              focusAreas: prev.focusAreas.includes(area)
                ? prev.focusAreas.filter(a => a !== area)
                : [...prev.focusAreas, area],
            }))
          }
          className={`px-3 py-1 text-xs border rounded-full cursor-pointer
            ${
              ngoFilters.focusAreas.includes(area)
                ? "bg-green-600 text-white"
                : "hover:bg-green-50"
            }`}
        >
          {area}
        </span>
      ))}
    </div>
  </div>
  {/* LANGUAGES */}
<div>
  <p className="text-sm font-semibold mb-2">Languages</p>
  <div className="flex flex-wrap gap-2">
    {[
      "English",
      "Hindi",
      "Punjabi",
      "Bengali",
      "Tamil",
      "Telugu",
      "Marathi",
      "Gujarati",
      "Urdu",
      "Kannada",
      "Malayalam",
    ].map(lang => (
      <span
        key={lang}
        onClick={() =>
          setNgoFilters(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
              ? prev.languages.filter(l => l !== lang)
              : [...prev.languages, lang],
          }))
        }
        className={`px-3 py-1 text-xs border rounded-full cursor-pointer
          ${
            ngoFilters.languages.includes(lang)
              ? "bg-green-600 text-white"
              : "hover:bg-green-50"
          }`}
      >
        {lang}
      </span>
    ))}
  </div>
</div>


  {/* VERIFIED */}
  <label className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={ngoFilters.verifiedOnly}
      onChange={(e) =>
        setNgoFilters({ ...ngoFilters, verifiedOnly: e.target.checked })
      }
    />
    Show verified NGOs only
  </label>

</div>

)}

    <div className="grid sm:grid-cols-2 gap-4">
      {filteredNgos.map((ngo) => (
  <div key={ngo.externalId} className="border rounded-xl p-4 hover:shadow transition">

    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-slate-900">{ngo.name}</h3>

      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        Verified
      </span>
    </div>

    <p className="text-sm text-slate-600 mb-2">
      📍 {ngo.state || "Unknown"}
    </p>

    <div className="flex flex-wrap gap-2 mb-3">
      <span className="text-xs px-2 py-0.5 rounded border">
        {ngo.specialization || "Social Services"}
      </span>
    </div>

    <button
      onClick={() => startChat(ngo, "NGO")}
      className="text-xs px-3 py-1 rounded-full border border-green-600 text-green-600 hover:bg-green-50"
    >
      💬 Chat
    </button>

  </div>
))}


    </div>
  </section>
)}


{section === "case-detail" && selectedCase && (
  <section className="bg-white rounded-xl border p-6 max-w-4xl mx-auto">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-xs text-slate-500">Case ID</p>
        <h2 className="text-lg font-semibold text-slate-900">
          {selectedCase.id}
        </h2>
      </div>

      <span className="px-3 py-1 rounded-full text-xs border">
        {selectedCase.status}
      </span>
    </div>

    {/* Case Info */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
      <p><strong>Title:</strong></p>
{isEditing ? (
  <input
    name="title"
    value={selectedCase.title}
    onChange={handleEditChange}
    className="w-full border rounded px-3 py-2 mb-2"
  />
) : (
  <p className="text-sm text-slate-700">{selectedCase.title}</p>
)}

<p><strong>Category:</strong></p>
{isEditing ? (
  <select
    name="category"
    value={selectedCase.category}
    onChange={handleEditChange}
    className="w-full border rounded px-3 py-2 mb-2"
  >
    <option value="CIVIL">Civil</option>
    <option value="CRIMINAL">Criminal</option>
    <option value="FAMILY">Family</option>
    <option value="PROPERTY">Property</option>
  </select>
) : (
  <p className="text-sm text-slate-700">{selectedCase.category}</p>
)}

<p><strong>Sub-category:</strong></p>
{isEditing ? (
  <select
    name="subCategory"
    value={selectedCase.subCategory}
    onChange={handleEditChange}
    className="w-full border rounded px-3 py-2 mb-2"
  >
    <option value="DIVORCE">Divorce</option>
    <option value="PROPERTY_DISPUTE">Property Dispute</option>
    <option value="FIR">FIR / Police Matter</option>
    <option value="LABOUR">Labour Issue</option>
  </select>
) : (
  <p className="text-sm text-slate-700">{selectedCase.subCategory}</p>
)}

<p><strong>Urgency:</strong></p>
{isEditing ? (
  <select
    name="urgency"
    value={selectedCase.urgency}
    onChange={handleEditChange}
    className="w-full border rounded px-3 py-2 mb-2"
  >
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
    <option value="EMERGENCY">Emergency</option>
  </select>
) : (
  <p className="text-sm text-slate-700">{selectedCase.urgency}</p>
)}
<p><strong>Location:</strong> {selectedCase.location}</p>
<p><strong>Preferred Language:</strong> {selectedCase.preferredLanguage}</p>
<p><strong>Help Mode:</strong> {selectedCase.helpMode}</p>
<p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
  {selectedCase.description}
</p>

      <p><strong>Assigned To:</strong> {selectedCase.assignedTo || "Not assigned"}</p>
<p><strong>Last Updated:</strong> {(selectedCase.updatedAt || selectedCase.createdAt)?.split("T")[0]}</p>

      <p><strong>Request Type:</strong> Citizen Request</p>
    </div>

    {/* Description */}
    <div className="mb-6">
      <p className="text-sm font-semibold mb-1">Case Description</p>

      {isEditing ? (
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={selectedCase.description}

          onChange={(e) =>
            setSelectedCase({
              ...selectedCase,
              description: e.target.value

            })
          }
        />
      ) : (
        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
          {selectedCase.description}

        </p>
      )}
    </div>

    {/* Actions */}
    <div className="flex flex-wrap gap-3">
      {!isEditing && (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded border text-sm hover:bg-slate-50"
          >
            Edit
          </button>

          <button
  onClick={async () => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;

    try {
      await axiosClient.delete(`/cases/${selectedCase.id}`);
      alert("Case deleted");
      setSelectedCase(null);
      setSection("requests");
      fetchMyCases();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }}
  className="px-4 py-2 rounded border text-sm text-red-600 hover:bg-red-50"
>
  Delete
</button>

        </>
      )}

      {isEditing && (
        <>
          <button
  onClick={async () => {
    try {
      await axiosClient.put(`/cases/${selectedCase.id}`, selectedCase);
      alert("Case updated");
      setIsEditing(false);
      fetchMyCases();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }}
  className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
>
  Save
</button>


          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded border text-sm"
          >
            Cancel
          </button>
        </>
      )}

      <button
        onClick={() => {
          setIsEditing(false);
          setSelectedCase(null);
          setSection("requests");
        }}
        className="ml-auto px-4 py-2 rounded border text-sm"
      >
        Back to Requests
      </button>
    </div>
  </section>
)}



          {/* STEP 1: Choose Request Target */}
{section === "new-request" && requestTarget === null && (
  <section className="bg-white rounded-xl border p-8 max-w-xl mx-auto text-center">
    <h2 className="text-xl font-semibold text-slate-900 mb-2">
      Who do you want help from?
    </h2>
    <p className="text-sm text-slate-600 mb-6">
      Choose the type of help you want for your legal issue
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Lawyer */}
      <button
        onClick={() => setRequestTarget("LAWYER")}
        className="border rounded-xl p-5 hover:border-blue-600 hover:bg-blue-50 transition text-left"
      >
        <p className="text-lg font-semibold text-slate-900">⚖️ Lawyer</p>
        <p className="text-sm text-slate-600 mt-1">
          Get professional legal advice and representation
        </p>
      </button>

      {/* NGO */}
      <button
        onClick={() => setRequestTarget("NGO")}
        className="border rounded-xl p-5 hover:border-green-600 hover:bg-green-50 transition text-left"
      >
        <p className="text-lg font-semibold text-slate-900">🤝 NGO</p>
        <p className="text-sm text-slate-600 mt-1">
          Get help from social or legal aid organizations
        </p>
      </button>
    </div>

    <button
      onClick={() => setSection("requests")}
      className="mt-6 text-sm text-slate-500 hover:underline"
    >
      Cancel and go back
    </button>
  </section>
)}

{/* STEP 2: Case Submission Form */}
{section === "new-request" && requestTarget !== null && (
  <section className="bg-white rounded-xl border p-6 max-w-3xl mx-auto">
    <div className="mb-4">
      <p className="text-xs text-slate-500">Submitting request for</p>
      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium border mt-1">
        {requestTarget === "LAWYER" ? "⚖️ Lawyer" : "🤝 NGO"}
      </span>
    </div>

    <h2 className="text-lg font-semibold mb-4">
      Case Submission
    </h2>

    {/* Case Title */}
    <div className="mb-6 bg-slate-50 p-4 rounded-xl">
  <h3 className="text-sm font-semibold mb-3">Case Information</h3>
    <input
      name="title"
      value={caseForm.title}
      onChange={handleCaseChange}
      placeholder="Case title"
      className="w-full border rounded px-3 py-2 mb-1"
    />
    {caseErrors.title && (
      <p className="text-xs text-red-500 mb-2">{caseErrors.title}</p>
    )}

    {/* Case Description */}
    <textarea
      name="description"
      value={caseForm.description}
      onChange={handleCaseChange}
      placeholder="Describe your situation clearly"
      className="w-full border rounded px-3 py-2 mb-1"
      rows={4}
    />
    {caseErrors.description && (
      <p className="text-xs text-red-500 mb-2">{caseErrors.description}</p>
    )}

    {/* Category */}
    <select
      name="category"
      value={caseForm.category}
      onChange={handleCaseChange}
      className="w-full border rounded px-3 py-2 mb-1"
    >
      <option value="">Select case category</option>
      <option value="CIVIL">Civil</option>
      <option value="CRIMINAL">Criminal</option>
      <option value="FAMILY">Family</option>
      <option value="PROPERTY">Property</option>
    </select>
    {caseErrors.category && (
      <p className="text-xs text-red-500 mb-2">{caseErrors.category}</p>
    )}

    <select
  name="subCategory"
  value={caseForm.subCategory}
  onChange={handleCaseChange}
  className="w-full border rounded px-3 py-2 mb-2"
>
  <option value="">Select sub-category</option>
  <option value="DIVORCE">Divorce</option>
  <option value="PROPERTY_DISPUTE">Property Dispute</option>
  <option value="FIR">FIR / Police Matter</option>
  <option value="LABOUR">Labour Issue</option>
</select>

</div>


<div className="mb-6 bg-slate-50 p-4 rounded-xl">
  <h3 className="text-sm font-semibold mb-3">Priority & Context</h3>
<select
  name="urgency"
  value={caseForm.urgency}
  onChange={handleCaseChange}
  className="w-full border rounded px-3 py-2 mb-2"
>
  <option value="">Select urgency</option>
  <option value="LOW">Low – General guidance</option>
  <option value="MEDIUM">Medium – Needs action</option>
  <option value="HIGH">High – Urgent</option>
  <option value="EMERGENCY">Emergency</option>
</select>


<input
  name="involvedParties"
  value={caseForm.involvedParties}
  onChange={handleCaseChange}
  placeholder="Other involved parties (optional)"
  className="w-full border rounded px-3 py-2 mb-2"
/>

{/* Location */}
    <input
      name="location"
      value={caseForm.location}
      onChange={handleCaseChange}
      placeholder="Location (City, State)"
      className="w-full border rounded px-3 py-2 mb-1"
    />
    {caseErrors.location && (
      <p className="text-xs text-red-500 mb-3">{caseErrors.location}</p>
    )}
</div>


<div className="mb-6 bg-slate-50 p-4 rounded-xl">
  <h3 className="text-sm font-semibold mb-3">Preferences</h3>
<select
  name="preferredLanguage"
  value={caseForm.preferredLanguage}
  onChange={handleCaseChange}
  className="w-full border rounded px-3 py-2 mb-2"
>
  <option value="">Preferred language</option>
  <option value="ENGLISH">English</option>
  <option value="HINDI">Hindi</option>
  <option value="PUNJABI">Punjabi</option>
</select>



<select
  name="helpMode"
  value={caseForm.helpMode}
  onChange={handleCaseChange}
  className="w-full border rounded px-3 py-2 mb-2"
>
  <option value="">Preferred help mode</option>
  <option value="CHAT">Chat only</option>
  <option value="CALL_CHAT">Call + Chat</option>
  <option value="IN_PERSON">In-person meeting</option>
</select>


<textarea
  name="additionalNotes"
  value={caseForm.additionalNotes}
  onChange={handleCaseChange}
  placeholder="Any additional information"
  className="w-full border rounded px-3 py-2 mb-2"
  rows={3}
/>


<label className="flex items-center gap-2 text-sm">
  <input
    type="checkbox"
    name="declaration"
    checked={caseForm.declaration}
    onChange={(e) =>
      setCaseForm({ ...caseForm, declaration: e.target.checked })
    }
  />
  I confirm the information provided is true
</label>

{caseErrors.declaration && (
  <p className="text-xs text-red-500 mt-1">
    {caseErrors.declaration}
  </p>
)}

</div>

    {/* Directory
    <input
      name="directory"
      value={caseForm.directory}
      onChange={handleCaseChange}
      placeholder="Case directory (optional)"
      className="w-full border rounded px-3 py-2 mb-2"
    /> */}

    

    {/* Actions */}
    <div className="flex gap-3 mt-4">
      <button
        onClick={async () => {
  if (!requestTarget) {
    alert("Please select Lawyer or NGO");
    return;
  }

  if (!validateCaseForm()) return;

  try {
    await axiosClient.post("/cases", {
      ...caseForm,
      target: requestTarget,
    });

    alert("Case submitted successfully");

    setCaseForm({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      urgency: "",
      location: "",
      involvedParties: "",
      preferredLanguage: "",
      helpMode: "",
      additionalNotes: "",
      declaration: false,
    });

    setCaseErrors({});
    setRequestTarget(null);
    setSection("requests");
    fetchMyCases();

  } catch (err) {
    console.error("CREATE CASE ERROR:", err.response || err);
    alert("Failed to submit case");
  }
}}

        className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
      >
        Submit
      </button>

      <button
        onClick={() => {
          setRequestTarget(null);
          setSection("requests");
        }}
        className="px-4 py-2 rounded border text-sm"
      >
        Cancel
      </button>
    </div>
  </section>
)}

{section === "matches" && (
  <section className="bg-white rounded-xl border p-5">
    
    <h2 className="text-lg font-semibold mb-2">
      Your Matches
    </h2>

    <p className="text-sm text-slate-600 mb-4">
      Based on your cases, here are matched Lawyers & NGOs.
    </p>

    {matches.length === 0 ? (
      <p className="text-sm text-slate-600">
        No matches yet. Matches will appear once cases are reviewed.
      </p>
    ) : (
      matches.map((c) => (
        <div key={c.caseId} className="border rounded-xl p-4 mb-5">

          {/* Case Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-slate-500">Case Title</p>
              <p className="font-semibold">{c.caseTitle}</p>
            </div>

            <span className="px-2 py-1 text-xs border rounded-full">
              {c.caseStatus}
            </span>
          </div>

          <p className="text-sm font-semibold mb-2">Matched Helpers</p>

          {/* MATCH LIST */}
          <div className="grid sm:grid-cols-2 gap-3">
            {c.matches.map(m => (
              <div key={m.id} className="border rounded-lg p-3 hover:shadow cursor-pointer"
              onClick={() => setSelectedMatch({ ...m, caseId: c.caseId })}
              >

                <div className="flex justify-between">
                  <p className="font-semibold">{m.name}</p>

                  <span className={`text-xs px-2 py-0.5 rounded-full
                    ${m.type === "LAWYER"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                    }`}>
                    {m.type}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-2">
                  Match Score: <strong>{m.score}%</strong>
                </p>

                {/* STATUS */}
                {m.status !== "PENDING" && (
                  <p className={`text-xs font-medium mb-2
                    ${m.status === "ACCEPTED"
                      ? "text-green-600"
                      : "text-red-600"
                    }`}>
                    {m.status === "ACCEPTED" ? "Accepted" : "Rejected"}
                  </p>
                )}

                {/* ACTION BUTTONS */}
                {m.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMatchAction(c.caseId, m.id, "ACCEPTED")}
                      className="px-3 py-1 text-xs rounded-full border border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleMatchAction(c.caseId, m.id, "REJECTED")}
                      className="px-3 py-1 text-xs rounded-full border border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* CHAT BUTTON always visible for lawyers */}
                {m.type === "LAWYER" && (
                  <button
                    onClick={() =>
                      startChat(
                        { externalId: m.id, name: m.name },
                        "LAWYER"
                      )
                    }
                    className="mt-3 px-3 py-1 text-xs rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    💬 Chat
                  </button>
                )}

              </div>
            ))}
          </div>

        </div>
      ))
    )}
  </section>
)}

{selectedMatch && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-[400px] rounded-xl p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{selectedMatch.name}</h2>

        <button
          onClick={() => setSelectedMatch(null)}
          className="text-sm px-2 border rounded hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      {/* Type */}
      <span className={`text-xs px-2 py-0.5 rounded-full
        ${selectedMatch.type === "LAWYER"
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
        }`}
      >
        {selectedMatch.type}
      </span>

      <p className="mt-3 text-sm text-slate-700">
        Match Score: <b>{selectedMatch.score}%</b>
      </p>

      <p className="text-sm text-slate-600 mt-1">
        • Location: Delhi, India (dummy now)<br />
        • Experience: 8 Years (dummy)<br />
        • Languages: English, Hindi (dummy)<br />
      </p>

      <p className="text-sm bg-slate-50 border rounded p-2 mt-2">
        Short Bio / NGO Description (UI only for now)
      </p>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">

        <button
          onClick={() => {
            handleMatchAction(selectedMatch.caseId, selectedMatch.id, "ACCEPTED");
            setSelectedMatch(null);
          }}
          className="px-3 py-1 border border-green-600 text-green-600 rounded text-sm"
        >
          Accept
        </button>

        <button
          onClick={() => {
            handleMatchAction(selectedMatch.caseId, selectedMatch.id, "REJECTED");
            setSelectedMatch(null);
          }}
          className="px-3 py-1 border border-red-600 text-red-600 rounded text-sm"
        >
          Reject
        </button>

        {/* CHAT BUTTON */}
        {selectedMatch.type === "LAWYER" && (
          <button
            onClick={() => {
              startChat(
                { externalId: selectedMatch.id, name: selectedMatch.name },
                "LAWYER"
              );
              setSelectedMatch(null);
              setSection("messages");
            }}
            className="ml-auto px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm"
          >
            💬 Chat
          </button>
        )}

      </div>
    </div>
  </div>
)}
{section === "appointments" && (
  <section className="bg-white rounded-xl border p-5">
    
    <h2 className="text-lg font-semibold mb-2">Appointments</h2>
    <p className="text-sm text-slate-600 mb-4">
      View upcoming appointments or schedule a new one
    </p>

    {/* ---------------- UPCOMING & REQUESTED ---------------- */}
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">
        Upcoming / Requested Appointments
      </h3>

      {appointments.length === 0 ? (
        <p className="text-sm text-slate-500">No appointments yet</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="border rounded-lg p-3 hover:shadow transition"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{appt.withName}</p>

                <span className={`px-3 py-1 text-xs rounded-full border
                  ${appt.status === "CONFIRMED"
                    ? "text-green-600 border-green-600"
                    : appt.status === "PENDING"
                    ? "text-yellow-600 border-yellow-600"
                    : "text-red-600 border-red-600"
                  }`}
                >
                  {appt.status}
                </span>
              </div>

              <p className="text-xs text-slate-600">
                {appt.withType} • Case: {appt.caseName}
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

    <hr className="my-4" />

    {/* ---------------- REQUEST NEW ---------------- */}
    <h3 className="text-sm font-semibold mb-2">Request New Appointment</h3>

    <div className="grid sm:grid-cols-2 gap-3">

      {/* SELECT PERSON */}
      <select
        value={newAppointment.personId}
        onChange={(e) =>
          setNewAppointment({ ...newAppointment, personId: e.target.value })
        }
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Select Lawyer / NGO</option>
        {appointmentContacts.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.type}) — {p.caseName}
          </option>
        ))}
      </select>

      {/* MODE */}
      <select
        value={newAppointment.mode}
        onChange={(e) =>
          setNewAppointment({ ...newAppointment, mode: e.target.value })
        }
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Select Appointment Mode</option>
        <option value="Call">Call</option>
        <option value="Online Meeting">Online Meeting</option>
        <option value="In-person">In-person</option>
      </select>

      {/* DATE */}
      <input
        type="date"
        value={newAppointment.date}
        onChange={(e) =>
          setNewAppointment({ ...newAppointment, date: e.target.value })
        }
        className="border rounded px-3 py-2 text-sm"
      />

      {/* TIME */}
      <input
        type="time"
        value={newAppointment.time}
        onChange={(e) =>
          setNewAppointment({ ...newAppointment, time: e.target.value })
        }
        className="border rounded px-3 py-2 text-sm"
      />

      {/* LOCATION (only for in person) */}
      {newAppointment.mode === "In-person" && (
        <input
          placeholder="Meeting location"
          value={newAppointment.location}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, location: e.target.value })
          }
          className="border rounded px-3 py-2 text-sm sm:col-span-2"
        />
      )}

      {/* PURPOSE */}
      <textarea
        placeholder="Purpose / Notes"
        value={newAppointment.purpose}
        onChange={(e) =>
          setNewAppointment({ ...newAppointment, purpose: e.target.value })
        }
        className="border rounded px-3 py-2 text-sm sm:col-span-2"
        rows={3}
      />
    </div>

    <button
      onClick={submitAppointmentRequest}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm"
    >
      Submit Appointment Request
    </button>
  </section>
)}



          {section === "messages" && (
  <section className="bg-white rounded-xl border h-[70vh] flex overflow-hidden">
    
    {/* LEFT: Conversation List */}
    <aside className="w-64 border-r bg-slate-50 p-3 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-3">Conversations</h3>

      {conversations.length === 0 ? (
        <p className="text-xs text-slate-500">
          No conversations yet
        </p>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConversation(conv)}
            className={`p-2 rounded cursor-pointer mb-2 ${
              activeConversation?.id === conv.id
                ? "bg-blue-100"
                : "hover:bg-slate-100"
            }`}
          >
            <p className="text-sm font-medium">
              {conv.participantName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {conv.lastMessage || "Start chatting"}
            </p>
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
          {/* Chat Header */}
          <div className="border-b p-3">
            <p className="text-sm font-semibold">
              {activeConversation.participantName}
            </p>
            <p className="text-xs text-slate-500">
              {activeConversation.participantType}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-slate-50">
            {activeConversation.messages.length === 0 ? (
              <p className="text-xs text-slate-500">
                No messages yet
              </p>
            ) : (
              activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs p-2 rounded text-sm ${
                    msg.sender === "CITIZEN"
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

{section === "profile" && <ProfilePage />}
        </div>
      </main>
    </div>
  );
}

export default DashboardCitizen;
