# 🎨 CSS Kits & Effects Registry (Mini Bootstrap)

A modern, interactive documentation platform and showcase registry for reusable CSS animations, UI kits, transition effects, and component layouts. Designed like a **"Mini Bootstrap"** documentation dashboard, it allows developers to interactively preview CSS effects in real time and easily copy the underlying HTML and CSS source code.

---

## ✨ Features

- ⚡ **Automated Folder Discovery**: Powered by a dynamic Express.js API backend (`GET /api/kits`) that automatically scans subdirectories for new CSS components and renders them on the fly—no build step or hardcoding needed!
- 🛡️ **Sandboxed Live Preview**: Displays live animations inside an isolated `<iframe>` environment, preventing component CSS from interfering with the dashboard's design system.
- 📋 **Interactive Code Inspector**: Seamlessly toggle between HTML and multiple CSS stylesheet source code blocks with built-in syntax highlighting (Prism.js) and 1-click copy-to-clipboard buttons.
- 🌌 **Premium Dark Glassmorphism UI**: High-end aesthetic with vibrant HSL gradient accents, backdrop blur filters, custom micro-interactions, and responsive side navigation.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, Dark Mode, Glassmorphism), Modern JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Libraries**: Prism.js (Syntax Highlighting)

---

## 📁 Included CSS Kits & Categories

The registry dynamically discovers and displays various animation and layout collections:

- 🔘 **Button Hover Animations** (Glow, Grow/Zoom, Underline Slide, Click press, Slide icon)
- 🌀 **Infinite CSS** (Pulse, Rotate, Bounce, Shake, Float)
- 🃏 **Flip Card** (3D Y-axis card flips on hover)
- 🔍 **Hover Zoom + Blur Others** (Focus zoom effect on active items while blurring non-hovered items)
- 📝 **Typewriter + Blinking Cursor** & **Letter By Letter Reveal**
- ⏳ **Loading Animation** (Multi-color progress bar animations)
- 📱 **Responsive & Simple Navbars** (Pure CSS hamburger toggle menu & clean layout bars)
- 🖼️ **Sliding Overlays** & **Slide-In Effects** (Slide from left, top, right, bottom, and diagonals)
- 🧩 **Staggered Animations**, **CSS Checkbox Modals**, and complete **Combo / Finale Templates**

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Execution

1. Clone the repository:
   ```bash
   git clone https://github.com/SAPTARSHI-coder/css-kit.git
   cd css-kit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Express server:
   ```bash
   node server.js
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 💡 Adding New CSS Kits

To add a new CSS kit to your registry:
1. Create a new folder inside the project root (e.g., `Card Flip 3D`).
2. Add an `index.html` file containing your component HTML structure inside `<body>`.
3. Add one or more `.css` files containing your component styling.
4. Refresh `http://localhost:3000`—your new kit will automatically appear in the sidebar navigation!

---

## 📜 License

This project is licensed under the ISC License.
