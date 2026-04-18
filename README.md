# 🗼 AI Incident Control Tower

A stunning, interactive React component that visualizes IT incident management topology — connecting **Incident Sources**, **Incident Domains**, and **Escalation Targets** through an elegant radial hub-and-spoke interface. Fully responsive: scales gracefully on desktop and switches to a clean stacked-card layout on mobile.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## ✨ Features

- **Hub-and-Spoke Topology** — Central AI IT Ops hub connected to categorized nodes via smooth Bézier curves
- **Fully Responsive** — Desktop shows the radial layout; screens below 700 px switch to a scrollable stacked-card view
- **Dynamic Node Management** — Add new nodes to any category through a glassmorphic modal with icon picker
- **Impact-Aware Styling** — Nodes auto-color based on incident count (High / Medium / Low)
- **Adaptive Layout** — Vertical-with-bow positioning dynamically redistributes nodes as they are added
- **Viewport-Scaled Positioning** — Hub spoke distances scale proportionally with window width so nothing clips
- **Draggable Nodes** — Nodes can be grabbed and moved; wires follow in real-time
- **Premium UI Polish** — Gradient wires, breathing hub glow, hover micro-animations, frosted glass legend
- **Self-Contained** — Single `.jsx` file with 18 inline SVG icons, no external asset dependencies

---

## 🖼️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│ Incident Sources │ ───→ │  Incident Domains │ ───→ │ Escalation Targets│
│                 │      │                  │      │                   │
│ • Digital Apps  │      │ • Ramp Ops       │      │ • AI Resolved     │
│ • Flight Ops    │      │ • Ground Ops     │      │ • L2 IT Ops       │
│ • Baggage Sys   │      │ • Security       │      │ • Vendor          │
│ • Airfield Ops  │      │ • Terminal Ops   │      │ • Field Engineer  │
│ • Disruption    │      │ • Boarding       │      │ • Control Tower   │
│   Feeds         │      │ • Immigration    │      │                   │
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

## 📱 Responsive Behaviour

| Viewport      | Layout |
|---------------|--------|
| ≥ 700 px      | Full radial hub-and-spoke with Bézier wire connections and draggable nodes |
| < 700 px      | Stacked card list — hub badge at top, each section rendered as glassmorphic cards |

The radial layout also **scales its spoke distances** proportionally between 700 px and 1200 px so nodes never clip off-screen at intermediate sizes:

```
scale   = clamp(0…1,  (viewportWidth - 32) / 1200)
OUTER_X = round(400 × scale)   // sources & targets
INNER_X = round(180 × scale)   // domains
BOW     = round(70  × scale)   // column curvature
```

The modal respects viewport width too (`width: min(380px, calc(100vw - 48px))`).

---

## 🎨 Design System

### Impact Levels

| Level     | Threshold      | Ring Color | Background |
|-----------|----------------|------------|------------|
| 🔴 High   | > 10 incidents | `#d4556a`  | `#faf0f2`  |
| 🟠 Medium | 5–10 incidents | `#e8a84c`  | `#fdf6ee`  |
| 🔵 Low    | < 5 incidents  | `#94a3c4`  | `#f3f4f8`  |

### Visual Features

- **Background**: Multi-layer radial gradient mesh (lavender, blue, purple overlays)
- **Hub**: 4-second breathing pulse animation with concentric ring shadows
- **Nodes**: Scale 1.1× on hover with colored drop-shadow and ring glow
- **Wires**: SVG gradient strokes (subtle for sources/targets, stronger for domains); hot-highlighted on node hover
- **Legend**: Glassmorphic frosted card with `backdrop-filter: blur(12px)`
- **Title**: CSS gradient text (deep purple → violet)

---

## 🛠️ Customization

### Adding & Managing Nodes (No Code Required)

Every section has a **`+` button** at the bottom of its column (desktop) or header row (mobile). Clicking it opens a modal where you can:

- Enter a **label** (supports two lines using a line break)
- Set an **incident count** (determines the impact colour automatically)
- Pick an **icon** from the built-in icon palette

The new node appears immediately and wires connect to the hub in real-time.

> **Developer tip — changing the pre-loaded defaults:** Edit the `INIT_SOURCES`, `INIT_DOMAINS`, or `INIT_TARGETS` arrays at the top of the component file to change what nodes are shown on first load.

### Available Icons

The component ships with 18 built-in SVG icons selectable from the modal:

`smartphone` · `pilot` · `baggage` · `airfield` · `globe` · `ramp` · `ground` · `security` · `terminal` · `boarding` · `immigration` · `baggageOps` · `departures` · `robot` · `monitor` · `vendor` · `engineer` · `tower`

### Adjusting the Breakpoint

Change `isMobile` to alter when the stacked layout kicks in:

```jsx
const isMobile = vw < 700;  // adjust threshold as needed
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
- **Viewport-aware** — `baseX` and `BOW` are scaled to the current window width

### Wire Rendering

Bézier curves connect each node to the central hub using center-to-center endpoints. Since both nodes and the hub have opaque backgrounds with elevated `zIndex`, wires naturally terminate at the visual perimeter without any geometric intersection math. Curves are recalculated on every animation frame during drag and for 800 ms after release (to follow the snap-back CSS transition).

---

## 📄 License

MIT — use freely in personal and commercial projects.
