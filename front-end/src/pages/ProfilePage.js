import { useState } from "react";

function ProfilePage() {
   const [profile, setProfile] = useState({
    name: "Rohit Kumar",
    username: "rohit_123",
    email: "rohit@example.com",
    role: "Citizen",
    location: "Chandigarh, India",
    organization: "",
    expertise: "",
    contactInfo: "9876543210",
    verified: true, 
    avatarUrl: "", 
  });

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState({});

  const isHelperRole =
    profile.role === "Lawyer" || profile.role === "NGO";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDraft((prev) => ({ ...prev, avatarUrl: url }));
  };

  const validate = () => {
    const newErrors = {};

    if (!draft.name.trim()) newErrors.name = "Name is required.";
    if (!draft.username.trim()) newErrors.username = "Username is required.";

    if (!draft.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(draft.email))
      newErrors.email = "Enter a valid email address.";

    if (!draft.location.trim())
      newErrors.location = "Location is recommended for better matching.";

    if (draft.contactInfo && draft.contactInfo.length < 5)
      newErrors.contactInfo = "Contact info looks too short.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setProfile(draft);
    setEditMode(false);
    alert("Profile updated locally (demo). Later this will call the backend.");
  };

  const handleCancel = () => {
    setDraft(profile); 
    setErrors({});
    setEditMode(false);
  };

  const startEdit = () => {
    setDraft(profile);
    setErrors({});
    setEditMode(true);
  };

  const avatarToShow = editMode ? draft.avatarUrl : profile.avatarUrl;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-10">
        {/* Page heading */}
        <header className="mb-6">
          <p className="text-xs text-slate-500 mb-1">Account</p>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Profile
          </h1>
          <p className="text-sm text-slate-600">
            View and update your basic details. Later this page will use real
            data from the backend.
          </p>
        </header>

        {/* Slightly fancier card */}
        <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {/* subtle gradient strip */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600" />

          <div className="p-5 md:p-6">
            {/* Top row: avatar + name + role + verify badge */}
            <div className="flex items-start gap-4 mb-5">
              {/* Avatar */}
              <div className="relative">
                {avatarToShow ? (
                  <img
                    src={avatarToShow}
                    alt="Profile"
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {profile.name || "Unnamed user"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] md:text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-300 text-slate-700">
                        {profile.role}
                      </span>

                      {isHelperRole && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full border ${
                            profile.verified
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          {profile.verified
                            ? "Verified helper"
                            : "Pending approval"}
                        </span>
                      )}
                    </div>
                  </div>

                  {!editMode && (
                    <button
                      onClick={startEdit}
                      className="self-start text-xs md:text-sm px-3 py-1.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Edit profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-slate-200 mb-4" />

            {/* Content: view or edit */}
            {!editMode ? (
              // VIEW MODE
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Username</p>
                    <p>{profile.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p>{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p>{profile.location || "Not set"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {isHelperRole && (
                    <>
                      <div>
                        <p className="text-xs text-slate-500">Organisation</p>
                        <p>{profile.organization || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">
                          Expertise / focus
                        </p>
                        <p>{profile.expertise || "Not set"}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-xs text-slate-500">Contact info</p>
                    <p>{profile.contactInfo || "Not set"}</p>
                  </div>
                </div>
              </div>
            ) : (
              // EDIT MODE
              <form onSubmit={handleSave} className="space-y-4 text-sm">
                {/* Avatar upload */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-700">
                    Profile picture
                  </p>
                  <div className="flex items-center gap-3">
                    {avatarToShow ? (
                      <img
                        src={avatarToShow}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                        No image
                      </div>
                    )}
                    <label className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer">
                      Choose image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    (Local preview only for now; not uploaded to server.)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full name
                    </label>
                    <input
                      name="name"
                      value={draft.name}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Location
                    </label>
                    <input
                      name="location"
                      value={draft.location}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City, State"
                    />
                    {errors.location && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Username & email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Username
                    </label>
                    <input
                      name="username"
                      value={draft.username}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your username"
                    />
                    {errors.username && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={draft.email}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Helper-specific fields */}
                {isHelperRole && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Organisation (optional)
                      </label>
                      <input
                        name="organization"
                        value={draft.organization}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="NGO name / law firm / self-employed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Expertise / focus areas
                      </label>
                      <input
                        name="expertise"
                        value={draft.expertise}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Family law, land rights"
                      />
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="max-w-md">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contact info
                  </label>
                  <input
                    name="contactInfo"
                    value={draft.contactInfo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone or alternate email"
                  />
                  {errors.contactInfo && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.contactInfo}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1">
                    This will be used by matched helpers or citizens to contact
                    you.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 text-xs md:text-sm"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs md:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
