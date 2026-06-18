import React, { useState } from "react";
import { Dumbbell, Menu, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  planPreselected?: string;
  setPlanPreselected?: (p: string | undefined) => void;
}

export default function Navbar({ currentTab, setCurrentTab, planPreselected, setPlanPreselected }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "plans", label: "Plans" },
    { id: "register", label: "Register" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact" },
    { id: "admin", label: "Admin Panel", icon: ShieldAlert },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    if (tabId !== 'register' && setPlanPreselected) {
      setPlanPreselected(undefined);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 border-b border-zinc-800 backdrop-blur-md" id="app-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick("home")}
            id="navbar-logo-container"
          >
            <div className="bg-amber-500 text-zinc-950 p-2.5 rounded-lg font-bold group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Dumbbell className="h-5 w-5 rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-wider text-white uppercase block">
                Arnold<span className="text-amber-500">Gym</span>
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-400 block uppercase">
                Build Your Legacy
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1" id="desktop-nav-links">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 font-display text-sm font-bold tracking-wider uppercase transition-colors duration-300 rounded-md flex items-center space-x-1.5 ${
                    isActive 
                      ? "text-amber-500" 
                      : item.id === 'admin' 
                        ? "text-zinc-400 hover:text-rose-400" 
                        : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-2"
            id="mobile-drawer-menu"
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-display text-sm font-bold uppercase tracking-widest flex items-center space-x-3 transition-all ${
                    isActive 
                      ? "bg-amber-500 text-zinc-950 shadow-[0_4px_12px_rgba(245,158,11,0.2)]" 
                      : item.id === 'admin'
                        ? "text-zinc-400 hover:text-rose-400 bg-zinc-900/40 border border-rose-950/20"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  {Icon && <Icon className={`h-4 w-4 ${isActive ? "text-zinc-950" : ""}`} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
