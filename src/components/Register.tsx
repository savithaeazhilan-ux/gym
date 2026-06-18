import React, { useState, useEffect } from "react";
import { UserCheck, ShieldCheck, Dumbbell, AlertTriangle, RefreshCw, Smartphone, CreditCard, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MembershipPlan, Member } from "../types";

interface RegisterProps {
  planPreselected?: string;
  setPlanPreselected: (p: string | undefined) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Register({ planPreselected, setPlanPreselected, setCurrentTab }: RegisterProps) {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // UI States
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchDropdownPlans = async () => {
      try {
        const res = await fetch("/api/plans");
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
          
          // Auto select logic
          if (planPreselected) {
            setSelectedPlan(planPreselected);
          } else if (data.length > 0) {
            setSelectedPlan(data[0].planName);
          }
        }
      } catch (err) {
        console.error("Failed to load plans for dropdown", err);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchDropdownPlans();
  }, [planPreselected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg("Please write your full name.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Please write a valid email address.");
      return;
    }
    // Clean phone number (keep only digits)
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setErrorMsg("Please write a valid 10-digit phone number.");
      return;
    }
    if (!selectedPlan) {
      setErrorMsg("Please select a membership commitment plan.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: digitsOnly,
          membership: selectedPlan,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to finalize registration");
      }

      const activeMember = await res.json();
      setRegisteredMember(activeMember);
      
      // Clear form
      setName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedPlanPrice = () => {
    const plan = plans.find((p) => p.planName === selectedPlan);
    return plan ? `₹${plan.price.toLocaleString("en-IN")}` : "---";
  };

  const currentPlanObj = plans.find((p) => p.planName === selectedPlan);

  return (
    <div id="register-view" className="bg-zinc-950 text-white py-20 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <AnimatePresence mode="wait">
          {!registeredMember ? (
            /* REGISTRATION FORM VIEW */
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch"
            >
              
              {/* Left Column: Form Details */}
              <div className="md:col-span-7 bg-zinc-900 border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
                <div>
                  <h1 className="font-display font-black text-3xl uppercase tracking-wider text-white flex items-center gap-3">
                    <UserCheck className="h-8 w-8 text-amber-500" />
                    REGISTER <span className="text-amber-500">NOW</span>
                  </h1>
                  <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest mt-2">
                    Enter details securely to seed active credentials
                  </p>
                  
                  <div className="h-px bg-zinc-800 my-6" />

                  {errorMsg && (
                    <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs mb-6 flex items-center space-x-2" id="register-error">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5" id="membership-registration-form">
                    
                    {/* Name input */}
                    <div>
                      <label className="block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans text-white placeholder-zinc-600"
                        required
                        id="reg-input-name"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans text-white placeholder-zinc-600"
                        required
                        id="reg-input-email"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Phone Number (10 Digits)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-zinc-500 font-mono text-xs">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono text-white placeholder-zinc-600"
                          required
                          maxLength={15}
                          id="reg-input-phone"
                        />
                      </div>
                    </div>

                    {/* Membership Dropdown */}
                    <div>
                      <label className="block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Membership Plan Target
                      </label>
                      {loadingPlans ? (
                        <div className="flex items-center text-zinc-500 space-x-2 py-3">
                          <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
                          <span className="text-xs font-mono">Fetching latest options...</span>
                        </div>
                      ) : (
                        <select
                          value={selectedPlan}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-display font-medium text-white cursor-pointer"
                          required
                          id="reg-select-membership"
                        >
                          {plans.map((p) => (
                            <option key={p._id} value={p.planName} className="bg-zinc-950 text-white font-sans py-2">
                              {p.planName} Plan ({p.duration})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting || loadingPlans}
                      id="btn-register-submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(245,158,11,0.35)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                          <span>Generating Safe ID...</span>
                        </>
                      ) : (
                        <>
                          <Dumbbell className="h-4 w-4 text-zinc-950 rotate-45" />
                          <span>Finalize Legacy Pass</span>
                        </>
                      )}
                    </button>

                  </form>
                </div>
              </div>

              {/* Right Column: Order Details & Philosophy */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                
                {/* Order Summary Widget */}
                <div className="bg-zinc-900 border border-zinc-800/80 p-8 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-400 mb-6">
                    Enrollment Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-zinc-500 text-xs font-mono">SELECTED PACKAGE</span>
                      <span className="font-display text-white font-black uppercase text-lg">
                        {selectedPlan || "..."} Plan
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-zinc-500 text-xs font-mono">RECURRING TERM</span>
                      <span className="font-sans text-zinc-300 font-medium text-xs">
                        {currentPlanObj?.duration || "..."}
                      </span>
                    </div>

                    <div className="h-px bg-zinc-800 my-4" />

                    <div className="flex justify-between items-baseline">
                      <span className="text-zinc-500 text-xs font-mono">TOTAL COST</span>
                      <span className="font-mono text-2xl font-black text-amber-500">
                        {getSelectedPlanPrice()}
                      </span>
                    </div>
                  </div>

                  {/* Trust indicator */}
                  <div className="mt-8 bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-start space-x-3">
                    <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="font-sans text-[11px] text-zinc-400 leading-relaxed">
                      Instant cloud storage. Your data is backed up to our MongoDB cluster immediately, reserving your active lock ID.
                    </p>
                  </div>
                </div>

                {/* Legacy Banner card */}
                <div className="bg-amber-500 text-zinc-950 p-8 rounded-3xl shadow-lg relative overflow-hidden flex-1 flex flex-col justify-between">
                  <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Dumbbell className="w-48 h-48 rotate-12" />
                  </div>
                  <div>
                    <h4 className="font-display font-black uppercase text-2xl tracking-tighter">
                      “NO GIMMICKS. JUST WORK.”
                    </h4>
                    <p className="font-sans text-xs text-zinc-900 font-light mt-3 leading-relaxed">
                      At Arnold Gym, we provide the raw metal, the platform space, and the environment. You provide the perspiration. Step inside and become part of the Venice Beach bodybuilding lineage.
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-950 font-bold">
                      Arnold Gym Official Club Pass
                    </p>
                  </div>
                </div>

              </div>

            </motion.div>
          ) : (
            /* REGISTRATION SUCCESS VIEW (DIGITAL PASS) */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto"
              id="registration-success-panel"
            >
              <div className="bg-zinc-900 border-2 border-amber-500 rounded-3xl p-8 shadow-[0_15px_45px_rgba(245,158,11,0.2)] text-center relative overflow-hidden">
                
                {/* Glow lights */}
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />

                <div className="bg-amber-500 text-zinc-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ShieldCheck className="h-8 w-8" />
                </div>

                <h2 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                  PASS <span className="text-amber-500">ACTIVATED</span>
                </h2>
                <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest mt-1">
                  Welcome to the Arnold Gym Brotherhood
                </p>

                {/* Digital Card Pass rendering */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 my-8 text-left space-y-4 shadow-inner relative">
                  
                  {/* Decorative Magnetic Chip illustration */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-zinc-800 w-10 h-8 rounded-lg border border-zinc-700 shadow-sm" />
                    <Dumbbell className="h-5 w-5 text-amber-500 rotate-45" />
                  </div>

                  <div className="space-y-4 mt-4">
                    <div>
                      <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">MEMBER NAME</span>
                      <span className="block font-display text-base font-black text-white uppercase tracking-wide">
                        {registeredMember.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">DIGITAL KEY CODE</span>
                        <span className="block font-mono text-sm font-bold text-amber-500">
                          #ARN-{registeredMember._id.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">MEMBERSHIP PLAN</span>
                        <span className="block font-display text-sm font-bold text-white uppercase">
                          {registeredMember.membership}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">PHONE</span>
                        <span className="block font-sans text-xs text-zinc-300">
                          +91 {registeredMember.phone}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">JOIN DATE</span>
                        <span className="block font-sans text-xs text-zinc-300">
                          {registeredMember.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-6">
                  Your registration is successfully synced to MongoDB Atlas. Show this digital pass on your smartphone at the front desk of Venice Beach facility to collect your biometric locker band.
                </p>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      setRegisteredMember(null);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Register Another Account
                  </button>
                  
                  <button
                    onClick={() => setCurrentTab("home")}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white py-3 rounded-xl font-display font-medium text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Return to Homepage
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
