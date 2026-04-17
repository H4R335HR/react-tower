import { useState, useRef, useEffect, useCallback } from "react";

/* ─── colour constants ─── */
const IMPACT = {
  high:   { ring: "#d4556a", bg: "#faf0f2", badge: "#d4556a" },
  medium: { ring: "#e8a84c", bg: "#fdf6ee", badge: "#e8a84c" },
  low:    { ring: "#94a3c4", bg: "#f3f4f8", badge: "#7b8bb5" },
};
function getImpact(c) { return c > 10 ? "high" : c >= 5 ? "medium" : "low"; }

/* ─── SVG icon library (flat, monochrome purple — matching wireframe) ─── */
const ICONS = {
  smartphone: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="4" width="18" height="32" rx="3" stroke="#5b5fa6" strokeWidth="2"/>
      <line x1="17" y1="8" x2="23" y2="8" stroke="#5b5fa6" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="31" r="2" stroke="#5b5fa6" strokeWidth="1.5"/>
    </svg>
  ),
  pilot: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="14" r="7" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M10 34c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#5b5fa6" strokeWidth="2" fill="#d8c4f0"/>
      <path d="M13 14h14" stroke="#5b5fa6" strokeWidth="1.5"/>
      <rect x="15" y="10" width="10" height="3" rx="1.5" fill="#5b5fa6" opacity="0.3"/>
    </svg>
  ),
  baggage: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="12" width="20" height="22" rx="3" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M15 12V8a3 3 0 013-3h4a3 3 0 013 3v4" stroke="#5b5fa6" strokeWidth="1.5"/>
      <line x1="10" y1="20" x2="30" y2="20" stroke="#5b5fa6" strokeWidth="1.2"/>
      <circle cx="15" cy="36" r="2" fill="#5b5fa6"/>
      <circle cx="25" cy="36" r="2" fill="#5b5fa6"/>
    </svg>
  ),
  airfield: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="6" width="4" height="28" rx="1" fill="#5b5fa6" opacity="0.3"/>
      <circle cx="20" cy="10" r="3" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M8 28h24l-4 6H12l-4-6z" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="13" stroke="#5b5fa6" strokeWidth="1.5" fill="#ddd8f0"/>
      <ellipse cx="20" cy="20" rx="6" ry="13" stroke="#5b5fa6" strokeWidth="1.2"/>
      <line x1="7" y1="20" x2="33" y2="20" stroke="#5b5fa6" strokeWidth="1.2"/>
      <line x1="20" y1="7" x2="20" y2="33" stroke="#5b5fa6" strokeWidth="1.2"/>
    </svg>
  ),
  ramp: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="12" r="5" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M14 36V24a6 6 0 0112 0v12" stroke="#5b5fa6" strokeWidth="2" fill="#d8c4f0"/>
      <rect x="12" y="20" width="16" height="3" rx="1.5" fill="#5b5fa6" opacity="0.4"/>
    </svg>
  ),
  ground: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="24" height="18" rx="2" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <rect x="12" y="8" width="16" height="6" rx="2" fill="#d8c4f0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <circle cx="15" cy="23" r="2" fill="#5b5fa6"/>
      <circle cx="25" cy="23" r="2" fill="#5b5fa6"/>
      <rect x="17" y="28" width="6" height="4" rx="1" fill="#5b5fa6" opacity="0.4"/>
    </svg>
  ),
  security: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="4" width="16" height="32" rx="3" fill="#ddd8f0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M15 14h10M15 20h10" stroke="#5b5fa6" strokeWidth="1.2"/>
      <circle cx="20" cy="28" r="3" stroke="#5b5fa6" strokeWidth="1.5" fill="#c4a8e0"/>
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="28" height="22" rx="3" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <rect x="10" y="6" width="8" height="4" rx="1" fill="#5b5fa6" opacity="0.3"/>
      <rect x="22" y="6" width="8" height="4" rx="1" fill="#5b5fa6" opacity="0.3"/>
      <path d="M6 18h28" stroke="#5b5fa6" strokeWidth="1.2"/>
      <rect x="16" y="26" width="8" height="6" rx="1" fill="#5b5fa6" opacity="0.4"/>
    </svg>
  ),
  boarding: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="24" height="24" rx="3" fill="#ddd8f0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M14 16h12M14 21h8M14 26h10" stroke="#5b5fa6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  immigration: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="13" r="6" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <rect x="8" y="22" width="24" height="14" rx="3" fill="#d8c4f0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <rect x="14" y="25" width="12" height="3" rx="1" fill="#5b5fa6" opacity="0.3"/>
      <rect x="16" y="30" width="8" height="2" rx="1" fill="#5b5fa6" opacity="0.3"/>
    </svg>
  ),
  baggageOps: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="10" width="14" height="22" rx="3" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M15 10V7a3 3 0 016 0v3" stroke="#5b5fa6" strokeWidth="1.5"/>
      <line x1="11" y1="18" x2="25" y2="18" stroke="#5b5fa6" strokeWidth="1.2"/>
      <circle cx="30" cy="26" r="6" stroke="#5b5fa6" strokeWidth="1.5" fill="#ddd8f0"/>
      <path d="M28 26h4M30 24v4" stroke="#5b5fa6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  departures: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 28h28" stroke="#5b5fa6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 24l8-10 6 2 10-8" stroke="#5b5fa6" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M28 8l4 2-2 4" stroke="#5b5fa6" strokeWidth="1.5" fill="none"/>
      <rect x="10" y="30" width="6" height="3" rx="1" fill="#5b5fa6" opacity="0.3"/>
      <rect x="24" y="30" width="6" height="3" rx="1" fill="#5b5fa6" opacity="0.3"/>
    </svg>
  ),
  robot: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="12" width="20" height="18" rx="4" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <circle cx="16" cy="21" r="2.5" fill="#5b5fa6"/>
      <circle cx="24" cy="21" r="2.5" fill="#5b5fa6"/>
      <line x1="20" y1="8" x2="20" y2="12" stroke="#5b5fa6" strokeWidth="2"/>
      <circle cx="20" cy="6" r="2" fill="#5b5fa6"/>
      <path d="M15 27h10" stroke="#5b5fa6" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6" y1="20" x2="10" y2="20" stroke="#5b5fa6" strokeWidth="2"/>
      <line x1="30" y1="20" x2="34" y2="20" stroke="#5b5fa6" strokeWidth="2"/>
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="28" height="20" rx="3" fill="#ddd8f0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <rect x="10" y="12" width="20" height="12" rx="1" fill="#c4a8e0"/>
      <line x1="16" y1="28" x2="16" y2="33" stroke="#5b5fa6" strokeWidth="1.5"/>
      <line x1="24" y1="28" x2="24" y2="33" stroke="#5b5fa6" strokeWidth="1.5"/>
      <line x1="12" y1="33" x2="28" y2="33" stroke="#5b5fa6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  vendor: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="24" height="20" rx="2" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M8 14l4-8h16l4 8" stroke="#5b5fa6" strokeWidth="1.5" fill="#d8c4f0"/>
      <rect x="16" y="24" width="8" height="10" rx="1" fill="#5b5fa6" opacity="0.3"/>
    </svg>
  ),
  engineer: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="13" r="6" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <path d="M12 36V26a8 8 0 0116 0v10" stroke="#5b5fa6" strokeWidth="2" fill="#d8c4f0"/>
      <rect x="16" y="10" width="8" height="3" rx="1" fill="#5b5fa6" opacity="0.4"/>
    </svg>
  ),
  tower: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="18" width="8" height="18" rx="1" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <rect x="10" y="10" width="20" height="8" rx="3" fill="#ddd8f0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <rect x="14" y="4" width="12" height="6" rx="2" fill="#c4a8e0" stroke="#5b5fa6" strokeWidth="1.5"/>
      <circle cx="20" cy="7" r="1.5" fill="#5b5fa6"/>
    </svg>
  ),
};

