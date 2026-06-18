import React, { useState, useEffect } from "react";
import {
  Check,
  Dumbbell,
  Star,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { MembershipPlan } from "../types";

interface PlansProps {
  setCurrentTab: (tab: string) => void;
  setPlanPreselected: (planName: string) => void;
}

export default function Plans({
  setCurrentTab,
  setPlanPreselected,
}: PlansProps) {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKUP_PLANS: MembershipPlan[] = [
    {
      _id: "101",
      planName: "Monthly",
      price: 1500,
      duration: "1 Month",
    },
    {
      _id: "102",
      planName: "Quarterly",
      price: 4000,
      duration: "3 Months",
    },
    {
      _id: "103",
      planName: "Annual",
      price: 12000,
      duration: "12 Months",
    },
  ];

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/plans");

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No plans returned");
      }

      setPlans(data);
    } catch (err) {
      console.error("Failed to load plans:", err);

      setError(
        "Unable to connect to database. Showing backup plans."
      );

      setPlans(BACKUP_PLANS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSelectPlan = (planName: string) => {
    setPlanPreselected(planName);
    setCurrentTab("register");
  };

  const getPlanFeatures = (planName: string) => {
    const name = planName.toLowerCase();

    if (name.includes("annual")) {
      return [
        "24/7 Gym Access",
        "Unlimited Sauna Access",
        "Personal Trainer Consultation",
        "Monthly Body Assessment",
        "Guest Passes Included",
        "Premium Locker Access",
      ];
    }

    if (name.includes("quarterly")) {
      return [
        "24/7 Gym Access",
        "Trainer Consultation",
        "Locker Facility",
        "Steam Room Access",
        "Guest Passes Included",
      ];
    }

    return [
      "Full Gym Access",
      "Locker Facility",
      "Fitness Assessment",
      "Free Wi-Fi",
    ];
  };

  return (
    <section
      id="plans-view"
      className="bg-zinc-950 text-white min-h-screen py-20"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full mb-4">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-xs tracking-widest text-amber-500">
              EXCELLENCE GUARANTEED
            </span>
          </div>

          <h1 className="text-5xl font-black mb-4">
            CHOOSE YOUR{" "}
            <span className="text-amber-500">MEMBERSHIP</span>
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto">
            Select the membership plan that fits your fitness goals.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20">
            <RefreshCw className="h-10 w-10 animate-spin text-amber-500 mb-4" />
            <p className="text-zinc-400">
              Loading membership plans...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto mb-10 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3">
            <AlertCircle className="text-red-500 h-5 w-5 mt-1" />
            <div>
              <p className="font-bold">Connection Error</p>
              <p className="text-sm text-zinc-400">{error}</p>
            </div>
          </div>
        )}

        {/* Plans */}
        {!loading && plans.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const features = getPlanFeatures(plan.planName);
              const isAnnual =
                plan.planName.toLowerCase() === "annual";

              return (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  className={`rounded-3xl p-8 border bg-zinc-900 relative ${
                    isAnnual
                      ? "border-amber-500 ring-1 ring-amber-500/30"
                      : "border-zinc-800"
                  }`}
                >
                  {isAnnual && (
                    <span className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      BEST VALUE
                    </span>
                  )}

                  <p className="text-zinc-400 uppercase text-xs tracking-wider">
                    {plan.duration}
                  </p>

                  <h2 className="text-3xl font-black mt-2 mb-4">
                    {plan.planName}
                  </h2>

                  <div className="mb-6">
                    <span className="text-5xl font-black">
                      ₹{Number(plan.price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <Check className="h-5 w-5 text-amber-500 shrink-0" />
                        <span className="text-zinc-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() =>
                      handleSelectPlan(plan.planName)
                    }
                    className={`w-full py-4 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                      isAnnual
                        ? "bg-amber-500 text-black hover:bg-amber-600"
                        : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  >
                    <Dumbbell className="h-4 w-4" />
                    Select Plan
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}