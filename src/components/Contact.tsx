import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg("All contact form fields are required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to post inquiry. Please try again.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An issue occurred connecting to server database.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="contact-view" className="bg-zinc-950 text-white py-20 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-500 text-xs font-mono tracking-widest uppercase mb-4">
            <Mail className="h-3.5 w-3.5" />
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight text-white mb-4">
            CONTACT <span className="text-amber-500">THE HEAVY TEMPLE</span>
          </h1>
          <div className="w-20 h-1.5 bg-amber-500 mx-auto rounded-full mb-6" />
          <p className="font-sans text-zinc-400 text-lg leading-relaxed">
            Need information regarding corporate discounts, specific trainer schedules, or locker lists? Leave us a real-time message synced directly to the cluster.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Grid Details & Map */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            
            <div className="space-y-6 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-lg">
              <h3 className="font-display font-black text-xl text-white uppercase tracking-wider mb-2">
                Clubs <span className="text-amber-500">Coordinates</span>
              </h3>

              <div className="space-y-5">
                {/* Location item */}
                <div className="flex items-start space-x-4">
                  <div className="bg-zinc-800 text-amber-500 p-3 rounded-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500">FACILITY ADDRESS</span>
                    <span className="block font-sans text-sm text-zinc-200 mt-1">
                      360 Hampton Drive, Venice Beach, CA 90291
                    </span>
                  </div>
                </div>

                {/* Hours item */}
                <div className="flex items-start space-x-4">
                  <div className="bg-zinc-800 text-amber-500 p-3 rounded-xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500">CLUB HOURS</span>
                    <span className="block font-sans text-sm text-zinc-200 mt-1">
                      Monday - Friday: 24 Hours Open
                    </span>
                    <span className="block font-sans text-xs text-zinc-400 mt-0.5">
                      Saturday - Sunday: 5:00 AM - 10:00 PM
                    </span>
                  </div>
                </div>

                {/* Telephone item */}
                <div className="flex items-start space-x-4">
                  <div className="bg-zinc-800 text-amber-500 p-3 rounded-xl">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500">TELEPHONE LINE</span>
                    <span className="block font-sans text-sm text-zinc-200 mt-1 font-semibold">
                      +1 (310) 392-6000
                    </span>
                  </div>
                </div>

                {/* Email item */}
                <div className="flex items-start space-x-4">
                  <div className="bg-zinc-800 text-amber-500 p-3 rounded-xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500">SUPPORT ADDRESS</span>
                    <span className="block font-sans text-sm text-zinc-200 mt-1 text-amber-500 font-medium">
                      master@arnoldgym.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aesthetic SVG Map Representation Of Venice Beach */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden h-60 flex flex-col justify-between shadow-lg">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg viewBox="0 0 400 200" className="w-full h-full text-zinc-500" fill="none" stroke="currentColor">
                  {/* Grid Lines representing streets */}
                  <line x1="50" y1="0" x2="50" y2="200" strokeWidth="1" />
                  <line x1="100" y1="0" x2="100" y2="200" strokeWidth="1" />
                  <line x1="150" y1="0" x2="150" y2="200" strokeWidth="1" />
                  <line x1="200" y1="0" x2="200" y2="200" strokeWidth="1" />
                  <line x1="250" y1="0" x2="250" y2="200" strokeWidth="1" />
                  <line x1="300" y1="0" x2="300" y2="200" strokeWidth="1" strokeDasharray="3,3" />
                  {/* Pacific Ocean shoreline diagonal */}
                  <path d="M 0 160 Q 150 150 300 70 T 400 0" strokeWidth="2" stroke="currentColor" />
                  <text x="40" y="180" className="font-mono text-[8px] fill-zinc-600">PACIFIC OCEAN</text>
                  <text x="310" y="120" className="font-mono text-[8px] fill-zinc-650">ABBOT KINNEY</text>
                  <line x1="0" y1="120" x2="400" y2="40" strokeWidth="1.5" strokeDasharray="5,5" />
                </svg>
              </div>

              {/* Pin marker */}
              <div className="relative z-10 flex items-center space-x-3 bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl backdrop-blur-sm self-start m-1">
                <div className="bg-amber-500 text-zinc-950 p-1.5 rounded-lg">
                  <MapPin className="h-4 w-4 animate-bounce" />
                </div>
                <div>
                  <span className="font-display font-bold text-xs uppercase text-white block">ARNOLD GYM VENICE</span>
                  <span className="font-mono text-[9px] text-amber-500">Hampton Dr / Rose Ave</span>
                </div>
              </div>

              <div className="relative z-10">
                <span className="font-sans text-[10px] text-zinc-400 block leading-snug">
                  * Located exactly 2 blocks from the sand boardwalk. Standard street parking or bike racks available directly on Hampton Drive.
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {!success ? (
                /* INQUIRY FORM */
                <motion.div
                  key="contact-form-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                    SEND A <span className="text-amber-500">MESSAGE</span>
                  </h3>
                  <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest mt-1">
                    Your inquiries are monitored and actioned daily by club staff
                  </p>
                  
                  <div className="h-px bg-zinc-800 my-6" />

                  {errorMsg && (
                    <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs mb-6 flex items-center space-x-2" id="contact-error">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div>
                        <label className="block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Smith"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans text-white placeholder-zinc-700"
                          required
                          id="contact-input-name"
                        />
                      </div>

                      {/* Email input */}
                      <div>
                        <label className="block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          Your Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john.smith@gmail.com"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans text-white placeholder-zinc-700"
                          required
                          id="contact-input-email"
                        />
                      </div>
                    </div>

                    {/* Subject input */}
                    <div>
                      <label className="block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Message Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Corporate Rate Inquiry"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans text-white placeholder-zinc-700"
                        required
                        id="contact-input-subject"
                      />
                    </div>

                    {/* Message textarea */}
                    <div>
                      <label className="block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Inquiry Message Content
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your dynamic message here..."
                        rows={5}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans text-white placeholder-zinc-700"
                        required
                        id="contact-input-message"
                      />
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      id="btn-contact-submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] disabled:opacity-50 flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                    >
                      <span>SUBMIT INQUIRY</span>
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* INQUIRY SUCCESS PANEL */
                <motion.div
                  key="contact-success-block"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col justify-center items-center text-center py-16"
                  id="contact-success-panel"
                >
                  <div className="bg-amber-500 text-zinc-950 w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                    MESSAGE <span className="text-amber-500">STORED</span>
                  </h3>
                  <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest mt-1">
                    Inquiry database syncing complete
                  </p>
                  
                  <p className="font-sans text-sm text-zinc-400 leading-relaxed max-w-md mx-auto my-6">
                    Thank you! Your contact inquiry has been successfully deposited into Arnold Gym's backend collection. Admins can view and respond directly from the admin management cockpit.
                  </p>

                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-6 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
