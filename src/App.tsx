import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Plans from "./components/Plans";
import Register from "./components/Register";
import About from "./components/About";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import { Dumbbell, Instagram, Facebook, Youtube, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [planPreselected, setPlanPreselected] = useState<string | undefined>(undefined);

  // Restore scroll position to top when transitioning tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTab]);

  const renderActiveTab = () => {
    switch (currentTab) {
      case "home":
        return <Home setCurrentTab={setCurrentTab} />;
      case "plans":
        return <Plans setCurrentTab={setCurrentTab} setPlanPreselected={setPlanPreselected} />;
      case "register":
        return (
          <Register
            planPreselected={planPreselected}
            setPlanPreselected={setPlanPreselected}
            setCurrentTab={setCurrentTab}
          />
        );
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "admin":
        return <Admin />;
      default:
        return <Home setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Dynamic Header navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        planPreselected={planPreselected}
        setPlanPreselected={setPlanPreselected}
      />

      {/* Main interactive page viewport with page fade transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Footer with brand lineage */}
      <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-zinc-900 pb-12 mb-8">
            
            {/* Left Box: Logo & Quote */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500 text-zinc-950 p-2 rounded-lg font-bold">
                  <Dumbbell className="h-4 w-4 rotate-45" />
                </div>
                <span className="font-display font-black text-xl tracking-wider uppercase text-white">
                  Arnold<span className="text-amber-500">Gym</span>
                </span>
              </div>
              <p className="font-sans text-xs text-zinc-400 leading-relaxed max-w-sm">
                Dedicated strictly to high-intensity athletic physical conditioning. We provide Eleiko, Hammer Strength, and classical golden-era steel lines.
              </p>
              <div className="flex items-center space-x-3.5 pt-2">
                <a href="#instagram" className="text-zinc-400 hover:text-amber-500 transition-colors" aria-label="Instagram link">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#facebook" className="text-zinc-400 hover:text-amber-500 transition-colors" aria-label="Facebook link">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#youtube" className="text-zinc-400 hover:text-amber-500 transition-colors" aria-label="Youtube link">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Middle Nav Links */}
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-white tracking-widest mb-4">
                Club navigation
              </h4>
              <ul className="space-y-2.5 font-sans text-xs text-zinc-400">
                <li>
                  <button onClick={() => setCurrentTab("home")} className="hover:text-amber-500 transition-colors cursor-pointer">
                    Introduction
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("plans")} className="hover:text-amber-500 transition-colors cursor-pointer">
                    Membership Plans
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("register")} className="hover:text-amber-500 transition-colors cursor-pointer">
                    Registration Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* More info links */}
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-white tracking-widest mb-4">
                The Heritage
              </h4>
              <ul className="space-y-2.5 font-sans text-xs text-zinc-400">
                <li>
                  <button onClick={() => setCurrentTab("about")} className="hover:text-amber-500 transition-colors cursor-pointer">
                    Elite Coaches
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("contact")} className="hover:text-amber-500 transition-colors cursor-pointer">
                    Send Inquiry Letter
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("admin")} className="hover:text-amber-500 transition-colors cursor-pointer text-rose-500/80">
                    Staff Login Cockpit
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter/Motto Box */}
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-white tracking-widest mb-4">
                THE MOTTO
              </h4>
              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl">
                <span className="font-display font-black text-xs text-amber-500 block uppercase mb-1">
                  “The Iron Never Lies.”
                </span>
                <p className="font-sans text-[11px] text-zinc-450 leading-relaxed">
                  200 lbs is always 200 lbs, whether you are having a superb day or an intense challenge. Step in, grab a barbell, and work.
                </p>
              </div>
            </div>

          </div>

          {/* Core copyright footer info */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-4">
            <div className="text-center sm:text-left">
              <span>Arnold Gym Venice Beach © 2026. All Rights Reserved.</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Sync Status:</span>
              <span className="text-emerald-500 font-bold uppercase shrink-0">● ACTIVE CLUSTER LIVE</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
