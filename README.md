# Niamind

Niamind is a platform built around better, more honest conversations.

The idea behind Niamind is simple: many of the conversations that matter most are the ones we tend to avoid, soften, or leave unsaid. Niamind is being built to create a space where people can approach those conversations more openly and thoughtfully.

The platform is currently being developed as a collection of applications that work together:

* **Niamind Landing** — the public-facing website where people can learn about Niamind and join the community.
* **Niamind Dashboard** — the application interface for users and the platform itself.
* **Niamind API** — the backend responsible for the platform's data, business logic, authentication, and services.

The public website is available at [niamind.com](https://niamind.com).

## Project Structure

The repository contains the three primary applications:

```text
Niamind/
├── backend/        # FastAPI backend and API
├── dashboard/      # Vite frontend application
├── landing/        # Vite public website
├── .github/        # GitHub Actions and repository workflows
└── README.md       # Project overview
```

Each application has its own README with the setup and development instructions specific to that part of the project.

## Architecture

At a high level, the platform is organized around a shared backend and two frontend applications:

```text
                         ┌──────────────────┐
                         │    niamind.com   │
                         │     Landing      │
                         └────────┬─────────┘
                                  │
                                  │
                         ┌────────▼─────────┐
                         │    Niamind API   │
                         │     Backend      │
                         └────────┬─────────┘
                                  │
                                  │
                         ┌────────▼─────────┐
                         │     Dashboard    │
                         │    Application   │
                         └──────────────────┘
```

The landing page is the public entry point to Niamind. The dashboard provides the application experience, while the backend acts as the central API and data layer shared by the frontend applications.

## Technology

### Backend

The backend is built with:

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Redis
* Alembic
* Pytest

### Frontend

Both frontend applications are built with:

* React
* Vite
* JavaScript
* npm

The landing page and dashboard are maintained as separate applications because they serve different purposes, even though they live within the same repository.

## Development

Each application can be developed independently.

The backend provides the API and supporting services, while the Vite applications can be run independently during frontend development.

See the README inside each directory for application-specific setup and development instructions:

* [`backend/README.md`](backend/README.md)
* [`dashboard/README.md`](dashboard/README.md)
* [`landing/README.md`](landing/README.md)

## Repository

Niamind is maintained as a single repository containing the backend, dashboard, and landing applications.

Keeping the applications together makes it easier to develop the platform as one product while allowing each application to retain its own dependencies, configuration, and development workflow.

## Status

Niamind is actively under development.

The public website provides the current entry point for people interested in the project, while the underlying platform and dashboard continue to evolve.
