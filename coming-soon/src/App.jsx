import { useState, useEffect, useRef } from "react";

const LAUNCH_DATE = new Date("2026-05-10T00:00:00");

function useCountdown(target) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function Orb({ style }) {
  return <div style={style} />;
}

function Particle({ x, y, size, delay, duration }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(37,99,235,0.18)",
        animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

function CountBlock({ value, label }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => { setPrev(value); setFlip(false); }, 300);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        position: "relative",
        width: "clamp(72px, 14vw, 110px)",
        height: "clamp(72px, 14vw, 110px)",
        background: "#FFFFFF",
        border: "1.5px solid #E4E4E7",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(37,99,235,0.06)",
        overflow: "hidden",
      }}>
        <span style={{
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontSize: "clamp(28px, 6vw, 48px)",
          fontWeight: 600,
          color: "#18181B",
          letterSpacing: "-2px",
          transform: flip ? "translateY(-10px)" : "translateY(0)",
          opacity: flip ? 0 : 1,
          transition: "transform 0.28s ease, opacity 0.28s ease",
          display: "block",
        }}>
          {String(value).padStart(2, "0")}
        </span>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(37,99,235,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
      </div>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#A1A1AA",
      }}>{label}</span>
    </div>
  );
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: `${4 + Math.random() * 6}px`,
  delay: Math.random() * 6,
  duration: 6 + Math.random() * 8,
}));

