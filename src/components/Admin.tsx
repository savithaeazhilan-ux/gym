import React, { useState, useEffect } from "react";
import { 
  Users, CreditCard, Inbox, Search, Plus, Trash2, Edit2, Check, X, ShieldAlert,
  Lock, KeyRound, ArrowRight, RefreshCw, AlertCircle, Dumbbell, Calendar, Heart, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Member, MembershipPlan, ContactInquiry } from "../types";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Sub tabs state
  const [activeSubTab, setActiveSubTab] = useState<"members" | "plans" | "inquiries">("members");

  // Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // Loading / Error States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search filter
  const [memberSearch, setMemberSearch] = useState("");

  // Plan Form Dialog / Inline States
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({
    planName: "",
    price: "",
    duration: ""
  });
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);

  // Authentication check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "arnold1982" || password.trim().toLowerCase() === "demo") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect admin password. (Try 'arnold1982' or click Demo Access)");
    }
  };

  // Live Data queries
  const fetchAllAdminData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Run queries in parallel
      const [mRes, pRes, iRes] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/plans"),
        fetch("/api/inquiries")
      ]);

      if (!mRes.ok || !pRes.ok || !iRes.ok) {
        throw new Error("One or more backend admin endpoints failed to load.");
      }

      const [membersData, plansData, inquiriesData] = await Promise.all([
        mRes.json(),
        pRes.json(),
        iRes.json()
      ]);

      setMembers(membersData);
      setPlans(plansData);
      setInquiries(inquiriesData);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not retrieve admin data packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAdminData();
    }
  }, [isAuthenticated]);

  // --- Deletion Handlers ---
  const handleDeleteMember = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this member registration? This will clear it from the database.")) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete member");
      setMembers(members.filter(m => m._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete member");
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not clear inquiry");
      setInquiries(inquiries.filter(i => i._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to remove inquiry");
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (plans.length <= 1) {
      alert("A gym must possess at least one membership plan definition!");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this membership plan? This alters what packages users see on registration forms.")) return;
    
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed deleting plan");
      setPlans(plans.filter(p => p._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed deleting plan");
    }
  };

  // --- Plan Create / Update Actions ---
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.planName || !planForm.price || !planForm.duration) {
      alert("Please enter all plan details.");
      return;
    }

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: planForm.planName.trim(),
          price: Number(planForm.price),
          duration: planForm.duration.trim()
        })
      });

      if (!res.ok) throw new Error("Failed to seed plan database");
      const createdPlan = await res.json();
      setPlans([...plans, createdPlan]);
      
      // reset form
      setPlanForm({ planName: "", price: "", duration: "" });
      setShowAddPlanForm(false);
    } catch (err: any) {
      alert(err.message || "Error appending plan");
    }
  };

  const handleStartEditPlan = (plan: MembershipPlan) => {
    setEditingPlanId(plan._id);
    setPlanForm({
      planName: plan.planName,
      price: plan.price.toString(),
      duration: plan.duration
    });
  };

  const handleUpdatePlan = async (id: string) => {
    if (!planForm.planName || !planForm.price || !planForm.duration) {
      alert("Required fields cannot be left empty.");
      return;
    }

    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: planForm.planName.trim(),
          price: Number(planForm.price),
          duration: planForm.duration.trim()
        })
      });

      if (!res.ok) throw new Error("Failed updating plan parameters");
      const updated = await res.json();
      
      setPlans(plans.map(p => p._id === id ? updated : p));
      setEditingPlanId(null);
      setPlanForm({ planName: "", price: "", duration: "" });
    } catch (err: any) {
      alert(err.message || "Error updating plan");
    }
  };

  // --- Search Filtering ---
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
    m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.membership.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div id="admin-view" className="bg-zinc-950 text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            /* LOCK SCREEN FORM */
            <motion.div
              key="lockscreen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto mt-16"
              id="admin-lock-screen"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
                
                <div className="bg-zinc-800 text-rose-500 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-750">
                  <Lock className="h-6 w-6" />
                </div>

                <span className="font-mono text-[9px] text-amber-500 tracking-[0.25em] uppercase font-bold block mb-1">
                  SECURE STAFF GATEWAY
                </span>
                <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  CLUB CONTROL <span className="text-amber-500">CENTER</span>
                </h1>
                <p className="font-sans text-xs text-zinc-400 mt-2">
                  Access active database members lists, billing keys, and inquiries
                </p>

                <div className="h-px bg-zinc-800 my-6" />

                {authError && (
                  <div className="bg-rose-950/40 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs mb-4 flex items-center space-x-2 text-left">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4" id="admin-login-form">
                  <div className="text-left">
                    <label className="block font-display text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Admin Space Password
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-zinc-600" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                        id="admin-password-input"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Authenticate Console</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPassword("arnold1982");
                      setIsAuthenticated(true);
                    }}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50 py-2.5 rounded-xl font-display font-bold text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    Demo Quick Access
                  </button>
                </form>

                <p className="font-mono text-[9px] text-zinc-500 mt-6 uppercase">
                  Default Demo Code Check: <span className="text-amber-500 font-bold">arnold1982</span>
                </p>
              </div>
            </motion.div>
          ) : (
            /* ADMIN COCKPIT PANEL */
            <motion.div
              key="cockpit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
              id="admin-cockpit-panel"
            >
              
              {/* Header section with logout */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-500 text-zinc-950 p-2.5 rounded-xl">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                      ADMIN <span className="text-amber-500">COCKPIT</span>
                    </h2>
                    <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest mt-0.5">
                      AUTHORIZED USER SESSION ACTIVE
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    onClick={fetchAllAdminData}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition-all cursor-pointer"
                    title="Reload Database"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-amber-500" : ""}`} />
                  </button>
                  <button
                    onClick={() => {
                      setIsAuthenticated(false);
                      setPassword("");
                    }}
                    className="flex-1 md:flex-initial bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Seal Console
                  </button>
                </div>
              </div>

              {/* Navigation Tabs bar */}
              <div className="flex border-b border-zinc-800 space-x-2" id="admin-subtabs">
                {[
                  { id: "members", label: "Active Members", icon: Users, count: members.length },
                  { id: "plans", label: "Plans Manager", icon: CreditCard, count: plans.length },
                  { id: "inquiries", label: "Contact Inbox", icon: MessageSquare, count: inquiries.length }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id as any)}
                      className={`relative px-5 py-3.5 font-display text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 rounded-t-xl cursor-pointer ${
                        isActive 
                          ? "bg-zinc-900 border-t border-x border-zinc-800 text-amber-500" 
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      <span className={`font-mono text-[9.5px] px-2 py-0.5 rounded-full ${
                        isActive ? "bg-amber-500 text-zinc-950 font-bold" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sub tab Contents layout */}
              <div className="bg-zinc-900 border border-zinc-850 p-6 sm:p-8 rounded-3xl shadow-xl min-h-[50vh]">
                
                {errorMsg && (
                  <div className="bg-rose-950/40 border border-rose-500/20 text-rose-300 p-4 rounded-xl text-xs mb-6 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 1. MEMBERS LIST SUB-TAB */}
                {activeSubTab === "members" && (
                  <div className="space-y-6" id="members-dashboard-console">
                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          placeholder="Search database members by name, plan, email..."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-xs focus:outline-none focus:border-amber-500 transition-all text-white placeholder-zinc-650"
                          id="search-members"
                        />
                      </div>
                      <div className="flex items-center gap-2 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-400">
                        <span>DISPLAYING:</span>
                        <span className="text-amber-500 font-bold">{filteredMembers.length} OF {members.length}</span>
                      </div>
                    </div>

                    {/* Members Table */}
                    {loading ? (
                      <div className="flex justify-center items-center py-20">
                        <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
                      </div>
                    ) : filteredMembers.length === 0 ? (
                      <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-850/50">
                        <Users className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                        <p className="font-display font-medium text-zinc-500 text-sm">No members are index-matched</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-zinc-800" id="members-list-table">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-zinc-950 text-zinc-400 font-mono text-[9px] uppercase tracking-wider border-b border-zinc-800">
                              <th className="p-4">Key ID</th>
                              <th className="p-4">Full Name</th>
                              <th className="p-4">Email Coordinates</th>
                              <th className="p-4">Phone Number</th>
                              <th className="p-4">Plan Select</th>
                              <th className="p-4">Sync Join Date</th>
                              <th className="p-4 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800 font-sans text-xs">
                            {filteredMembers.map((m) => (
                              <tr key={m._id} className="hover:bg-zinc-800/40 transition-colors" id={`member-row-${m._id}`}>
                                <td className="p-4 font-mono text-zinc-500">{m._id.toUpperCase()}</td>
                                <td className="p-4 font-bold text-white uppercase">{m.name}</td>
                                <td className="p-4 text-zinc-300">{m.email}</td>
                                <td className="p-4 font-mono text-zinc-450">+91 {m.phone}</td>
                                <td className="p-4">
                                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold px-2 px-2.5 py-1 rounded text-[10px] uppercase">
                                    {m.membership}
                                  </span>
                                </td>
                                <td className="p-4 text-zinc-400 font-mono">{m.joinDate}</td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => handleDeleteMember(m._id)}
                                    className="p-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-lg text-rose-400 transition-all cursor-pointer"
                                    title="Revoke Membership"
                                    id={`delete-member-${m._id}`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. PLANS COMPONENT SUB-TAB */}
                {activeSubTab === "plans" && (
                  <div className="space-y-8" id="plans-dashboard-console">
                    
                    {/* Add Plan Heading section */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                          MEMBERSHIP PLANS <span className="text-amber-500">SEEDS</span>
                        </h3>
                        <p className="font-sans text-xs text-zinc-400 mt-1">
                          Configure live offers which serve active client forms and dashboards.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setEditingPlanId(null);
                          setPlanForm({ planName: "", price: "", duration: "" });
                          setShowAddPlanForm(!showAddPlanForm);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
                        id="btn-trigger-add-plan"
                      >
                        {showAddPlanForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        <span>{showAddPlanForm ? "Cancel Form" : "Append Plan"}</span>
                      </button>
                    </div>

                    {/* Add Plan Inner Form */}
                    {showAddPlanForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl"
                        id="add-plan-inline-panel"
                      >
                        <form onSubmit={handleCreatePlan} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div>
                            <label className="block font-display text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                              Plan Name Label
                            </label>
                            <input
                              type="text"
                              required
                              value={planForm.planName}
                              onChange={(e) => setPlanForm({ ...planForm, planName: e.target.value })}
                              placeholder="e.g. Biennial"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block font-display text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                              Price (INR / Rate Value)
                            </label>
                            <input
                              type="number"
                              required
                              value={planForm.price}
                              onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                              placeholder="e.g. 21000"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block font-display text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                              Locker Term Duration
                            </label>
                            <input
                              type="text"
                              required
                              value={planForm.duration}
                              onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                              placeholder="e.g. 24 Months"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-display font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer"
                          >
                            Sync Live Offer
                          </button>
                        </form>
                      </motion.div>
                    )}

                    {/* Plans tabular data / cards */}
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <RefreshCw className="h-6 w-6 text-amber-500 animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="plans-dashboard-cards">
                        {plans.map((p) => {
                          const isEditing = editingPlanId === p._id;
                          return (
                            <div
                              key={p._id}
                              id={`admin-plan-card-${p._id}`}
                              className={`bg-zinc-950 border rounded-2xl p-6 ${
                                isEditing ? "border-amber-500 bg-zinc-900/40" : "border-zinc-800"
                              }`}
                            >
                              {isEditing ? (
                                /* PLAN EDITING STATE */
                                <div className="space-y-4" id={`plan-edit-form-${p._id}`}>
                                  <div>
                                    <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Plan Name</label>
                                    <input
                                      type="text"
                                      value={planForm.planName}
                                      onChange={(e) => setPlanForm({ ...planForm, planName: e.target.value })}
                                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded px-2.5 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Rate (INR)</label>
                                    <input
                                      type="number"
                                      value={planForm.price}
                                      onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Duration</label>
                                    <input
                                      type="text"
                                      value={planForm.duration}
                                      onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                    />
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <button
                                      onClick={() => handleUpdatePlan(p._id)}
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded py-2 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center space-x-1 cursor-pointer"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      <span>Save</span>
                                    </button>
                                    <button
                                      onClick={() => setEditingPlanId(null)}
                                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded py-2 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center space-x-1 cursor-pointer"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                      <span>Cancel</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* PLAN DISPLAY STATE */
                                <div className="h-full flex flex-col justify-between">
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-mono text-[9px] text-zinc-500 tracking-wider">Plan ID: #{p._id}</span>
                                      <span className="font-display font-black text-xs text-amber-500 uppercase">{p.duration}</span>
                                    </div>
                                    <h4 className="font-display font-black text-xl uppercase tracking-wide text-white mb-3">
                                      {p.planName}
                                    </h4>
                                    <p className="font-mono text-2xl font-black text-zinc-200">
                                      ₹{p.price.toLocaleString("en-IN")}
                                    </p>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2 border-t border-zinc-900 pt-4 mt-6">
                                    <button
                                      onClick={() => handleStartEditPlan(p)}
                                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-750 p-2.5 rounded-xl font-display text-[10px] uppercase font-bold tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                                      id={`edit-plan-${p._id}`}
                                    >
                                      <Edit2 className="h-3 w-3 text-amber-500" />
                                      <span>Modify</span>
                                    </button>

                                    <button
                                      onClick={() => handleDeletePlan(p._id)}
                                      className="bg-rose-950/20 hover:bg-rose-900/40 text-rose-450 p-2.5 rounded-xl border border-rose-900/30 hover:border-rose-800/50 transition-all cursor-pointer"
                                      id={`delete-plan-${p._id}`}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. CONTACT INBOX SUB-TAB */}
                {activeSubTab === "inquiries" && (
                  <div className="space-y-6" id="inquiries-dashboard-console">
                    <div>
                      <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                        CONTACT INQUIRIES <span className="text-amber-500">INBOX</span>
                      </h3>
                      <p className="font-sans text-xs text-zinc-400 mt-1">
                        Read support credentials and client letters submitted using active frontend portals.
                      </p>
                    </div>

                    {loading ? (
                      <div className="flex justify-center items-center py-20">
                        <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
                      </div>
                    ) : inquiries.length === 0 ? (
                      <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-850/50">
                        <Inbox className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                        <p className="font-display font-medium text-zinc-500 text-sm">Your feedback inbox is empty</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="inquiries-dashboard-list">
                        {inquiries.map((inq) => (
                          <div
                            key={inq._id}
                            id={`inquiry-box-${inq._id}`}
                            className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between hover:border-zinc-700/80 transition-all shadow-inner"
                          >
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">{inq.date}</span>
                                  <span className="font-display font-black text-neutral-300 text-sm uppercase block mt-1">{inq.name}</span>
                                  <span className="font-sans text-xs text-amber-500">{inq.email}</span>
                                </div>

                                <button
                                  onClick={() => handleDeleteInquiry(inq._id)}
                                  className="p-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-lg text-rose-500 transition-all cursor-pointer"
                                  title="Mark as Resolved"
                                  id={`delete-inquiry-${inq._id}`}
                                >
                                  <Trash2 className="h-3 w-3.5" />
                                </button>
                              </div>

                              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl">
                                <span className="font-display font-bold text-xs text-white block mb-1">
                                  Subject: {inq.subject}
                                </span>
                                <p className="font-sans text-xs text-zinc-400 leading-relaxed italic">
                                  “{inq.message}”
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
