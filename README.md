# GitHub Actions CI/CD Tutorial

Production-ready Node.js REST API demonstrating how to build automated CI/CD pipelines with GitHub Actions.

---

## Project Structure

```
.github/workflows/
  01-ci-pipeline.yml   → lint → matrix test (Node 18/20/22) → summary
  02-cd-pipeline.yml   → secrets → build → deploy → health-check
  03-pr-check.yml      → fast lint + test on every Pull Request

tests/
  app.test.js          → Jest + Supertest — 12 test cases

app.js                 → Express REST API
server.js              → Server start + graceful shutdown
package.json
.env.example
```

---

## API Endpoints

| Method | Route            | Description                                   |
| ------ | ---------------- | --------------------------------------------- |
| GET    | `/`              | API metadata and status                       |
| GET    | `/api/health`    | Health-check — called by CD after each deploy |
| GET    | `/api/products`  | Static product catalogue                      |
| POST   | `/api/calculate` | Apply a percentage discount to an amount      |

---

## Local Setup

```bash
# 1. Install
npm install

# 2. Run dev server (auto-restart on file change)
npm run dev

# 3. Run test suite with coverage
npm test

# 4. Syntax check (same as CI lint step)
npm run lint
```

---

## GitHub Secrets

Set these in **Repo → Settings → Secrets and variables → Actions**:

| Secret                 | Value                                |
| ---------------------- | ------------------------------------ |
| `PRODUCTION_SERVER_IP` | IP address of your production server |
| `DEPLOY_TOKEN`         | Auth token / SSH key for deployment  |

---

## Pushing to GitHub

```bash
git init
git add .
git commit -m "feat: add github actions ci/cd pipeline"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Open the **Actions** tab on GitHub to watch the CI and CD pipelines execute.

---

## Visual Architecture Guide

Open `docs/architecture.html` in your browser for full Mermaid flow diagrams, concept tables, and code breakdowns.
