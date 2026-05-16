# FlowForge

FlowForge is a role-based task management platform with a polished SaaS-style interface. The application is split into a React frontend and an Express/MongoDB backend, and it is designed so Admin and Member users share the same visual system while seeing different data and permissions.

## Overview

The product helps teams manage projects, track tasks, and coordinate work in one unified workspace. The UI intentionally uses one design language across both roles so the experience feels like a single production-ready product instead of two separate dashboards.

## What The App Does

- Authenticates users with login and signup screens.
- Routes users into protected role-specific areas.
- Lets Admin users manage projects, tasks, users, and workspace settings.
- Lets Member users view assigned work, update task status, and track their own progress.
- Provides shared pages for Projects, Tasks, Profile, and Settings.
- Uses a consistent premium layout with the same navbar, sidebar, cards, tables, buttons, and dialogs everywhere.

## Tech Stack

Frontend:

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Zustand

Backend:

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Roles And Permissions

- Admin: can see all projects and tasks, manage users, and perform workspace administration.
- Member: can only see their assigned projects and tasks, and can update their own task status where allowed.

The key point is that the layout and visual treatment stay the same for both roles. Only the data and available actions change.

## Frontend Structure

```text
frontend/
	src/
		components/    Reusable UI building blocks such as Navbar, Sidebar, Button, Modal, Inputs
		context/       Authentication, theme, and toast providers
		hooks/         Small wrappers around shared state and app behavior
		layouts/       Shared dashboard shell and auth layout
		pages/         Login, Signup, dashboards, projects, tasks, profile, settings, and fallback pages
		routes/        Route definitions and protected routing
		services/      API clients and feature-specific HTTP services
		store/         Global UI and auth state
		utils/         Formatting helpers, constants, and shared utilities
```

## Visual System

The frontend uses a unified design system built around:

- consistent spacing and radius values
- shared glass-like surfaces and borders
- the same button and input treatments across pages
- a single navbar and sidebar shell for all authenticated screens
- matching table, modal, and card styles

This keeps the admin and member experiences visually aligned while still respecting their different permissions.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Create a `.env` file in the frontend folder and point it at the backend API:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start the backend

From the backend folder:

```bash
npm install
npm run dev
```

### 4. Start the frontend

From the frontend folder:

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build.
- `npm run preview` serves the production build locally.

## Backend Notes

The backend exposes REST endpoints for auth, users, projects, and tasks. The frontend services under `src/services` call those endpoints through a shared API client.

## Default Pages

- Login
- Signup
- Admin Dashboard
- Member Dashboard
- Projects
- Tasks
- Profile
- Settings
- Not Found

## Build And Validation

The frontend production build is expected to pass with:

```bash
npm run build
```

If you change API behavior or role permissions, verify both dashboard experiences so the UI stays visually consistent and the data remains correctly scoped.
