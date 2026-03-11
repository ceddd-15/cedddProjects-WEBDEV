# Project Rules (AGENTS.md)

## Overview

This project uses three specialized agents: **Backend Dev**, **Frontend Dev**, and **Business Analyst**.
Each agent has a focused role. When assigning tasks, use `@backend-dev`, `@frontend-dev`, or `@business-analyst`.

---

## General Rules (All Agents)

- Always read existing code before making changes.
- Never delete files unless explicitly instructed.
- Commit messages must follow Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
- All new features must include basic error handling.
- Ask for clarification before making architectural decisions.
- Do not expose secrets, API keys, or credentials in code or logs.
- Never commit `.env` files — use `.env.example` for reference.

---

## Project Stack

### Backend

- **Language**: PHP 8.2+
- **Framework**: Laravel 11
- **Package Manager**: Composer
- **Database**: PostgreSQL (primary) or MySQL
- **ORM**: Eloquent
- **Auth**: Laravel Sanctum (API tokens)
- **Testing**: Pest PHP

### Frontend

- **Language**: JavaScript (JSX)
- **Framework**: React 18 + Vite
- **Styling**: Plain CSS (co-located per component)
- **Package Manager**: npm
- **State**: `useState` / `useContext` (React built-ins)
- **Data Fetching**: `fetch` via service modules (`src/services/`)
- **Routing**: React Router v6

### Shared

- **API Protocol**: REST (JSON)
- **API Prefix**: `/api/v1/`
- **CORS**: Configured in Laravel for the frontend origin

---

## Agent-Specific Rules

Each agent has its own rules file under `.opencode/agents/`:

- Backend: `.opencode/agents/backend-dev.md`
- Frontend: `.opencode/agents/frontend-dev.md`
- Business Analyst: `.opencode/agents/business-analyst.md`

---

## Skills

Reusable patterns and templates are stored in `.opencode/skills/`. Agents load them on demand.

- `$backend-dev` — Laravel patterns, Eloquent, migrations, API resources
- `$frontend-dev` — React component patterns, plain CSS, fetch-based service modules
- `$business-analyst` — Spec templates, user story format, decision log