const ICON_NAMES = Object.keys(ICONS);

/* ─── Add-node modal ─── */
function NodeModal({ open, section, onClose, onSave }) {
  const [label, setLabel] = useState("");
  const [count, setCount] = useState(0);
  const [icon, setIcon] = useState(ICON_NAMES[0]);
  if (!open) return null;

  const sectionTitle = { sources: "Incident Source", domains: "Incident Domain", targets: "Escalation Target" }[section];

  const overlay = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(30,30,60,0.45)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  const card = {
    background: "#fff", borderRadius: 18, padding: "32px 36px", width: 380,
    boxShadow: "0 20px 60px rgba(60,50,120,0.25)", fontFamily: "'Segoe UI', system-ui, sans-serif",
  };
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1.5px solid #c8cce0", fontSize: 14, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#5b5fa6", marginBottom: 6, display: "block" };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={card} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#3b2d7a" }}>
          Add {sectionTitle}
        </h3>

        <label style={labelStyle}>Label</label>
        <input style={inputStyle} placeholder="e.g. Passenger Apps"
          value={label} onChange={e => setLabel(e.target.value)}
          onFocus={e => e.target.style.borderColor = "#5b5fa6"}
          onBlur={e => e.target.style.borderColor = "#c8cce0"} />

        <div style={{ height: 16 }} />
        <label style={labelStyle}>Incident Count</label>
        <input style={inputStyle} type="number" min="0" placeholder="0"
          value={count} onChange={e => setCount(Math.max(0, +e.target.value))}
          onFocus={e => e.target.style.borderColor = "#5b5fa6"}
          onBlur={e => e.target.style.borderColor = "#c8cce0"} />

        <div style={{ height: 16 }} />
        <label style={labelStyle}>Icon</label>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8,
          maxHeight: 160, overflowY: "auto", padding: 4,
        }}>
          {ICON_NAMES.map(name => (
            <div key={name} onClick={() => setIcon(name)} style={{
              width: 44, height: 44, borderRadius: 10,
              border: icon === name ? "2.5px solid #5b5fa6" : "1.5px solid #ddd",
              background: icon === name ? "rgba(91,95,166,0.1)" : "#f8f8fc",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.15s",
            }}>
              <div style={{ width: 24, height: 24 }}>{ICONS[name]}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 22px", borderRadius: 10, border: "1.5px solid #c8cce0",
            background: "#fff", color: "#5b5fa6", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={() => {
            if (!label.trim()) return;
            onSave({ label: label.trim(), count, icon });
            setLabel(""); setCount(0); setIcon(ICON_NAMES[0]);
          }} style={{
            padding: "9px 22px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #5b5fa6, #7b6fc0)",
            color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 14px rgba(91,95,166,0.35)",
          }}>Add Node</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stylish "+" button ─── */
function AddButton({ onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 40, height: 40, borderRadius: "50%", cursor: "pointer",
      border: "2px dashed #a8b0cc", display: "flex", alignItems: "center",
      justifyContent: "center", margin: "8px auto 0", transition: "all 0.2s",
      background: "rgba(168,176,204,0.08)", color: "#7b8bb5", fontSize: 22, fontWeight: 300,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#5b5fa6"; e.currentTarget.style.color = "#5b5fa6"; e.currentTarget.style.background = "rgba(91,95,166,0.1)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#a8b0cc"; e.currentTarget.style.color = "#7b8bb5"; e.currentTarget.style.background = "rgba(168,176,204,0.08)"; }}
    >+</div>
  );
}

/* ─── DATA ─── */
const INIT_SOURCES = [
  { id: "s1", label: "Passenger\nDigital Apps", count: 12, icon: "smartphone" },
  { id: "s2", label: "Flight\nOperations", count: 24, icon: "pilot" },
  { id: "s3", label: "Baggage Handling\nSystems", count: 8, icon: "baggage" },
  { id: "s4", label: "Airfield\nOperations", count: 6, icon: "airfield" },
  { id: "s5", label: "External\nDisruption Feeds", count: 6, icon: "globe" },
];

const INIT_DOMAINS = [
  { id: "d1", label: "Ramp\nOperations", count: 2, icon: "ramp" },
  { id: "d2", label: "Ground\nOperations", count: 4, icon: "ground" },
  { id: "d3", label: "Security\nScreening", count: 5, icon: "security" },
  { id: "d4", label: "Terminal\nOperations", count: 6, icon: "terminal" },
  { id: "d5", label: "Passenger\nBoarding", count: 15, icon: "boarding" },
  { id: "d6", label: "Immigration\nServices", count: 9, icon: "immigration" },
  { id: "d7", label: "Baggage Handling\nOperations", count: 8, icon: "baggageOps" },
  { id: "d8", label: "Flight Departures\n& Arrivals", count: 7, icon: "departures" },
];

const INIT_TARGETS = [
  { id: "e1", label: "AI Resolved", count: 32, icon: "robot" },
  { id: "e2", label: "L2 IT Operation", count: 12, icon: "monitor" },
  { id: "e3", label: "Vendor", count: 7, icon: "vendor" },
  { id: "e4", label: "Field Engineer", count: 4, icon: "engineer" },
  { id: "e5", label: "Control Tower", count: 1, icon: "tower" },
];

/* ─── Node component ─── */
function Node({ item, labelSide, circleRef }) {
  const imp = getImpact(item.count);
  const col = IMPACT[imp];
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        flexDirection: labelSide === "right" ? "row" : "row-reverse",
        cursor: "default",
      }}
    >
      <div ref={circleRef} style={{
        position: "relative", width: 64, height: 64, flexShrink: 0, zIndex: 1,
        transform: hovered ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.25s cubic-bezier(.4,0,.2,1), filter 0.25s ease",
        filter: hovered ? `drop-shadow(0 2px 12px ${col.ring}44)` : "none",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: `2.5px solid ${col.ring}`, background: col.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: hovered ? `0 0 0 4px ${col.ring}18` : "none",
          transition: "box-shadow 0.25s ease",
        }}>
          <div style={{ width: 32, height: 32 }}>{ICONS[item.icon] || ICONS.globe}</div>
        </div>
        <div style={{
          position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
          background: col.badge, color: "#fff", fontSize: 11, fontWeight: 700,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          borderRadius: 10, padding: "1px 8px", minWidth: 26, textAlign: "center",
          boxShadow: hovered ? `0 2px 8px ${col.badge}55` : "none",
          transition: "box-shadow 0.25s ease",
        }}>
          {String(item.count).padStart(2, "0")}
        </div>
      </div>
      <div style={{
        textAlign: labelSide === "right" ? "left" : "right", minWidth: 90, maxWidth: 130,
        opacity: hovered ? 1 : 0.85, transition: "opacity 0.2s ease",
      }}>
        {item.label.split("\n").map((line, i) => (
          <div key={i} style={{
            fontSize: 12.5, fontWeight: 600, color: "#3d3f5c",
            lineHeight: 1.25, fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>{line}</div>
        ))}
      </div>
    </div>
  );
}

/* ─── Node wrapper that captures a DOM ref on the circle element ─── */
function RefNode({ item, labelSide, onMount }) {
  const circleRef = useRef(null);
  useEffect(() => { if (circleRef.current && onMount) onMount(item.id, circleRef.current); }, [item.id, onMount]);
  return <div><Node item={item} labelSide={labelSide} circleRef={circleRef} /></div>;
}

/* ─── Connector curves (all three sections → hub) ─── */
function Lines({ sourceRefs, domainRefs, targetRefs, hubRef, containerRef, domains, sources, targets }) {
  const [curves, setCurves] = useState([]);
  useEffect(() => {
    const calc = () => {
      const c = containerRef.current;
      const h = hubRef.current;
      if (!c || !h) return;
      const cr = c.getBoundingClientRect();
      const hr = h.getBoundingClientRect();
      const hx = hr.left + hr.width / 2 - cr.left;
      const hy = hr.top + hr.height / 2 - cr.top;
      const result = [];

      /* Cubic Bézier from (x1,y1) to (x2,y2) */
      const bezier = (x1, y1, x2, y2) => {
        const dx = x2 - x1, dy = y2 - y1;
        return `M ${x1} ${y1} C ${x1 + dx * 0.65} ${y1 + dy * 0.1}, ${x1 + dx * 0.35} ${y1 + dy * 0.9}, ${x2} ${y2}`;
      };

      const center = (el) => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2 - cr.left, r.top + r.height / 2 - cr.top];
      };

      for (const [id, el] of Object.entries(sourceRefs.current)) {
        const [nx, ny] = center(el);
        result.push({ id, d: bezier(nx, ny, hx, hy), type: "source" });
      }
      for (const [id, el] of Object.entries(domainRefs.current)) {
        const [nx, ny] = center(el);
        result.push({ id, d: bezier(nx, ny, hx, hy), type: "domain" });
      }
      for (const [id, el] of Object.entries(targetRefs.current)) {
        const [nx, ny] = center(el);
        result.push({ id, d: bezier(hx, hy, nx, ny), type: "target" });
      }

      setCurves(result);
    };
    const t = setTimeout(calc, 50);
    window.addEventListener("resize", calc);
    return () => { clearTimeout(t); window.removeEventListener("resize", calc); };
  }, [sourceRefs, domainRefs, targetRefs, hubRef, containerRef, domains, sources, targets]);

  /* Style per type: domains are more visible, sources & targets are lighter */
  const lineStyle = {
    source: { stroke: "#c0c6da", strokeWidth: 1, strokeOpacity: 0.3 },
    domain: { stroke: "#a8b0cc", strokeWidth: 1.4, strokeOpacity: 0.5 },
    target: { stroke: "#c0c6da", strokeWidth: 1, strokeOpacity: 0.3 },
  };

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
      {curves.map(l => (
        <path key={l.id} d={l.d}
          stroke={lineStyle[l.type].stroke}
          strokeWidth={lineStyle[l.type].strokeWidth}
          strokeOpacity={lineStyle[l.type].strokeOpacity}
          fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}

/* ─── Central Hub ─── */
function Hub({ hubRef }) {
  return (
    <div ref={hubRef} style={{
      width: 150, height: 150, borderRadius: "50%", flexShrink: 0,
      background: "radial-gradient(circle at 45% 40%, #d4d8f5 0%, #dfe2f8 40%, #e8eafb 100%)",
      border: "1.5px solid rgba(170,180,220,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
      boxShadow: "0 0 60px rgba(130,140,210,0.15), 0 0 120px rgba(160,170,230,0.08), 0 4px 20px rgba(150,160,210,0.12)",
      zIndex: 2,
      transition: "box-shadow 0.4s ease",
    }}>
      <div style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: 14, fontWeight: 700,
        color: "#5b5fa6", textAlign: "center", lineHeight: 1.3,
        letterSpacing: "0.02em",
      }}>AI IT Ops<br/>Tower</div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function AIIncidentControlTower() {
  const [sources, setSources] = useState(INIT_SOURCES);
  const [domains, setDomains] = useState(INIT_DOMAINS);
  const [targets, setTargets] = useState(INIT_TARGETS);
  const [modal, setModal] = useState({ open: false, section: "sources" });

  const containerRef = useRef(null);
  const hubRef = useRef(null);
  const sourceRefs = useRef({});
  const domainRefs = useRef({});
  const targetRefs = useRef({});
  const [ready, setReady] = useState(false);

  const registerSource = useCallback((id, el) => { sourceRefs.current[id] = el; }, []);
  const registerDomain = useCallback((id, el) => { domainRefs.current[id] = el; }, []);
  const registerTarget = useCallback((id, el) => { targetRefs.current[id] = el; }, []);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  const nextId = (prefix, list) => `${prefix}${list.length + 1}_${Date.now()}`;

  const handleAddNode = ({ label, count, icon }) => {
    const sec = modal.section;
    if (sec === "sources") setSources(p => [...p, { id: nextId("s", p), label, count, icon }]);
    if (sec === "domains") setDomains(p => [...p, { id: nextId("d", p), label, count, icon }]);
    if (sec === "targets") setTargets(p => [...p, { id: nextId("e", p), label, count, icon }]);
    setModal({ open: false, section: sec });
  };

  const leftDomains = domains.slice(0, Math.ceil(domains.length / 2));
  const rightDomains = domains.slice(Math.ceil(domains.length / 2));

  /* ── Hybrid positioning: vertical-with-bow + gentle arc ── */
  const SPREAD_H = 520;  /* total vertical spread for outer columns */
  const BASE_X   = 400;  /* horizontal distance from hub center */
  const BOW      = 70;   /* max horizontal bow at the middle node */
  const INNER_R  = 235;  /* radius for domain arcs */
  const LAYOUT_H = Math.max(SPREAD_H + 160, 680);

  /**
   * Vertical equidistant with a parabolic horizontal bow.
   * side: -1 = left (sources), +1 = right (targets)
   */
  const bowPositions = (n, side) =>
    Array.from({ length: n }, (_, i) => {
      const t = n <= 1 ? 0.5 : i / (n - 1);           /* 0 → 1 */
      const y = (t - 0.5) * SPREAD_H;                  /* centred vertically */
      const curve = BOW * (1 - Math.pow(2 * t - 1, 2)); /* 0 at ends, BOW at middle */
      const x = side * (BASE_X + curve);                /* bow pushes outward */
      return { x, y };
    });

  /* Gentle radial arc for domains (tight sweep keeps it subtle) */
  const arc = (n, startDeg, sweepDeg, r) =>
    Array.from({ length: n }, (_, i) => {
      const deg = n <= 1 ? startDeg + sweepDeg / 2 : startDeg + sweepDeg * i / (n - 1);
      const rad = deg * Math.PI / 180;
      return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
    });

  const srcPos  = bowPositions(sources.length, -1);
  const tgtPos  = bowPositions(targets.length,  1);
  const lDomPos = arc(leftDomains.length,  215, -70, INNER_R);
  const rDomPos = arc(rightDomains.length, 325,  70, INNER_R);

  const absNode = (pos) => ({
    position: "absolute",
    left: `calc(50% + ${pos.x}px)`,
    top: `calc(50% + ${pos.y}px)`,
    transform: "translate(-50%, -50%)",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: `
        radial-gradient(ellipse 80% 60% at 20% 30%, rgba(200,190,240,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 70%, rgba(180,200,240,0.12) 0%, transparent 55%),
        radial-gradient(ellipse 40% 40% at 50% 10%, rgba(220,200,250,0.1) 0%, transparent 50%),
        linear-gradient(180deg, #eaecf6 0%, #f0f1f8 40%, #edeef6 100%)
      `,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "28px 24px",
    }}>
      <NodeModal open={modal.open} section={modal.section}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        onSave={handleAddNode} />

      {/* Title */}
      <h1 style={{
        fontSize: 22, fontWeight: 700, color: "#3b2d7a",
        margin: "0 0 28px 20px", letterSpacing: "0.01em",
      }}>
        AI Incident Control Tower
      </h1>

      {/* Section headers row */}
      <div style={{
        display: "flex", maxWidth: 1200, margin: "0 auto 14px", padding: "0 10px",
      }}>
        <div style={{ flex: "0 0 220px", textAlign: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#2d2f4e" }}>Incident Sources</span>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#2d2f4e" }}>Incident Domains</span>
        </div>
        <div style={{ flex: "0 0 220px", textAlign: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#2d2f4e" }}>Escalation Targets</span>
        </div>
      </div>

      {/* Main radial layout */}
      <div ref={containerRef} style={{
        position: "relative", maxWidth: 1200, margin: "0 auto", height: LAYOUT_H,
      }}>
        {ready && (
          <Lines sourceRefs={sourceRefs} domainRefs={domainRefs} targetRefs={targetRefs}
            hubRef={hubRef} containerRef={containerRef}
            domains={domains} sources={sources} targets={targets} />
        )}

        {/* Hub — dead centre */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 2 }}>
          <Hub hubRef={hubRef} />
        </div>

        {/* Sources — left arc */}
        {sources.map((item, i) => (
          <div key={item.id} style={absNode(srcPos[i])}>
            <RefNode item={item} labelSide="left" onMount={registerSource} />
          </div>
        ))}

        {/* Left domains — inner left arc */}
        {leftDomains.map((item, i) => (
          <div key={item.id} style={absNode(lDomPos[i])}>
            <RefNode item={item} labelSide="left" onMount={registerDomain} />
          </div>
        ))}

        {/* Right domains — inner right arc */}
        {rightDomains.map((item, i) => (
          <div key={item.id} style={absNode(rDomPos[i])}>
            <RefNode item={item} labelSide="right" onMount={registerDomain} />
          </div>
        ))}

        {/* Targets — right arc */}
        {targets.map((item, i) => (
          <div key={item.id} style={absNode(tgtPos[i])}>
            <RefNode item={item} labelSide="right" onMount={registerTarget} />
          </div>
        ))}

        {/* Add buttons — positioned below each section's arc */}
        <div style={{ position: "absolute", left: `calc(50% - ${BASE_X}px)`, bottom: 8, transform: "translateX(-50%)" }}>
          <AddButton onClick={() => setModal({ open: true, section: "sources" })} />
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: 8, transform: "translateX(-50%)" }}>
          <AddButton onClick={() => setModal({ open: true, section: "domains" })} />
        </div>
        <div style={{ position: "absolute", left: `calc(50% + ${BASE_X}px)`, bottom: 8, transform: "translateX(-50%)" }}>
          <AddButton onClick={() => setModal({ open: true, section: "targets" })} />
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", gap: 32, marginTop: 24, padding: "0 20px", flexWrap: "wrap",
      }}>
        {[
          { label: "High Impact: >10 Incidents", color: "#d4556a" },
          { label: "Medium Impact: 5 - 10 Incidents", color: "#e8a84c" },
          { label: "Low Impact: < 5 Incidents", color: "#94a3c4" },
        ].map(l => (
          <div key={l.label} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13, color: "#4a4c6a",
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%",
              border: `2px solid ${l.color}`, background: "transparent",
            }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}


