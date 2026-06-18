import React from "react";
import { Users, ShieldCheck, Heart, Star, Dumbbell, Award, Flame } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const trainers = [
    {
      name: "Marcus Vance",
      title: "Head Bodybuilding Coach",
      quote: "Success in the iron game isn't about genetics. It is about standard effort, mechanical precision, and consistency.",
      specialties: ["Classic Physique Prep", "High-Intensity Training", "Hypertrophy Mechanics"],
      image: "https://picsum.photos/seed/marcusv/350/450",
    },
    {
      name: "Elena Rostova",
      title: "Strength & Olympic Specialist",
      quote: "The iron barbell always tells you the absolute truth. Master structural form first, and velocity will reward you.",
      specialties: ["Olympic Weightlifting", "Functional Mobility", "Active Conditioning"],
      image: "https://picsum.photos/seed/elenar/350/450",
    },
    {
      name: "Viktor Drake",
      title: "Master Powerlifter",
      quote: "Central nervous system preparation is paramount. Squat, bench, and deadlift build the core foundation of durability.",
      specialties: ["Powerlifting Prep", "Max Strength Periodization", "Nervous System Recruiting"],
      image: "https://picsum.photos/seed/viktord/350/450",
    },
  ];

  const highlights = [
    {
      icon: Flame,
      title: "THE LEGACYPHILOSOPHY",
      desc: "Inspired by the golden era of bodybuilding, we embrace heavy plateloaded equipment, classic dumbbell lines, and intense work. We reject modern gym chains that focus more on smart screens than real effort.",
    },
    {
      icon: Dumbbell,
      title: "PLATETOUR OVERVIEW",
      desc: "Featuring premium Hammer Strength, custom dumbbell bars ranging from 5 lbs up to 150 lbs, professional Eleiko weightlifting platforms, and heavy-gauge power racks for deep safety.",
    },
  ];

  return (
    <div id="about-view" className="bg-zinc-950 text-white py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-500 text-xs font-mono tracking-widest uppercase mb-4">
            <Users className="h-3.5 w-3.5" />
            <span>OUR LEGACY & STAFF</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight text-white mb-4">
            ABOUT <span className="text-amber-500">ARNOLD GYM</span>
          </h1>
          <div className="w-20 h-1.5 bg-amber-500 mx-auto rounded-full mb-6" />
          <p className="font-sans text-zinc-400 text-lg leading-relaxed">
            Since 1982, Arnold Gym has stood as the premier sanctuary for athletes, bodybuilders, and powerlifters looking to develop genuine strength and aesthetics.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24" id="philosophy-highlights">
          
          <div className="space-y-6">
            <h2 className="font-display font-black text-2xl md:text-3xl uppercase tracking-wide text-white">
              BUILT FOR THOSE WHO <span className="text-amber-500">RESIST COMPLACENCY</span>
            </h2>
            <p className="font-sans text-sm text-zinc-300 leading-relaxed">
              In an era dominated by luxury health clubs with juice bars and zero focus on actual results, Arnold Gym keeps the flame of high-intensity bodybuilding alive. Our facility was founded by bodybuilding enthusiasts to be an intense, welcoming, and high-productivity strength temple.
            </p>
            <p className="font-sans text-sm text-zinc-400 leading-relaxed">
              We focus on absolute performance, muscle mechanical alignment, and progressive overload. Whether you are prepping for a global classic physique competition or starting your very first powerlifting program, you sit as an equal at our racks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl">
                    <div className="text-amber-500 mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-white uppercase mb-2 tracking-wide">
                      {h.title}
                    </h4>
                    <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Graphic Side */}
          <div className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video lg:aspect-square flex items-center justify-center">
            <img
              src="https://picsum.photos/seed/legacygym/800/800?blur=1"
              alt="Heavy Duty Plate Loaded Chest Press"
              className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="font-mono text-amber-500 text-xs tracking-widest uppercase block mb-1">
                ESTABLISHED 1982
              </span>
              <span className="font-display font-black text-white text-2xl uppercase block">
                VENICE BEACH, CALIFORNIA
              </span>
            </div>
          </div>

        </div>

        {/* Trainers Sub-section */}
        <div className="pt-8" id="trainers-profiles">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl uppercase tracking-tight text-white">
              ELITE <span className="text-amber-500">COACHING STAFF</span>
            </h2>
            <p className="font-sans text-sm text-zinc-400 mt-2">
              Our trainers possess verified sports sciences credentials, combined with real-world championship pedigrees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <motion.div
                key={index}
                id={`trainer-card-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Trainer Image */}
                <div className="relative h-80 bg-zinc-950 overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-amber-500 text-zinc-950 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                      {trainer.title}
                    </span>
                  </div>
                </div>

                {/* Trainer Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-black text-xl text-white uppercase tracking-wide">
                      {trainer.name}
                    </h3>

                    {/* specialties */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {trainer.specialties.map((spec, sidx) => (
                        <span
                          key={sidx}
                          className="bg-zinc-800 border border-zinc-700/50 text-zinc-400 font-mono text-[9px] px-2 py-0.5 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Motivational Quote */}
                  <div className="border-t border-zinc-800 pt-4">
                    <p className="font-sans text-xs text-zinc-400 italic leading-relaxed">
                      “{trainer.quote}”
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
