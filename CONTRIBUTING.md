# Contributing to pstream-app

Thank you for your interest in contributing to **pstream-app** — the open-source mobile client for P-Stream.

This project uses **React Native (TypeScript)** and connects to user-configurable P-Stream instances (Backend + Proxy). The app never hosts or stores any content.

---

## 🚀 Getting Started

### Clone the repo
git clone https://github.com/<your-org>/pstream-app.git
cd pstream-app

markdown
Copy code


### Branching Model
- `main` – stable releases only  
- `develop` – integration branch  
- `feature/*` – individual features  
- `hotfix/*` – urgent fixes to main  

### Workflow
1. Create a branch:  
   `git checkout -b feature/<name>`
2. Make your changes  
3. Open a Pull Request into `develop`  
4. Address review comments  
5. Maintainers merge after CI passes  

---

## 🧪 Code Style
- Use **TypeScript** everywhere  
- Use **prettier** + **eslint** (CI will check automatically)  
- Use meaningful variable names  
- Commit messages should follow **conventional commits**:
  - `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

---

## 📱 Project Structure (high-level)
app/
components/
screens/
api/
hooks/
store/
services/
assets/
docs/
.github/


---

## 🧵 Pull Requests
All PRs must:
- Target `develop`
- Include a clear summary of changes
- Reference issue numbers using `Fixes #<id>` or `Refs #<id>`
- Pass linting and build CI jobs

---

## 🧾 Reporting Issues
Use GitHub Issues and include:
- Steps to reproduce
- Platform (Android/iPadOS)
- Screenshots if UI-related
- Logs if available

---

## ❤️ Thank You
Every contribution helps grow the project.  
If you need help, create an issue or join discussions.  
Happy building!
