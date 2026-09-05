# Contributing to FitStart

Thank you for your interest in contributing to **FitStart**! This guide outlines the workflow for creating, testing, and submitting Pull Requests (PRs).

---

## 🚀 Easy Pull Request Workflow

### 1. Fork & Clone
1. Fork the repository on GitHub: [https://github.com/CLBulawan/FitStart](https://github.com/CLBulawan/FitStart)
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/FitStart.git
   cd FitStart
   ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a Feature Branch
Always create a new branch for your changes rather than committing directly to `main`:
```bash
# For new features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/issue-description
```

---

## 💻 Local Development

1. **Start the Backend API**:
   ```bash
   node server/index.js
   ```
   *Runs on `http://localhost:5000` (utilizes local JSON fallback if PostgreSQL is not configured).*

2. **Start the Frontend Dev Server**:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:8080` with Hot Module Replacement (HMR).*

---

## 🧪 Pre-Submission Checklist

Before creating a Pull Request, ensure your changes pass all local checks:

1. **Test Production Build**:
   ```bash
   npm run build
   ```
   *Verify that Vite compiles cleanly with zero syntax or bundling errors.*

2. **Verify Dual Themes**:
   - Ensure your UI changes look polished in both **Light Mode** and **Dark Mode**.
   - Use Tailwind's `dark:` classes where applicable.

3. **Check Sensitive Files**:
   - Do **NOT** commit `.env` files, API keys, or personal tokens.

---

## 📤 Submitting Your Pull Request

1. **Stage & Commit**:
   ```bash
   git add .
   git commit -m "feat(module): concise description of changes"
   ```

2. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open the Pull Request**:
   - Navigate to [https://github.com/CLBulawan/FitStart](https://github.com/CLBulawan/FitStart)
   - Click **Compare & pull request**.
   - Fill out the automated PR template with what you changed and how to test it.
   - Click **Create pull request**!

---

## 🏷️ Commit Message Conventions
- `feat:` A new user-facing feature or enhancement
- `fix:` A bug fix or syntax correction
- `style:` UI, Tailwind CSS, or formatting updates
- `refactor:` Code restructuring without changing user behavior
- `docs:` Documentation updates in `README.md` or comments
