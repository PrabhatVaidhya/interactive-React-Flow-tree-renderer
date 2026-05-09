# Organization Chart - React Flow Tree Renderer

A high-performance, client-side hierarchical data visualizer built with **React**, **React Flow**, and **Dagre**. Designed specifically to render tree-structured data with beautiful aesthetics, smooth interactions, and intelligent layout recalculation.

## ✨ Core Features

1. **Intelligent Spacing & Layout**
   - Integrates `@dagrejs/dagre` to perform real-time tree structure layout calculation. 
   - Sibling nodes are spaced cleanly without overlaps, and parent nodes are mathematically centered directly above their subtrees.

2. **Smooth Expand & Collapse**
   - Fully interactive components. Clicking the intuitive toggle button on any parent node collapses its entire subtree.
   - Layout automatically recomputes and visually reorganizes to reclaim lost space, providing a seamless "snapping" experience.

3. **Advanced Search & Highlight**
   - Built-in search bar allows you to quickly find nodes by Name or Role.
   - Automatically expands parent nodes to reveal the searched node if it was previously collapsed.
   - Applies a glowing "glassmorphism" highlight to matching nodes.

4. **Auto-Pan & Zoom (Bonus Challenge)**
   - The canvas intuitively reacts to state changes. 
   - Upon expanding or collapsing a node, the viewport smoothly pans and zooms (`fitView` interpolation) to perfectly frame the new tree bounds.

5. **Premium Aesthetics**
   - Built with **Tailwind CSS**, `framer-motion` for micro-animations, and `lucide-react` icons.
   - Uses a modern "glassmorphism" style with blurred backdrops, soft shadows, and clean gradients to ensure a "wow factor" right out of the box.

---

## 🚀 Setup & Run Instructions

This project requires **Node.js** (v16+ recommended).

### 1. Install Dependencies
Navigate into the project directory and run:

```bash
npm install
```

### 2. Start the Development Server
To run the project locally:

```bash
npm run dev
```

### 3. View the Application
Open your browser and navigate to:
**http://localhost:5173**

---

## 🛠 Technology Stack

- **Framework**: Vite + React
- **Graph Engine**: `@xyflow/react` (React Flow)
- **Layout Algorithms**: `dagre` (Directed acyclic graph layout)
- **Styling**: Tailwind CSS + `clsx` + `tailwind-merge`
- **Animations**: `framer-motion`

---

## 📂 Project Structure

```text
src/
├── App.jsx             # Application root (provides React Flow context)
├── TreeView.jsx        # Main component (handles data state, search, and graph rendering)
├── CustomNode.jsx      # Bespoke UI node component (handles hover/highlight/toggle UX)
├── layoutUtils.js      # Layout engine utility (integrates dagre)
└── index.css           # Tailwind design tokens
```

## 📝 Design Decisions

- **Client-Side First**: Kept the architecture strictly frontend-driven to guarantee zero-latency recalculations during expand/collapse interactions.
- **Why Dagre?**: Selected Dagre because it's the industry standard for hierarchical topological layouts, easily integrating with React Flow to ensure parents stay mathematically centered over dynamic sibling branches.
- **Why Framer Motion?**: Added to handle entrance micro-animations for nodes. It gives the UI an organic, premium feel when elements are added to the DOM after a parent expands.
