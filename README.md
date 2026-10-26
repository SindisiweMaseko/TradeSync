# TradeSync 


> **The all-in-one digital operating system, supply-chain aggregator, and global investment platform for youth entrepreneurs and township small businesses across South Africa.**

![TradeSync Banner](public/assets/branding/image_8491ff9d.png)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blueviolet?style=flat-square)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 Executive Summary

South Africa's township economy (*kasi biz*) represents over **R900 billion in annual economic value**, spanning hundreds of thousands of spaza shops, kota eateries, hair salons, bakeries, and local logistics operators. However, youth founders face systemic barriers:
1. **Cash-flow invisibility**: Cash and WhatsApp transactions leave no paper trail, locking businesses out of commercial banking and formal microloans.
2. **Purchasing power penalties**: Buying stock individually results in paying retail prices, eating up to 30% of gross margins.
3. **Bureaucratic barriers**: Navigating CIPC registration, SARS Tax Clearance PINs, and B-BBEE documentation prevents youth from accessing government grants (NYDA, SEFA, NEF).
4. **Investor disconnect**: Township enterprises lack structured avenues to pitch their audited operational traction to angel syndicates and impact funds.

**TradeSync** solves these challenges by unifying **omnichannel financial recording**, **collective bulk buying**, **compliance automation**, and **angel investor syndication** into a lightweight, offline-first Progressive Web App (PWA).

---

## 🎨 Visual Identity & Brand Design System

TradeSync is designed strictly around the official brand identity and user-directed color constitution:

- **White Mode Palette**:
  - **Deep Navy** (`#0B192C`): Anchors headers, primary cards, and typography.
  - **Pure White** (`#FFFFFF`): Crisp surfaces and clean contrast.
  - **Electric Blue** (`#2563EB` / `#38BDF8`): Interactive highlights, active tabs, buttons, and call-to-actions.
- **Dark Mode Palette**:
  - **Deep Obsidian / Midnight Slate** (`#090D16` / `#0B192C`): Reduces glare and conserves battery life on OLED mobile screens.
  - **Neon / Electric Blue Accents**: High contrast data visualizations and status badges.
- **Official Brand Mark**:
  - Dual silhouette figures shaking hands enclosed in a continuous synchronization cycle, symbolizing trade velocity, trust, and mutual prosperity between township merchants, tier-1 suppliers, and capital allocators.

---

## 🚀 The 4 Core Operating Pillars

### 1. 📱 KasiBiz OS (Omnichannel Smart Ledger & Health Score)
* **WhatsApp Voice & Text Note Parser**: Merchants can type or paste conversational WhatsApp messages (e.g., *"sold 14 special kotas R560 and bought 20kg flour R320"*). The built-in regex & NLP engine automatically parses income, expenses, categories, and updates the till float.
* **Real-Time Financial Dashboard**: Visualizes gross turnover, operating expenditure, net margins, and current cash float.
* **Bankable Health Score (0–100)**: Evaluates business health across 4 pillars:
  - Profitability & cash-flow margins (25 pts)
  - Ledger discipline & daily logging frequency (25 pts)
  - CIPC registration, SARS Tax PIN & B-BBEE Level 1 standing (25 pts)
  - TradeSync Academy completion & group buying participation (25 pts)
* **Instant Tax-Compliant PDF Invoicing**: Client-side vector PDF generation (`jspdf`) with automated VAT calculations, invoice numbering, CIPC registration details, and instant download/print capabilities.

### 2. 🤝 SupaSupplier (Group Buying & Bulk FMCG Aggregation)
* **Collective Buying Pools**: Small spazas and food hubs aggregate orders for high-turnover staples (Sunflower Cooking Oil, Super Maize Meal, Kraft Burger Packaging, Fresh Potatoes & Russian Sausages).
* **Dynamic Tier Discounts**: Unlocks 15% to 28% wholesale price drops as community orders cross Minimum Order Quantities (MOQ).
* **Delivery Route Tracking**: Integrated township drop-off schedules, bulk supplier fulfillment statuses, and route consolidation.

### 3. 🏛️ GrowthFund (CIPC, SARS & Grant Readiness Vault)
* **CIPC BizPortal Synchronization**: Simulates live company registration verification and annual return filings.
* **SARS eFiling PIN & Tax Compliance**: Validates Good Standing status required for municipal and corporate supply-chain tenders.
* **B-BBEE Level 1 Affidavit Generator**: Generates instant qualifying exempt micro-enterprise (EME) verification.
* **Grant Matching Engine**: Directly matches the business profile with active funding opportunities from **SEFA**, **NYDA**, and the **National Empowerment Fund (NEF)**.

### 4. 🎥 Investors Market & TradeSync Academy
* **60-Second Video Pitch Reels**: Founders showcase their operations, verified bankable health scores, and monthly revenue trends to impact investors.
* **Angel Syndicate Pledges**: Investors can evaluate deal terms, review financial audits, and commit capital directly in-app.
* **2-Minute Micro-Lessons**: Bite-sized practical modules on pricing strategies, inventory shrinkage prevention, and working capital optimization that directly boost the merchant's Health Score.

---

## 👥 Multi-Role Personas (1-Click Fast Pass)

To allow judges, investors, and stakeholders to experience every facet of the platform without typing credentials, TradeSync features 4 pre-configured personas:

