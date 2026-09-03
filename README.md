# FitStart — Personalized Fitness Assessment & Decision Support System

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind_CSS_3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Academic_Thesis-blue)](#)

> **Mapúa Institute of Technology Thesis Project**  
> Developed for **KSYN Fitness Alabang**  
> A rule-based clinical decision-support web application that transforms raw 3D body composition scanner data (FitMao) into personalized, explainable, and context-aware fitness starting points.

---

## 🌟 Key Features

1. **Deterministic Rule-Based Scoring Engine**
   - Transmutes raw scanner metrics (Body Fat %, Muscle Mass, Visceral Fat Level, BMR, etc.) into an explainable **Main Focus (#1 Priority)** and **Top Priorities**.
   - **"Show the Math" Waterfall**: Metric-by-metric breakdown of base scores, conditional multipliers, and delta additions.
   - **Scanner Target Trajectory**: 4–6 week re-test milestones based on scanner control targets.

2. **Longitudinal Multi-Scan Progress Comparison**
   - Automated progression analysis between baseline scans and follow-up assessments.
   - Computes delta metrics (Fat % change, Muscle Mass change, Visceral level shift) with an automated recomposition verdict.
   - Friendly guidance when fewer than 2 scans exist, including a one-click demo follow-up test.

3. **Harmonized 1-to-1 PAR-Q Questionnaire**
   - Clean, standardized Physical Activity Readiness Questionnaire without ambiguous "other" options.
   - Symmetrically matched options between Primary Goals (Section 2) and Activity Preferences (Section 3).

4. **Security & Authentication**
   - Secure member registration and login with JSON Web Tokens (JWT).
   - **Two-Factor Authentication (2FA)** with 6-digit verification code.
   - Persistent session verification with auto-logout on expiration.

5. **Engaging Member Hub & Profile**
   - Custom Fitness Avatar (PFP) customizer featuring archetype presets and local image upload.
   - Milestone achievement tracking (FitMao Scanned, PAR-Q Cleared, Recomposition Active, 2FA Protected).

6. **Modern Mobile-First UI & Theming**
   - Native-app feel with a fixed glassmorphic bottom navigation dock (`BottomNav`).
   - Seamless **Dark Mode & Light Mode** toggleable via top navigation and member profile with `localStorage` persistence and system color scheme detection.

---

## 🛠️ Architecture & Tech Stack

```
fitstart-ui/
├── server/                         # Express.js Backend
│   ├── config/database.js          # Dual-mode adapter (PostgreSQL + Local DB JSON fallback)
│   ├── middleware/auth.js          # JWT verification middleware
│   ├── routes/                     # REST API endpoints (/auth, /assessments, /results, /glossary)
│   ├── data/                       # Standardized PAR-Q template & fitness glossary
│   └── utils/scoreMetrics.js       # Core deterministic rule-based scoring engine
├── src/                            # React Frontend
│   ├── components/
│   │   ├── Assessment/             # Scan ingestion, PAR-Q questionnaire, goal check-in
│   │   ├── Auth/                   # Login, 2FA verification modal, Registration
│   │   ├── Dashboard/              # Member landing, scan history cards, progress comparison
│   │   ├── Glossary/               # Fitness glossary with category benchmarks
│   │   ├── Profile/                # Profile customizer, 2FA center, avatar selector
│   │   └── Results/                # Results view, waterfall math, target trajectory
│   ├── utils/                      # API client, theme hook, scoring logic
│   └── index.css                   # Tailwind theme layers & responsive utilities
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/<your-username>/fitstart.git
cd fitstart
npm install
```

### 2. Environment Configuration (Optional)
Copy the example environment file:
```bash
cp server/.env.example server/.env
```
*(FitStart includes a built-in local JSON database adapter with demo seed data, allowing the application to run out-of-the-box without requiring an external PostgreSQL instance).*

### 3. Run the Development Servers

Start the Express backend API (Port 3001):
```bash
node server/index.js
```

In a second terminal, start the Vite frontend (Port 5173):
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔑 Thesis Defense Demo Credentials

For quick evaluation during defense presentations:

- **Email**: `alex@ksynfitness.com`
- **Password**: `password123`
- **2FA Demo Code**: `123456`

## 🤝 Contributing & Pull Requests

We welcome community and peer contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

### Quick Pull Request Steps:
1. **Fork & Clone**: Fork [https://github.com/CLBulawan/FitStart](https://github.com/CLBulawan/FitStart) and clone locally.
2. **Branch**: `git checkout -b feature/my-new-feature`
3. **Build Check**: Run `npm run build` to confirm 0 errors.
4. **Push & Open PR**: Push to your fork and submit a PR via GitHub. Our automated PR template will guide you through the review requirements!

---

## 📄 Academic Citation & Credits

- **Institution**: Mapúa Institute of Technology
- **Partner Gym**: KSYN Fitness Alabang
- **Scanner Hardware**: FitMao 3D Body Composition Analyzer
