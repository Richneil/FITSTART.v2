# FitStart — Personalized Fitness Assessment & Decision Support System

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind_CSS_3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express_5-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Academic_Thesis-blue)](#-academic-citation--credits)

> **Mapúa Institute of Technology Thesis Project**  
> Developed for **KSYN Fitness Alabang**  
> A web-based personalized decision support system that transforms raw 3D body composition scanner data (FitMao) into explainable, context-aware fitness priorities and actionable member guidance.

---

## 📖 Overview & Concept

**FitStart** addresses a fundamental challenge in gym environments: raw body composition scan slips (e.g., from 3D scanners like FitMao) contain dozens of clinical and metric data points that can overwhelm newcomers and gym members.

Instead of functioning as a routine workout tracker or gym management tool, FitStart acts as a **specialized clinical decision support system**:
- **Guest-First Workflow**: Complete assessment interpretations without mandatory upfront registration.
- **Explainable Decision Support**: Prioritizes key focus areas using a deterministic, rule-based algorithm that weighs scan data against PAR-Q+ health readiness and personal lifestyle habits.
- **Post-Results Account Creation**: Seamlessly link and save assessment scans to member accounts after viewing the interpretation.

---

## 🌟 Key Features

### 1. 🚀 Seamless Assessment Ingestion
- **Guest-First Access**: Immediate entry without mandatory sign-up.
- **Live Camera & QR Scanner**: Real-time viewfinder with laser reticle and instant frame capture to parse FitMao JSON payloads and QR slip codes.
- **Image File Upload**: Support for QR slip photos and automated extraction.
- **Preset Demonstration Scans**: Instant preview presets for *Standard Overweight*, *Athletic Muscular*, and *Metabolic Risk* profiles.

### 2. 🧠 Explainable Decision Support Engine
- **Primary Focus Area**: Identifies the single most impactful metric to focus on first (Body Fat %, Skeletal Muscle Mass, Visceral Fat Level, BMR, etc.) with clean, plain-language guidance.
- **Interactive "Ask Why" Modal**: Complete transparency into why a metric was prioritized, presenting the exact contributing factors, baseline clinical relevance, and deterministic rule traces.
- **Top Priorities Breakdown**: Ranked sequence of secondary metrics with clear explanations.
- **"Because You Told Us" Context Matching**: Explicitly links user-declared goals, weekly workout frequencies, and schedules to the resulting priorities.

### 3. 📊 Clinical Metric Review & Export
- **Collapsible Full Assessment Summary**: Access to all 18+ raw FitMao scanner measurements (Total Weight, Fat Mass, Skeletal Muscle, BMR, Visceral Fat Level, WHR, Body Water, Bone Minerals, and Target Control Recommendations).
- **1-Page Clinical PDF Export**: Formatted, printable summary sheet suitable for taking to gym coaches or personal trainers.

### 4. 📈 Longitudinal Member Tracking & Hub
- **Multi-Scan Progress Comparison**: Automated delta analysis between baseline and follow-up scans with visual progress indicators.
- **Achievement & Milestone Badging**: Tracks assessment milestones, PAR-Q clearances, and security activations.
- **Custom Fitness Avatar**: Archetype presets and custom avatar uploads.

### 5. 🛡️ Security & Authentication
- **JSON Web Token (JWT) Sessions**: Secure authentication with persistent session verification.
- **Two-Factor Authentication (2FA)**: 6-digit verification security for member profiles.
- **Zero Lock-In Demo Storage**: Built-in local JSON database fallback for zero-configuration testing alongside full PostgreSQL production support.

---

## 🛠️ Architecture & Tech Stack

```
fitstart-ui/
├── server/                         # Express.js Backend (Port 5000)
│   ├── config/database.js          # Dual-mode adapter (PostgreSQL + Local JSON DB fallback)
│   ├── middleware/auth.js          # JWT verification & security middleware
│   ├── routes/                     # REST API endpoints (/api/auth, /api/assessments, /api/results)
│   ├── data/                       # Standardized PAR-Q templates, fitness glossary & local DB
│   └── utils/scoreMetrics.js       # Core deterministic rule-based scoring engine
├── src/                            # React Frontend (Port 8080)
│   ├── components/
│   │   ├── Assessment/             # Live QR/Camera ingestion, PAR-Q form, goal check-in
│   │   ├── Auth/                   # Login, Registration, 2FA verification modal, Google OAuth
│   │   ├── Dashboard/              # Member landing, scan history cards, progress comparison
│   │   ├── Glossary/               # Fitness metric definitions & category benchmarks
│   │   ├── Profile/                # Profile customizer, avatar selector, 2FA security
│   │   └── Results/                # Main focus card, Ask Why modal, priorities, PDF export
│   ├── utils/                      # API client, real-time QR decoder, scoring logic, theme hook
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
git clone https://github.com/CLBulawan/FitStart.git
cd FitStart
npm install
```

### 2. Environment Configuration (Optional)
Copy the example environment file:
```bash
cp server/.env.example server/.env
```
*(FitStart includes a built-in local JSON database adapter with demo seed data, allowing the application to run out-of-the-box without requiring an external PostgreSQL instance).*

### 3. Run the Development Servers

#### Option A: Run Both Frontend & Backend Concurrently
```bash
npm run dev:all
```

#### Option B: Run in Separate Terminals
Start the Express backend API (Port 5000):
```bash
npm run server
```

Start the Vite frontend (Port 8080):
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:8080
```

---

## 🔑 Demo & Testing Credentials

For quick evaluation and thesis defense demonstrations:

| Field | Value |
|---|---|
| **Email** | `alex@ksynfitness.com` |
| **Password** | `password123` |
| **2FA Code** | `123456` |

---

## 🤝 Contributing & Pull Requests

We welcome contributions and peer reviews! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. **Fork the Repository**: [https://github.com/CLBulawan/FitStart](https://github.com/CLBulawan/FitStart)
2. **Create a Feature Branch**: `git checkout -b feature/my-feature`
3. **Verify Build & Tests**: Run `npm run build` to confirm 0 compilation errors.
4. **Commit & Push**: Commit your changes and push to your fork.
5. **Open a Pull Request**: Submit your PR on GitHub with a description of the changes.

---

## 📄 Academic Citation & Credits

- **Institution**: Mapúa Institute of Technology
- **Partner Gym**: KSYN Fitness Alabang
- **Scanner Hardware**: FitMao 3D Body Composition Analyzer
- **Author / Developer**: [CLBulawan](https://github.com/CLBulawan)
