import { useState, useEffect, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  RefreshCw,
  LogOut,
  ArrowLeft,
  FileText,
  Sparkles,
  Phone,
  Tag,
  ChevronDown
} from "lucide-react";
import {
  Inquiry,
  InquiryStatus,
  getInquiries,
  saveInquiry,
  updateInquiryStatus,
  updateInquiryNotes,
  deleteInquiry,
  resetToSampleInquiries,
  clearAllInquiries
} from "../lib/inquiries";

// SHA-256 hash helper so credentials are never stored in plaintext
async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Stored SHA-256 hashes (no plain-text username or password in code)
const VALID_USER_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
const VALID_PASS_HASHES = [
  "37ff5745ef89da123c2295d6c90758cad130b9d29e3a068a2f9962bececab049",
  "3cb694aa163edb51b0841c85a215cb1a47e41c42e2b53c7b8f999dcbb595a181"
];

const AUTH_STORAGE_KEY = "tweb_admin_authenticated";

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInquiryData, setNewInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Artisanal Cafe & Bakery",
    message: "",
    budget: "$5,000 - $10,000"
  });

  // Check if authenticated in current session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sessionAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load inquiries
  const reloadData = () => {
    setInquiries(getInquiries());
  };

  useEffect(() => {
    reloadData();

    const handleUpdate = () => reloadData();
    window.addEventListener("tweb_inquiry_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("tweb_inquiry_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const uHash = await sha256(username.trim());
      const pHash = await sha256(password.trim());

      if (uHash === VALID_USER_HASH && VALID_PASS_HASHES.includes(pHash)) {
        setIsAuthenticated(true);
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        setUsername("");
        setPassword("");
      } else {
        setAuthError("Invalid username or password.");
      }
    } catch {
      setAuthError("Authentication failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUsername("");
    setPassword("");
  };

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.projectType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesType = typeFilter === "all" || item.projectType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [inquiries, searchQuery, statusFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter((i) => i.status === "new").length;
    const inProgress = inquiries.filter((i) => i.status === "in_progress").length;
    const contacted = inquiries.filter((i) => i.status === "contacted").length;
    const completed = inquiries.filter((i) => i.status === "completed").length;
    return { total, newCount, inProgress, contacted, completed };
  }, [inquiries]);

  // Export to CSV
  const exportToCSV = () => {
    if (inquiries.length === 0) {
      alert("No inquiries to export.");
      return;
    }
    const headers = ["ID", "Name", "Email", "Phone", "Project Type", "Budget", "Status", "Date", "Message", "Notes"];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.email}"`,
      `"${i.phone || ""}"`,
      `"${i.projectType}"`,
      `"${i.budget || ""}"`,
      i.status,
      `"${new Date(i.createdAt).toLocaleString()}"`,
      `"${i.message.replace(/"/g, '""')}"`,
      `"${(i.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tweb_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDetail = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNoteDraft(inquiry.notes || "");
  };

  const handleSaveNotes = () => {
    if (!selectedInquiry) return;
    updateInquiryNotes(selectedInquiry.id, noteDraft);
    setSelectedInquiry({ ...selectedInquiry, notes: noteDraft });
  };

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiryData.name || !newInquiryData.email) return;

    saveInquiry(newInquiryData);
    setShowAddModal(false);
    setNewInquiryData({
      name: "",
      email: "",
      phone: "",
      projectType: "Restaurant & Hospitality",
      message: "",
      budget: "$5,000 - $10,000"
    });
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/25">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/25">
            <Clock className="h-3 w-3" />
            In Progress
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-2.5 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/25">
            <Mail className="h-3 w-3" />
            Contacted
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/25">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/15 px-2.5 py-1 text-xs font-semibold text-slate-400 border border-slate-500/25">
            Archived
          </span>
        );
    }
  };

  // Lock screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-6 selection:bg-cyan-500/30 selection:text-cyan-200">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">Admin Portal</h1>
            <p className="mt-2 text-xs text-slate-400">
              Restricted access. Sign in with administrative credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Username
              </label>
              <div className="relative mt-2">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="off"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setAuthError("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-xs text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
            >
              <Unlock className="h-4 w-4" />
              {isAuthenticating ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs font-medium">Website</span>
            </a>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white flex items-center gap-2">
                  TWeb Admin Hub
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                    SECURE PORTAL
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400">Live Client Inquiries & Lead Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              Export CSV
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Inquiry
            </button>

            <button
              onClick={handleLogout}
              title="Lock Admin Portal"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <p className="text-xs font-medium text-slate-400">Total Inquiries</p>
            <p className="mt-2 text-3xl font-extrabold text-white">{stats.total}</p>
            <p className="mt-1 text-[11px] text-slate-500">All received leads</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-emerald-400">New / Unread</p>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-emerald-400">{stats.newCount}</p>
            <p className="mt-1 text-[11px] text-slate-400">Requires review</p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-medium text-amber-400">In Progress</p>
            <p className="mt-2 text-3xl font-extrabold text-amber-400">{stats.inProgress}</p>
            <p className="mt-1 text-[11px] text-slate-400">Under discussion</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-medium text-cyan-400">Contacted</p>
            <p className="mt-2 text-3xl font-extrabold text-cyan-400">{stats.contacted}</p>
            <p className="mt-1 text-[11px] text-slate-400">Proposal sent</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client name, email, project type, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
              {["all", "new", "in_progress", "contacted", "completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`rounded-lg px-2.5 py-1 font-medium capitalize transition-all cursor-pointer ${
                    statusFilter === tab
                      ? "bg-cyan-500 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Project Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0d1424] px-3 py-2 text-xs text-slate-300 focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Industries</option>
              <option value="Artisanal Cafe & Bakery">Cafe & Bakery (Little Umbrella)</option>
              <option value="Restaurant & Asian Dining">Asian Dining (DIMSUM BOX)</option>
              <option value="Footwear & Retail Store">Footwear & Retail (The First Step)</option>
              <option value="Corporate / Creative Agency">Corporate & Creative</option>
              <option value="Other Custom Web Project">Custom Project</option>
            </select>
          </div>
        </div>

        {/* Data Table with Responsive Table Best Practices */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Inquiries List</h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                {filteredInquiries.length} shown
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToSampleInquiries}
                className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                title="Restore default mock inquiries"
              >
                Reset Samples
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear all inquiries?")) {
                    clearAllInquiries();
                  }
                }}
                className="text-[11px] text-rose-400/80 hover:text-rose-400 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">No inquiries found</h3>
              <p className="mt-1 text-xs text-slate-400">
                Try adjusting your search query or status filter.
              </p>
            </div>
          ) : (
            <div className="table-wrapper overflow-x-auto max-w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 border-b border-white/10 bg-[#0d1424] text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Client / Contact</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Project Type</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Message & Scope</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Status</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Date</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="group transition-colors hover:bg-white/[0.03]"
                    >
                      {/* Client / Name */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {inquiry.name}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-slate-400">
                          <Mail className="h-3 w-3 text-slate-500" />
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="hover:text-cyan-400 transition-colors"
                          >
                            {inquiry.email}
                          </a>
                        </div>
                        {inquiry.phone && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-slate-500">
                            <Phone className="h-3 w-3 text-slate-600" />
                            <span>{inquiry.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Project Type */}
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
                          {inquiry.projectType}
                        </span>
                        {inquiry.budget && (
                          <div className="mt-1 text-[11px] text-cyan-400/90 font-mono">
                            {inquiry.budget}
                          </div>
                        )}
                      </td>

                      {/* Message excerpt */}
                      <td className="px-6 py-4 max-w-xs sm:max-w-md">
                        <p className="line-clamp-2 text-slate-300">{inquiry.message}</p>
                        {inquiry.notes && (
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
                            <Tag className="h-3 w-3" />
                            Note: {inquiry.notes}
                          </p>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={inquiry.status}
                          onChange={(e) =>
                            updateInquiryStatus(inquiry.id, e.target.value as InquiryStatus)
                          }
                          className="rounded-lg border border-white/10 bg-[#0d1424] px-2.5 py-1 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                        >
                          <option value="new">🟢 New</option>
                          <option value="in_progress">🟡 In Progress</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="completed">🟣 Completed</option>
                          <option value="archived">⚪ Archived</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(inquiry)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <a
                            href={`mailto:${inquiry.email}?subject=Regarding Your Inquiry with TWeb Studio`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all cursor-pointer"
                            title="Reply to Client via Email"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>

                          {inquiry.phone && (
                            <a
                              href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inquiry.name)}%2C%20thank%20you%20for%20contacting%20TWeb%20Studio%20regarding%20your%20project.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all cursor-pointer"
                              title="Chat on WhatsApp"
                            >
                              <Phone className="h-3.5 w-3.5 text-emerald-400" />
                            </a>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Delete inquiry from ${inquiry.name}?`)) {
                                deleteInquiry(inquiry.id);
                              }
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Inquiry Detail View Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0b101e] p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-cyan-400">{selectedInquiry.id}</span>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <h3 className="mt-2 text-xl font-bold text-white">{selectedInquiry.name}</h3>
                <p className="text-xs text-slate-400">
                  Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-6 text-xs">
              {/* Contact info grid */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Email</span>
                  <p className="mt-1 font-medium text-white break-all">
                    <a href={`mailto:${selectedInquiry.email}`} className="text-cyan-400 hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Phone</span>
                  <p className="mt-1 font-medium text-white">
                    {selectedInquiry.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Project Type</span>
                  <p className="mt-1 font-medium text-white">{selectedInquiry.projectType}</p>
                </div>
              </div>

              {/* Requirement message */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Client Requirements & Message
                </span>
                <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Update in Modal */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Update Lead Status</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["new", "in_progress", "contacted", "completed", "archived"] as InquiryStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updateInquiryStatus(selectedInquiry.id, st);
                          setSelectedInquiry({ ...selectedInquiry, status: st });
                        }}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                          selectedInquiry.status === st
                            ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                            : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {st.replace("_", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Internal Admin Notes
                </span>
                <textarea
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add private team notes, follow-up status, or quote details..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-600 transition-colors cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => {
                  if (confirm(`Delete inquiry from ${selectedInquiry.name}?`)) {
                    deleteInquiry(selectedInquiry.id);
                    setSelectedInquiry(null);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Inquiry
              </button>

              <div className="flex items-center gap-2">
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(selectedInquiry.name)}%2C%20thank%20you%20for%20contacting%20TWeb%20Studio%20regarding%20your%20project.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                )}

                <a
                  href={`mailto:${selectedInquiry.email}?subject=TWeb Studio - Next Steps for ${selectedInquiry.projectType}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Reply to Client
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Inquiry Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0b101e] p-6 shadow-2xl sm:p-8">
            <h3 className="text-xl font-bold text-white">Create New Inquiry</h3>
            <p className="mt-1 text-xs text-slate-400">
              Manually record a client lead from a phone call, WhatsApp, or email.
            </p>

            <form onSubmit={handleCreateInquiry} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-300">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={newInquiryData.name}
                    onChange={(e) =>
                      setNewInquiryData({ ...newInquiryData, name: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={newInquiryData.email}
                    onChange={(e) =>
                      setNewInquiryData({ ...newInquiryData, email: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newInquiryData.phone}
                    onChange={(e) =>
                      setNewInquiryData({ ...newInquiryData, phone: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-300">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    placeholder="$5,000 - $10,000"
                    value={newInquiryData.budget}
                    onChange={(e) =>
                      setNewInquiryData({ ...newInquiryData, budget: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-300">
                  Project Type
                </label>
                <select
                  value={newInquiryData.projectType}
                  onChange={(e) =>
                    setNewInquiryData({ ...newInquiryData, projectType: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d1424] px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Artisanal Cafe & Bakery">Artisanal Cafe & Bakery (Little Umbrella)</option>
                  <option value="Restaurant & Asian Dining">Restaurant & Asian Dining (DIMSUM BOX)</option>
                  <option value="Footwear & Retail Store">Footwear & Retail Store (The First Step)</option>
                  <option value="Corporate / Creative Agency">Corporate / Creative Agency</option>
                  <option value="Other Custom Web Project">Other Custom Web Project</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-300">
                  Project Requirements / Details
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline key project specs, timeline, or notes..."
                  value={newInquiryData.message}
                  onChange={(e) =>
                    setNewInquiryData({ ...newInquiryData, message: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