export default function App() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; min-height: 100vh; overflow-x: hidden; }
        #root { width: 100%; min-height: 100vh; display: flex; flex-direction: column; }

        @keyframes floatUp {
          0%   { transform: translateY(0px) scale(1);   opacity: 0.15; }
          50%  { transform: translateY(-40px) scale(1.2); opacity: 0.35; }
          100% { transform: translateY(0px) scale(1);   opacity: 0.15; }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(40px,-30px) scale(1.08); }
          66%     { transform: translate(-20px,20px) scale(0.94); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(-50px,25px) scale(1.12); }
          70%     { transform: translate(30px,-15px) scale(0.96); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(20px,40px) scale(1.06); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes spinDash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.7; }
          100% { transform: scale(1.08); opacity: 0; }
        }
        .cs-btn {
          background: #2563EB;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0 28px;
          height: 48px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }
        .cs-btn:hover { background: #1D4ED8; transform: translateY(-1px); }
        .cs-btn:active { transform: translateY(0px); }
        .cs-input {
          flex: 1;
          min-width: 0;
          height: 48px;
          border: 1.5px solid #E4E4E7;
          border-radius: 10px;
          padding: 0 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #18181B;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cs-input::placeholder { color: #A1A1AA; }
        .cs-input:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #DBEAFE;
          color: #1D4ED8;
          border-radius: 100px;
          padding: 5px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #2563EB;
          animation: pulse-ring 1.2s ease-out infinite;
        }
        .social-btn {
          width: 40px; height: 40px;
          border-radius: 10px;
          border: 1.5px solid #E4E4E7;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s, transform 0.12s;
          text-decoration: none;
        }
        .social-btn:hover {
          border-color: #2563EB;
          background: #DBEAFE;
          transform: translateY(-2px);
        }
        .ring-svg { animation: orb3 10s ease-in-out infinite; }

        html, body, #root {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
      `}</style>

      {/* ── Root ── */}
      <div
        style={{
          width: "100vw",
          minHeight: "100vh",
          background: "#F7F7F8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
          padding: "40px 20px",
          boxSizing: "border-box",
        }}
      >
        {/* ── Background Orbs ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <Orb
            style={{
              position: "absolute",
              top: "-12%",
              left: "-8%",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)",
              animation: "orb1 14s ease-in-out infinite",
              filter: "blur(1px)",
            }}
          />
          <Orb
            style={{
              position: "absolute",
              bottom: "-15%",
              right: "-10%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)",
              animation: "orb2 18s ease-in-out infinite",
              filter: "blur(1px)",
            }}
          />
          <Orb
            style={{
              position: "absolute",
              top: "40%",
              right: "15%",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(219,234,254,0.6) 0%, transparent 70%)",
              animation: "orb3 10s ease-in-out infinite",
            }}
          />
          {PARTICLES.map((p, i) => (
            <Particle key={i} {...p} />
          ))}
        </div>

        {/* ── Grid Lines ── */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.3,
            pointerEvents: "none",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#E4E4E7"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative Rings — now floating freely on the page */}
        <div
          style={{
            position: "absolute",
            top: "6%",
            right: "8%",
            width: 200,
            height: 200,
            opacity: 0.5,
            animation: "orb1 9s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <svg
            viewBox="0 0 180 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="90"
              cy="90"
              r="80"
              stroke="#2563EB"
              strokeWidth="1"
              strokeDasharray="6 8"
              opacity="0.4"
            />
            <circle
              cx="90"
              cy="90"
              r="60"
              stroke="#60A5FA"
              strokeWidth="0.5"
              strokeDasharray="3 10"
              opacity="0.3"
            />
            <circle
              cx="90"
              cy="90"
              r="40"
              stroke="#2563EB"
              strokeWidth="0.5"
              opacity="0.15"
            />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: "5%",
            width: 160,
            height: 160,
            opacity: 0.4,
            animation: "orb2 12s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <svg
            viewBox="0 0 140 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="70"
              cy="70"
              r="62"
              stroke="#2563EB"
              strokeWidth="1"
              strokeDasharray="4 12"
              opacity="0.35"
            />
            <circle
              cx="70"
              cy="70"
              r="44"
              stroke="#93C5FD"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* ── Content (no card) ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 680,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "clamp(36px, 8vw, 60px) clamp(28px, 8vw, 60px)",
          }}
        >
          {/* Tag */}
          <div
            style={{
              animation: "fadeUp 0.6s ease both",
              animationDelay: "0.05s",
              marginBottom: 28,
            }}
          >
            <div className="tag">
              <div className="tag-dot" />
              Coming Soon
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              animation: "fadeUp 0.7s ease both",
              animationDelay: "0.15s",
              textAlign: "center",
              marginBottom: 18,
            }}
          >
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(36px, 8vw, 64px)",
                fontWeight: 400,
                color: "#18181B",
                lineHeight: 1.08,
                letterSpacing: "-1.5px",
                margin: 0,
              }}
            >
              Something{" "}
              <span
                style={{
                  fontStyle: "italic",
                  background:
                    "linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                extraordinary
              </span>
              <br />
              is on its way.
            </h1>
          </div>

          {/* Sub */}
          <div
            style={{
              animation: "fadeUp 0.7s ease both",
              animationDelay: "0.25s",
              textAlign: "center",
              marginBottom: 44,
            }}
          >
            <p
              style={{
                fontSize: 17,
                color: "#52525B",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: 460,
              }}
            >
              We're crafting an experience you won't forget. Leave your email
              below and be the very first to know when we launch.
            </p>
          </div>

          {/* Countdown */}
          <div
            style={{
              animation: "fadeUp 0.7s ease both",
              animationDelay: "0.35s",
              marginBottom: 48,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "clamp(10px, 3vw, 24px)",
                alignItems: "center",
                justifyContent: "center", // ✅ centers horizontally
                width: "100%",
              }}
            >
              <CountBlock value={days} label="Days" />
              <div
                style={{
                  fontSize: "clamp(28px,6vw,48px)",
                  fontFamily: "'DM Mono', monospace",
                  color: "#D4D4D8",
                  marginTop: 14,
                  fontWeight: 300,
                }}
              >
                :
              </div>
              <CountBlock value={hours} label="Hours" />
              <div
                style={{
                  fontSize: "clamp(28px,6vw,48px)",
                  fontFamily: "'DM Mono', monospace",
                  color: "#D4D4D8",
                  marginTop: 14,
                  fontWeight: 300,
                }}
              >
                :
              </div>
              <CountBlock value={minutes} label="Minutes" />
              <div
                style={{
                  fontSize: "clamp(28px,6vw,48px)",
                  fontFamily: "'DM Mono', monospace",
                  color: "#D4D4D8",
                  marginTop: 14,
                  fontWeight: 300,
                }}
              >
                :
              </div>
              <CountBlock value={seconds} label="Seconds" />
            </div>
          </div>

          {/* Email form */}
          <div
            style={{
              animation: "fadeUp 0.7s ease both",
              animationDelay: "0.45s",
              width: "100%",
              maxWidth: 480,
              marginBottom: 36,
            }}
          >
            {status === "done" ? (
              <div
                style={{
                  background: "#F0FDF4",
                  border: "1.5px solid #86EFAC",
                  borderRadius: 12,
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="11" fill="#22C55E" />
                  <path
                    d="M6.5 11.5l3 3 6-6"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 500,
                      color: "#166534",
                      fontSize: 15,
                    }}
                  >
                    You're on the list!
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#15803D",
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    We'll notify you the moment we launch.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", gap: 10 }}
              >
                <input
                  ref={inputRef}
                  className="cs-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  className="cs-btn"
                  type="submit"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{
                        animation: "spin 0.8s linear infinite",
                        display: "block",
                      }}
                    >
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      <circle
                        cx="10"
                        cy="10"
                        r="7"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M10 3a7 7 0 0 1 7 7"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    "Notify Me →"
                  )}
                </button>
              </form>
            )}
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 12,
                color: "#A1A1AA",
                textAlign: "center",
              }}
            >
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              animation: "fadeUp 0.7s ease both",
              animationDelay: "0.55s",
              width: "100%",
              maxWidth: 480,
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#E4E4E7" }} />
            <span
              style={{
                fontSize: 12,
                color: "#A1A1AA",
                letterSpacing: "0.08em",
              }}
            >
              or follow along
            </span>
            <div style={{ flex: 1, height: 1, background: "#E4E4E7" }} />
          </div>

          {/* Social icons */}
          <div
            style={{
              animation: "fadeUp 0.7s ease both",
              animationDelay: "0.6s",
              display: "flex",
              gap: 10,
            }}
          >
            {[
              {
                label: "X / Twitter",
                url: "https://x.com/binaykumardas96",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      fill="#52525B"
                    />
                  </svg>
                ),
              },
              {
                label: "LinkedIn",
                url: "https://www.linkedin.com/in/binaykumardas",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="4"
                      stroke="#52525B"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"
                      stroke="#52525B"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                label: "GitHub",
                url: "https://github.com/binaykumardas",
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.004 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
                      fill="#52525B"
                    />
                  </svg>
                ),
              },
            ].map(({ label, icon, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                title={label}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Footer brand */}
          <div
            style={{
              animation: "fadeUp 0.7s ease both",
              animationDelay: "0.7s",
              marginTop: 40,
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1L13 7L7 13M1 7h12"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 18,
                  color: "#18181B",
                  letterSpacing: "-0.3px",
                }}
              >
                findcoffeemate
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "#A1A1AA" }}>
              © 2026 findcoffeemate. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}