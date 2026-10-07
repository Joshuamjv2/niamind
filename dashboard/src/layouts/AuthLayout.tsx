import React from "react";
import { HeartHandshake } from "lucide-react";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hides the scrollbar track while keeping scroll behaviour */}
      <style>{`.niamind-auth::-webkit-scrollbar { display: none; }`}</style>

      <div
        className="niamind-auth h-screen overflow-auto bg-niamind-bg sm:p-6 md:p-12 xl:px-16"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        <div className="min-h-full flex">

          {/* ── LEFT ────────────────────────────────────────────── */}
          <div className="hidden lg:flex w-[50%]">
            <div className="flex flex-col w-full pr-10 py-4">

              {/* Logo — anchored at the top */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-9 w-9 rounded-xl bg-niamind-teal flex items-center justify-center shadow-sm">
                  <HeartHandshake className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-niamind-navy">
                  Niamind
                </span>
              </div>

              {/* Copy — flex-1 + items-center centres it in the space between logo and footer */}
              <div className="flex-1 flex items-center">
                <div className="max-w-[500px]">
                  <p className="inline-flex items-center gap-2 text-sm font-bold text-niamind-teal bg-white border border-niamind-border px-4 py-2 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-niamind-gold" />
                    Support for everyone, by everyone.
                  </p>
                  <h1 className="mt-5 text-[45px] leading-[1.15] font-extrabold tracking-tight text-niamind-navy">
                    Support that feels safe,
                    <br />
                    calm, and human.
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-niamind-muted">
                    Access trusted professionals and supportive care built
                    around empathy, dignity, and real connection.
                  </p>
                </div>
              </div>

              {/* Footer — anchored at the bottom */}
              <div className="pt-6 flex w-full justify-between items-end shrink-0">
                <div className="flex flex-col gap-2 items-start">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-xl bg-niamind-teal flex items-center justify-center shadow-sm">
                      <HeartHandshake className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-niamind-navy">
                      Niamind
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-niamind-muted">
                    <button className="hover:text-niamind-gold transition">About</button>
                    <button className="hover:text-niamind-gold transition">Terms</button>
                    <button className="hover:text-niamind-gold transition">Privacy Policy</button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 text-niamind-muted">
                    <FaTwitter className="hover:text-niamind-gold transition cursor-pointer" />
                    <FaInstagram className="hover:text-niamind-gold transition cursor-pointer" />
                    <FaFacebook className="hover:text-niamind-gold transition cursor-pointer" />
                    <FaLinkedin className="hover:text-niamind-gold transition cursor-pointer" />
                  </div>
                  <p className="mt-3 text-xs text-niamind-muted font-medium">
                    © {new Date().getFullYear()} <span className="hover:opacity-70 transition text-niamind-gold">Niamind</span>. All rights reserved.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT ───────────────────────────────────────────── */}
          {/* Updated background with gradients similar to landing page */}
          <div className="flex-1 flex flex-col lg:items-center lg:justify-center rounded-xl shadow-sm relative overflow-hidden">
            
            {/* Background gradients - matching landing page aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-niamind-bg to-niamind-bg" />
            <div className="absolute -top-[2rem] -right-[2rem] w-60 h-60 bg-niamind-teal/5 rounded-full blur-[60px]" />
            <div className="absolute -bottom-[2rem] -left-[2rem] w-60 h-60 bg-niamind-teal/5 rounded-full blur-[60px]" />
            <div className="absolute -bottom-[2rem] -right-[2rem] w-60 h-60 bg-niamind-gold/5 rounded-full blur-[60px]" />
            <div className="absolute -top-[2rem] -left-[2rem] w-60 h-60 bg-niamind-gold/5 rounded-full blur-[60px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-niamind-navy/5 rounded-full blur-3xl" />
            
            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-niamind-border/50" />

            {/* Mobile header */}
            <div className="relative z-10 lg:hidden bg-white/80 backdrop-blur-sm border-b border-niamind-border/50 px-5 pt-5 pb-3 shrink-0 w-full">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-niamind-teal flex items-center justify-center shadow-sm">
                    <HeartHandshake className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-extrabold text-lg tracking-tight text-niamind-navy">
                    Niamind
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm font-medium mb-2 italic text-niamind-muted text-center">
                  Support for everyone, {" "}
                  <span className="text-niamind-gold font-semibold">by everyone</span>.
                </p>
              </div>
            </div>

            {/* Form area */}
            <div className="relative z-10 flex-1 lg:flex-none w-full flex items-center justify-center px-6 sm:px-12 py-8">
              <div className="w-full max-w-[500px]">
                {/* Optional: Add a subtle card effect for the form container */}
                <div className="backdrop-blur-sm rounded-2xl p-6 lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:shadow-none lg:border-0">
                  {children}
                </div>
              </div>
            </div>

            {/* Mobile footer */}
            <div className="relative z-10 lg:hidden bg-white/80 backdrop-blur-sm border-t border-niamind-border/50 pb-6 pt-3 shrink-0 w-full">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4 text-niamind-muted pt-2">
                  <FaTwitter className="hover:text-niamind-gold transition cursor-pointer" />
                  <FaInstagram className="hover:text-niamind-gold transition cursor-pointer" />
                  <FaFacebook className="hover:text-niamind-gold transition cursor-pointer" />
                  <FaLinkedin className="hover:text-niamind-gold transition cursor-pointer" />
                </div>
                <p className="text-xs text-niamind-muted/80 italic font-semibold">
                  © {new Date().getFullYear()} <span className="hover:opacity-70 transition text-niamind-gold"><a href="/login">Niamind</a></span>. All rights reserved.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}