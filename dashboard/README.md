# Niamind Dashboard

The Niamind Dashboard is the main web application for interacting with the Niamind platform.

It is a React application built with **Vite** and is maintained separately from the public Niamind website while living in the same repository.

The dashboard communicates with the Niamind API for application data and services.

## Tech Stack

* **React** — frontend framework
* **Vite** — development server and build tool
* **JavaScript** — application language
* **npm** — package management

---

# Requirements

Before running the dashboard locally, make sure you have:

* Node.js 22
* npm

Check your installed versions:

```bash
node --version
npm --version
```

---

# Installation

From the root of the Niamind repository:

```bash
cd dashboard
```

Install dependencies:

```bash
npm install
```

For a clean installation using the committed lockfile:

```bash
npm ci
```

`package-lock.json` should be committed to the repository so that local development and CI use the same dependency versions.

---

# Development

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Typically this will be:

```text
http://localhost:5173
```

The exact port may change if the default port is already in use.

The development server supports hot module replacement, so changes to the application are reflected in the browser while developing.

---

# Production Build

Create a production build:

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

Preview the production build locally:

```bash
npm run preview
```

---

# API Configuration

The dashboard communicates with the Niamind backend API.

API configuration should be provided through Vite environment variables rather than hard-coded into the application.

Vite environment variables intended for the frontend must use the `VITE_` prefix.

For example:

```env
VITE_API_URL=http://localhost:8000
```

A local environment file can be created as:

```text
.env.local
```

Environment files containing local or secret configuration should not be committed to the repository.

The exact environment variables used by the application should be documented alongside the dashboard configuration as the application develops.

---

# Project Structure

The dashboard follows a standard React/Vite application structure.

```text
dashboard/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── ...
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

The internal `src/` structure may evolve as the dashboard grows.

Application-specific components, pages, API communication, and supporting utilities should remain organized within the dashboard rather than being placed in the backend.

---

# Development Workflow

A typical dashboard development workflow is:

```text
Pull latest code
      ↓
Install dependencies
      ↓
Configure local environment
      ↓
Start Niamind API
      ↓
Start Vite development server
      ↓
Develop and test
      ↓
Build application
      ↓
Commit changes
```

During development, the dashboard and backend normally run as separate processes:

```text
Dashboard
localhost:5173
      │
      │ HTTP requests
      ▼
Niamind API
localhost:8000
```

The backend must be running for dashboard functionality that depends on the API.

---

# Code Quality

Before committing frontend changes, verify that the application builds successfully:

```bash
npm run build
```

If linting is configured in `package.json`, run:

```bash
npm run lint
```

The dashboard is also checked through the repository's GitHub Actions workflows.

---

# Related Applications

The dashboard is part of the larger Niamind platform:

```text
Niamind/
├── backend/      # FastAPI API
├── dashboard/    # Niamind Dashboard
└── landing/      # Public Niamind website
```

The dashboard consumes services provided by the backend API.

The public-facing Niamind website is available at:

**https://niamind.com**

For an overview of the entire project, see the repository root README.
