import React from "react";
import { ShieldCheck, Dumbbell, Trophy, Zap, ArrowRight, Activity, Award } from "lucide-react";
import { motion } from "motion/react";
// @ts-ignore
import heroImg from "../assets/images/arnold_gym_hero_1781618372397.jpg";

interface HomeProps {
  setCurrentTab: (tab: string) => void;
}

export default function Home({ setCurrentTab }: HomeProps) {
  const stats = [
    { value: "40+", label: "Power Racks" },
    { value: "15 Tons", label: "Free Weights" },
    { value: "Est. 1982", label: "Bodybuilding Legacy" },
    { value: "24/7", label: "Elite Club Access" },
  ];

  const highlights = [
    {
      icon: Trophy,
      title: "Championship Environment",
      desc: "Train where Mr. Olympia winners and world-class powerlifters built their names. Focus, high energy, zero fluff.",
    },
    {
      icon: Dumbbell,
      title: "Gold-Standard Equipment",
      desc: "Packed with Hammer Strength®, Eleiko olympic platforms, and bespoke plateloaded machines for genuine muscular tension.",
    },
    {
      icon: Zap,
      title: "No-Excuses Culture",
      desc: "No talking over equipment, no filters, no judgment. Just pure bodybuilding execution and mutual iron motivation.",
    },
    {
      icon: ShieldCheck,
      title: "Recovery Studio Included",
      desc: "Recharge your physical system with our modern post-workout protein shake bar, cold plunges, and sports massage.",
    },
  ];

  return (
    <div id="home-view" className="bg-zinc-950 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-zinc-800">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Arnold Gym Heavy Metal Weights Floor"
            className="w-full h-full object-cover object-center scale-105"
            referrerPolicy="no-referrer"
            id="hero-background-image"
          />
          {/* Multi-layered radial/linear gradients for rich dark feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950/20" />
          <div className="absolute inset-0 bg-zinc-950/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-500 text-xs font-mono tracking-widest uppercase mb-2">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>THE IRON TEMPLE OF Venice Beach</span>
            </div>

            {/* Main Header */}
            <h1 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter text-white leading-none">
              BUILD YOUR <span className="text-amber-500 block sm:inline">LEGACY</span>
            </h1>

            {/* Intro paragraph */}
            <p className="max-w-2xl mx-auto text-zinc-300 font-sans text-lg md:text-xl font-light leading-relaxed">
              We don't do short-cuts. We don't do luxury wellness gimmicks. At <span className="text-white font-medium">Arnold Gym</span>, we build strength, durability, and standard-setting athletic physical structures.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentTab("register")}
                id="btn-register-hero"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 px-8 py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.6)] flex items-center justify-center space-x-2 border border-amber-400/20 cursor-pointer"
              >
                <span>Join The Temple</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setCurrentTab("plans")}
                id="btn-plans-hero"
                className="w-full sm:w-auto bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-zinc-500 px-8 py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                Explore Plans
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Highlight Bar */}
      <div className="bg-zinc-950 py-12 border-b border-zinc-900" id="gym-stats-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center" id={`stat-${idx}`}>
                <span className="block font-mono text-4xl md:text-5xl font-black text-amber-500 tracking-tight">
                  {stat.value}
                </span>
                <span className="block font-display text-xs uppercase tracking-widest text-zinc-400 mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" id="gym-benefits-section">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-white">
            THE ARNOLD <span className="text-amber-500">DIFFERENCE</span>
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 mb-6 rounded-full" />
          <p className="font-sans text-zinc-400 text-lg">
            Unlike standard commercial franchises, we possess a dedicated vision: to provide the ultimate physical, technical, and mental atmosphere to build authentic athletic limits.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                id={`benefit-card-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl hover:border-amber-500/40 hover:bg-zinc-900 transition-all duration-300 group"
              >
                <div className="bg-zinc-800 text-amber-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all duration-300 shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-500 transition-colors uppercase tracking-wide mb-3">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
