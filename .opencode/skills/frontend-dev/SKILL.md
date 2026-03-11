---
name: frontend-dev
description: React + Vite + plain CSS + JavaScript patterns and templates. Load when working on frontend tasks with @frontend-dev.
---

# Frontend Dev Skill — Intern Level (React + Vite + CSS + JavaScript)

## API Service Setup

All API calls live in `src/services/`. Keep `fetch` out of components.

```js
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL + "/api/v1";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (response.status === 401) {
    window.location.href = "/login";
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  // Return null for 204 No Content
  if (response.status === 204) return null;
  return response.json();
}
```

---

## Service Module Pattern

```js
// src/services/userService.js
import { apiFetch } from "./api";

export async function getUsers() {
  return apiFetch("/users");
}

export async function getUser(id) {
  return apiFetch(`/users/${id}`);
}

export async function createUser(data) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(id, data) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id) {
  return apiFetch(`/users/${id}`, { method: "DELETE" });
}
```

---

## Data Fetching Pattern (useState + useEffect)

```jsx
import { useState, useEffect } from "react";
import { getUsers } from "../services/userService";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Component Template

```jsx
// src/components/UserCard.jsx
import "./UserCard.css";

export function UserCard({ user, onEdit, onDelete }) {
  function handleEdit() {
    onEdit(user.id);
  }

  function handleDelete() {
    onDelete(user.id);
  }

  return (
    <div className="user-card">
      <div className="user-card__info">
        <p className="user-card__name">{user.name}</p>
        <p className="user-card__email">{user.email}</p>
      </div>
      <div className="user-card__actions">
        <button className="btn btn-secondary" onClick={handleEdit}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
```

```css
/* src/components/UserCard.css */
.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}

.user-card__name {
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.user-card__email {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.user-card__actions {
  display: flex;
  gap: 0.5rem;
}
```

---

## Form Pattern (Controlled Inputs)

```jsx
// src/components/CreateUserForm.jsx
import { useState } from "react";
import { createUser } from "../services/userService";

export function CreateUserForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUser(form);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <p className="form__error">{error}</p>}

      <div className="form__group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form__group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Create User"}
      </button>
    </form>
  );
}
```

---

## Routing Setup (React Router v6)

Define all routes in `App.jsx`. Use the `AuthContext` to protect private routes.

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Common CSS Patterns

Keep a shared set of base button and form styles. Co-locate component-specific styles.

```css
/* Reusable button styles (define in a shared CSS file or per-component) */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-danger {
  background: #dc2626;
  color: #fff;
}
.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

/* Reusable form styles */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form__group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.form__group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}
.form__group input,
.form__group textarea,
.form__group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
}
.form__group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}
.form__error {
  color: #dc2626;
  font-size: 0.875rem;
}

/* Card */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}
```

---

## npm Scripts Reference

```
npm run dev        → start Vite dev server
npm run build      → Vite production build (check for errors before finishing)
npm run preview    → preview production build locally
npm run lint       → ESLint check
```

---

## Pre-Task Checklist

- [ ] Read existing code in `src/` before writing anything new
- [ ] Check `src/components/` for a component that already does what you need
- [ ] Confirm the API endpoint exists — ask `@backend-dev` if unsure

## Done Checklist

- [ ] `npm run build` succeeds with no errors
- [ ] Loading, error, and empty states are handled in every component that fetches data
- [ ] All form inputs have a `<label>`
- [ ] Tested in the browser — the feature works as expected
- [ ] No `fetch` calls inside components (all in `src/services/`)