# 🗼 AI Incident Control Tower

A stunning, interactive React component that visualizes IT incident management topology — connecting **Incident Sources**, **Incident Domains**, and **Escalation Targets** through an elegant radial hub-and-spoke interface.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## ✨ Features

- **Hub-and-Spoke Topology** — Central AI IT Ops hub connected to categorized nodes via smooth Bézier curves
- **Dynamic Node Management** — Add new nodes to any category through a glassmorphic modal with icon picker
- **Impact-Aware Styling** — Nodes auto-color based on incident count (High / Medium / Low)
- **Adaptive Layout** — Vertical-with-bow positioning dynamically redistributes nodes as they're added
- **Premium UI Polish** — Gradient wires, breathing hub glow, hover micro-animations, frosted glass legend
- **Zero Overlap Guarantee** — Opaque node circles with `zIndex` layering ensure clean wire termination
- **Self-Contained** — Single `.jsx` file with 18 inline SVG icons, no external asset dependencies

---

## 🖼️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│ Incident Sources │ ───→ │  Incident Domains │ ───→ │ Escalation Targets│
│                 │      │                  │      │                   │
│ • Digital Apps  │      │ • Ramp Ops       │      │ • AI Resolved     │
│ • Flight Ops   │      │ • Ground Ops     │      │ • L2 IT Ops       │
│ • Baggage Sys  │      │ • Security       │      │ • Vendor          │
│ • Airfield Ops │      │ • Terminal Ops   │      │ • Field Engineer  │
│ • Disruption   │      │ • Boarding       │      │ • Control Tower   │
│   Feeds        │      │ • Immigration    │      │                   │
│                 │      │ • Baggage Ops    │      │                   │
│                 │      │ • Departures     │      │                   │
└─────────────────┘      └────────┬─────────┘      └───────────────────┘
                                  │
                          ┌───────┴───────┐
                          │  AI IT Ops    │
                          │    Tower      │
                          │   (Hub)       │
                          └───────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- React 18+ (hooks-based)
- A React project with JSX support (Vite, Next.js, CRA, etc.)

### Installation

1. Copy `ai-incident-control-tower.jsx` into your project's components directory.

2. Import and render the component:

```jsx
import AIIncidentControlTower from './ai-incident-control-tower';

function App() {
  return <AIIncidentControlTower />;
}
```

3. That's it — no additional CSS files, no icon libraries, no external dependencies.

### CDN / Standalone Usage

An `index.html` is included that loads React via CDN — no build tools needed:

```bash
# Serve locally (any static server works)
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000` (or `5000` for `npx serve`).

> **Note:** The HTML file must be served via HTTP (not `file://`) because it fetches the JSX file at runtime.

---

## 🎨 Design System

### Impact Levels

| Level    | Threshold     | Ring Color | Background |
|----------|---------------|------------|------------|
| 🔴 High   | > 10 incidents | `#d4556a`  | `#faf0f2`  |
| 🟠 Medium | 5–10 incidents | `#e8a84c`  | `#fdf6ee`  |
| 🔵 Low    | < 5 incidents  | `#94a3c4`  | `#f3f4f8`  |

### Layout Constants

| Parameter     | Value  | Description                              |
|---------------|--------|------------------------------------------|
| `OUTER_X`     | 400px  | Sources/Targets distance from hub        |
| `INNER_X`     | 180px  | Domains distance from hub                |
| `BOW`         | 70px   | Max horizontal parabolic curve           |
| `innerSpread` | 65%    | Domain vertical range (vs outer columns) |

### Visual Features

- **Background**: Multi-layer radial gradient mesh (lavender, blue, purple overlays)
- **Hub**: 4-second breathing pulse animation with concentric ring shadows
- **Nodes**: Scale 1.1× on hover with colored drop-shadow and ring glow
- **Wires**: SVG gradient strokes (subtle → strong for domains)
- **Legend**: Glassmorphic frosted card with `backdrop-filter: blur(12px)`
- **Title**: CSS gradient text (deep purple → violet)

---

## 🛠️ Customization

### Adding Default Nodes

Edit the `INIT_SOURCES`, `INIT_DOMAINS`, or `INIT_TARGETS` arrays:

```jsx
const INIT_SOURCES = [
  { id: "s1", label: "Passenger\nDigital Apps", count: 12, icon: "smartphone" },
  { id: "s2", label: "Flight\nOperations", count: 24, icon: "pilot" },
  // ... add more
];
```

### Available Icons

The component ships with 18 built-in SVG icons:

`smartphone` · `pilot` · `baggage` · `airfield` · `globe` · `ramp` · `ground` · `security` · `terminal` · `boarding` · `immigration` · `cargo` · `departures` · `robot` · `monitor` · `vendor` · `engineer` · `tower`

### Adjusting Layout

Tweak the positioning constants in the main component:

```jsx
const OUTER_X  = 400;  // push sources/targets further out
const INNER_X  = 180;  // push domains closer/further from hub
const BOW      = 70;   // increase/decrease the column curvature
```

---

## 📐 How the Layout Works

### Vertical-with-Bow Positioning

Each node group uses a **parabolic bow** function:

```
x = side × (baseX + BOW × (1 - (2t - 1)²))
y = (t - 0.5) × spread
```

Where `t` goes from 0 to 1 across the nodes. This creates columns that are:
- **Vertically equidistant** — guaranteed no overlap
- **Subtly curved** — middle nodes push outward, creating an organic feel
- **Dynamically adaptive** — adding nodes automatically adjusts spacing

### Wire Rendering

Bézier curves connect each node to the central hub using center-to-center endpoints. Since both nodes and the hub have opaque backgrounds with elevated `zIndex`, wires naturally terminate at the visual perimeter without any geometric intersection math.

---

## 📄 License

MIT — use freely in personal and commercial projects.
