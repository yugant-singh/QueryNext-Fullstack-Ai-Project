import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import heroBg from "../../../assets/hero.png";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-1 { animation: fadeUp 0.7s ease forwards 0.1s; opacity: 0; }
        .fade-2 { animation: fadeUp 0.7s ease forwards 0.25s; opacity: 0; }
        .fade-3 { animation: fadeUp 0.7s ease forwards 0.4s; opacity: 0; }
        .fade-4 { animation: fadeUp 0.7s ease forwards 0.55s; opacity: 0; }

        .btn-primary {
          background: linear-gradient(135deg, #6C63FF, #3B82F6);
          box-shadow: 0 0 24px rgba(108,99,255,0.4);
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:active { transform: scale(0.97); }

        .btn-secondary {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.2s, transform 0.15s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

        .navbar-glass {
          background: rgba(8,8,16,0.88);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      <div className="bg-[#080810] min-h-screen text-white overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "navbar-glass" : ""}`}>
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">

            {/* Logo — same as Dashboard */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                  <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 11h6M11 8v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span
                className="text-xl font-extrabold tracking-tight"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: "linear-gradient(135deg, #fff 40%, #6C63FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                QueryNext
              </span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => navigate("/login")}
                className="btn-secondary px-4 py-2 rounded-xl text-sm font-medium text-slate-400 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
              >
                Sign Up
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-24 pb-16 overflow-hidden">

          {/* Background Image */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Dark overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to bottom, rgba(8,8,16,0.65) 0%, rgba(8,8,16,0.5) 50%, rgba(8,8,16,0.92) 100%)",
            }}
          />

          {/* Purple tint */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, rgba(108,99,255,0.12) 0%, transparent 60%)",
            }}
          />

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center">

            {/* Badge */}
            <div
              className="fade-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7"
              style={{
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.28)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block animate-pulse" />
              <span className="text-xs font-medium tracking-wide" style={{ color: "#a5a0ff" }}>
                AI-Powered Search · Groq + Tavily
              </span>
            </div>

            {/* Heading — Syne font like Dashboard */}
            <h1
              className="fade-2 font-extrabold leading-tight mb-5"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                maxWidth: 780,
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{
                background: "linear-gradient(135deg, #ffffff 30%, #c4c0ff 65%, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Ask Anything.
              </span>
              <br />
              <span style={{
                background: "linear-gradient(135deg, #a5a0ff 20%, #60a5fa 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Get Real Answers.
              </span>
            </h1>

            {/* Subheading — DM Sans like Dashboard */}
            <p
              className="fade-3 font-light leading-relaxed mb-10"
              style={{
                color: "#94A3B8",
                fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                maxWidth: 480,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              QueryNest searches the web, reasons through complexity,
              and delivers clear answers — with sources, always.
            </p>

            {/* CTA Buttons */}
            <div className="fade-4 flex flex-wrap items-center justify-center gap-3 mb-10">
              <button
                onClick={() => navigate("/register")}
                className="btn-primary px-6 py-3 rounded-xl text-sm font-medium text-white border-none cursor-pointer"
              >
                Get Started Free →
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn-secondary px-6 py-3 rounded-xl text-sm font-medium text-slate-300 cursor-pointer"
              >
                Sign In
              </button>
            </div>

            {/* Feature pills */}
            <div className="fade-4 flex flex-wrap justify-center gap-2">
              {["⚡ Groq LLM", "🔍 Real-time Search", "🖼️ Image Generation", "🔒 Secure Auth","📎 Upload File"].map((item) => (
                <span
                  key={item}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(8,8,16,0.6)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#FBFBFF",
                    backdropFilter: "blur(8px)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-25">
            <span className="text-xs" style={{ color: "#FBFBFF" }}>scroll</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="text-center py-8 px-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.5" />
                <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span
              className="font-extrabold text-sm"
              style={{
                fontFamily: "'Syne', sans-serif",
                  background: "linear-gradient(135deg, #fff 40%, #6C63FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
              }}
            >
              QueryNext
            </span>
          </div>
          <p className="text-xs" style={{ color: "#E6E4FF", fontFamily: "'DM Sans', sans-serif" }}>
            © {new Date().getFullYear()} QueryNext. Built with ❤️ by Yugant.
          </p>
        </footer>

      </div>
    </>
  );
}