| Persona | Role | Enterprise | Township / Hub | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Lindiwe Khumalo** | Founder / SMME | *Lindiwe's Gourmet Kota & Chill Hub* | Soweto (Vilakazi St) | WhatsApp ledger, till float, group buying orders, pitch deck |
| **Jabu Sithole** | Wholesale Supplier | *Kasi Wholesale & FMCG Logistics* | Johannesburg Central | MOQ pool creation, bulk inventory dispatch, route planning |
| **Nomvula Dlamini** | Angel / VC Investor | *Ubuntu Impact Capital* | Sandton | Dealflow review, pitch reels, syndicate pledge allocation |
| **Bongani Cele** | Gov / Incubator | *Gauteng Youth Enterprise Accelerator* | Pretoria Mamelodi | Grant approvals, compliance auditing, ecosystem metrics |

---

## 🛠️ Technology Stack

* **Frontend Framework**: [React 19](https://react.dev/) with functional components and custom hooks.
* **Build System & Dev Server**: [Vite 8](https://vite.dev/) with ES modules and near-instant HMR.
* **Styling & Theme Engine**: [Tailwind CSS v4](https://tailwindcss.com/) with custom tokens, dark mode transition classes, and zero layout shift.
* **Icons**: [Lucide React](https://lucide.dev/) (consistent, lightweight SVG icon system).
* **Document Engine**: [jsPDF](https://github.com/parallax/jsPDF) for client-side tax invoice creation.
* **Micro-Interactions**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) for milestone achievements.
* **Offline / PWA**: [Vite PWA](https://vite-pwa-org.netlify.app/) (`vite-plugin-pwa`) with Web App Manifest, Service Worker precaching, and custom install prompt.
* **Testing**: Node.js native test runner via `tsx --test` covering phone number normalization, health score algorithms, and WhatsApp parsing.

---

## 📂 Project Structure

```text
├── public/
│   ├── assets/
│   │   └── branding/
│   │       ├── image_8491ff9d.png      # Official TradeSync vector brand mark
│   │       └── image_75bec969.png      # 3D gloss promotional badge
│   ├── pwa-192x192.png                 # PWA application icon (192px)
│   ├── pwa-512x512.png                 # PWA application icon (512px)
│   ├── pwa-maskable-512x512.png        # Android adaptive maskable icon
│   └── apple-touch-icon.png            # iOS Home Screen icon
├── src/
│   ├── components/
│   │   ├── academy/                    # 2-minute micro-learning lessons
│   │   ├── auth/                       # Sign In, Register, and 1-Click Persona flows
│   │   │   ├── AuthModal.tsx
│   │   │   └── AuthSection.tsx
│   │   ├── growthfund/                 # CIPC, SARS, B-BBEE & Grant Vault
│   │   ├── investors/                  # 60s Pitch Reels and angel syndicate board
│   │   ├── kasibiz/                    # WhatsApp ledger, tax invoice generator, health score
│   │   ├── shared/                     # Modal wrappers, stat cards, metric pills
│   │   ├── supasupplier/               # Group buying pools & supplier portal
│   │   ├── Header.tsx                  # Top navigation with role switcher, logo & theme toggle
│   │   ├── PillarNavigation.tsx        # Segmented switchers for the 4 core pillars
│   │   └── PWAInstallButton.tsx        # Native PWA install prompt button
│   ├── context/
│   │   └── TradeSyncContext.tsx        # Global state engine for transactions, pools, users & theme
│   ├── data/
│   │   └── seedData.ts                 # Pre-populated demo accounts, pools, grants & reels
│   ├── types/
│   │   └── index.ts                    # Strict TypeScript type definitions
│   ├── utils/
│   │   ├── authValidation.ts           # South African mobile (+27) and password checkers
│   │   ├── businessLogic.ts            # Health score, pool progress & WhatsApp note parsers
│   │   └── logic.test.ts               # Unit test suite verifying core business rules
│   ├── App.tsx                         # Root app orchestrator with auth gatekeeping
│   ├── main.tsx                        # Application mount entrypoint
│   └── index.css                       # Global Tailwind v4 styling declarations
├── index.html                          # Entry HTML with meta tags, PWA links & favicon
├── metadata.json                       # Applet configuration and permissions
├── package.json                        # Scripts and dependencies
├── tsconfig.json                       # Strict TypeScript configuration
└── vite.config.ts                      # Vite build configuration with PWA integration
```

---

## ⚡ Quick Start & Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` (version 9+)

### Installation
```bash
# Clone the repository or navigate to applet root
git clone https://github.com/your-org/tradesync.git
cd tradesync

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the Vite development server (default port 3000)
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the platform.

### Running Automated Tests
```bash
# Run the pure business logic and validation test suite
npm test
```

### Type Checking & Linting
```bash
# Run TypeScript compilation checks
npm run lint
```

### Production Build
```bash
# Create optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 📱 Progressive Web App (PWA) & Offline Usage

TradeSync is designed to operate reliably in low-connectivity township environments:
1. **Service Worker Caching**: Core application assets, stylesheets, and scripts are precached on initial load.
2. **Offline Transaction Stash**: In case of network interruption or load shedding, transactions are staged in browser storage and synchronized when connectivity resumes.
3. **Add to Home Screen**: Desktop and mobile browsers provide an instant one-click install button in the header bar.

---

## 🔒 Security & Data Privacy

- **Data Encryption**: All simulated financial records and user credentials follow 256-bit encryption standards.
- **Zero In-App Secrets**: API integrations use client-side or server proxy architecture without exposing sensitive credentials.
- **POPIA Compliant**: South African Protection of Personal Information Act principles applied to merchant personal and trading information.

---

## 🤝 Contributing

Contributions to empower South African youth entrepreneurs are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

*Built with ❤️ for South Africa's vibrant township innovators and youth founders.*
