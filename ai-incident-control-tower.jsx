import { useState, useRef, useEffect, useCallback } from "react";

/* ─── colour constants ─── */
const IMPACT = {
  high:   { ring: "#d4556a", bg: "rgba(212,85,106,0.08)", badge: "#d4556a" },
  medium: { ring: "#e8a84c", bg: "rgba(232,168,76,0.08)",  badge: "#e8a84c" },
  low:    { ring: "#94a3c4", bg: "rgba(148,163,196,0.08)", badge: "#7b8bb5" },
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
function Node({ item, labelSide }) {
  const imp = getImpact(item.count);
  const col = IMPACT[imp];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      flexDirection: labelSide === "right" ? "row" : "row-reverse",
    }}>
      <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: `2.5px solid ${col.ring}`, background: col.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 32, height: 32 }}>{ICONS[item.icon] || ICONS.globe}</div>
        </div>
        <div style={{
          position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
          background: col.badge, color: "#fff", fontSize: 11, fontWeight: 700,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          borderRadius: 10, padding: "1px 8px", minWidth: 26, textAlign: "center",
        }}>
          {String(item.count).padStart(2, "0")}
        </div>
      </div>
      <div style={{ textAlign: labelSide === "right" ? "left" : "right", minWidth: 90, maxWidth: 130 }}>
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

/* ─── Evenly-spaced vertical column ─── */
function Column({ items, labelSide, style, onRef }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "space-evenly",
      height: "100%", ...style,
    }}>
      {items.map(item => (
        <RefNode key={item.id} item={item} labelSide={labelSide} onMount={onRef} />
      ))}
    </div>
  );
}

/* ─── Node wrapper that captures a DOM ref ─── */
function RefNode({ item, labelSide, onMount }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && onMount) onMount(item.id, ref.current); }, [item.id, onMount]);
  return <div ref={ref}><Node item={item} labelSide={labelSide} /></div>;
}

/* ─── Connector curves (all three sections → hub) ─── */
function Lines({ sourceRefs, domainRefs, targetRefs, hubRef, containerRef, domains }) {
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

      /* Helper: build a cubic Bézier path string */
      const bezier = (nx, ny, tx, ty) => {
        const dx = tx - nx;
        const dy = ty - ny;
        const cp1x = nx + dx * 0.65;
        const cp1y = ny + dy * 0.1;
        const cp2x = nx + dx * 0.35;
        const cp2y = ny + dy * 0.9;
        return `M ${nx} ${ny} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
      };

      /* Sources → hub (lighter) */
      for (const [id, el] of Object.entries(sourceRefs.current)) {
        const r = el.getBoundingClientRect();
        const nx = r.left + r.width / 2 - cr.left;
        const ny = r.top + r.height / 2 - cr.top;
        result.push({ id, d: bezier(nx, ny, hx, hy), type: "source" });
      }

      /* Domains → hub (normal) */
      for (const [id, el] of Object.entries(domainRefs.current)) {
        const r = el.getBoundingClientRect();
        const nx = r.left + r.width / 2 - cr.left;
        const ny = r.top + r.height / 2 - cr.top;
        result.push({ id, d: bezier(nx, ny, hx, hy), type: "domain" });
      }

      /* Hub → targets (lighter) */
      for (const [id, el] of Object.entries(targetRefs.current)) {
        const r = el.getBoundingClientRect();
        const nx = r.left + r.width / 2 - cr.left;
        const ny = r.top + r.height / 2 - cr.top;
        result.push({ id, d: bezier(hx, hy, nx, ny), type: "target" });
      }

      setCurves(result);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [sourceRefs, domainRefs, targetRefs, hubRef, containerRef, domains]);

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
      background: "radial-gradient(circle at 45% 40%, rgba(200,210,240,0.6) 0%, rgba(210,215,240,0.3) 50%, rgba(225,228,245,0.1) 100%)",
      border: "1.5px solid rgba(170,180,220,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
      boxShadow: "0 4px 40px rgba(150,160,210,0.2)",
      zIndex: 2,
    }}>
      <div style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: 14, fontWeight: 700,
        color: "#5b5fa6", textAlign: "center", lineHeight: 1.3,
      }}>AI IT Ops<br/>Tower</div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function AIIncidentControlTower() {
  const [sources] = useState(INIT_SOURCES);
  const [domains] = useState(INIT_DOMAINS);
  const [targets] = useState(INIT_TARGETS);

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

  const leftDomains = domains.slice(0, Math.ceil(domains.length / 2));
  const rightDomains = domains.slice(Math.ceil(domains.length / 2));
  const maxNodes = Math.max(sources.length, Math.max(leftDomains.length, rightDomains.length), targets.length);
  const containerHeight = maxNodes * 100 + 40;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #e8eaf4 0%, #edeef6 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "28px 24px",
    }}>
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

      {/* Main layout */}
      <div ref={containerRef} style={{
        position: "relative", display: "flex", alignItems: "stretch",
        maxWidth: 1200, margin: "0 auto",
        height: containerHeight,
      }}>
        {ready && (
          <Lines sourceRefs={sourceRefs} domainRefs={domainRefs} targetRefs={targetRefs}
            hubRef={hubRef} containerRef={containerRef} domains={domains} />
        )}

        {/* LEFT — Incident Sources (label left, icon right) */}
        <Column items={sources} labelSide="left" onRef={registerSource}
          style={{ flex: "0 0 220px", alignItems: "flex-end", padding: "12px 0" }} />

        {/* CENTER — Domains flanking Hub */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", minWidth: 480, padding: "12px 0",
        }}>
          {/* Left half of domains */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "space-evenly",
            height: "100%", alignItems: "flex-end", flex: "0 0 170px",
          }}>
            {leftDomains.map(d => (
              <RefNode key={d.id} item={d} labelSide="left" onMount={registerDomain} />
            ))}
          </div>

          {/* Hub */}
          <div style={{ margin: "0 24px", zIndex: 2 }}>
            <Hub hubRef={hubRef} />
          </div>

          {/* Right half of domains */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "space-evenly",
            height: "100%", alignItems: "flex-start", flex: "0 0 170px",
          }}>
            {rightDomains.map(d => (
              <RefNode key={d.id} item={d} labelSide="right" onMount={registerDomain} />
            ))}
          </div>
        </div>

        {/* RIGHT — Escalation Targets (icon left, label right) */}
        <Column items={targets} labelSide="right" onRef={registerTarget}
          style={{ flex: "0 0 220px", alignItems: "flex-start", padding: "12px 0" }} />
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
