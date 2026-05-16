# Railway Deployment

Deploy the app as one Railway service that builds the frontend and serves it from the backend.

## 1. Railway service

- Root directory: repository root
- Config file: `railway.toml`
- Build command: handled by Railway from the TOML config
- Start command: `cd backend && npm start`
- Environment variables:
  - `MONGO_URI` - your MongoDB connection string
  - `PORT` - Railway sets this automatically
  - `CLIENT_URLS` - optional; keep only for local dev or if you still want an explicit allowlist
  - `SERVE_FRONTEND` - keep unset or `true` so the backend serves the built frontend

Example:

```text
CLIENT_URLS=http://localhost:5173
```

## 2. TOML config

Use this file at the repo root:

```toml
[build]
builder = "nixpacks"
buildCommand = "cd frontend && npm install && npm run build && cd ../backend && npm install"

[deploy]
startCommand = "cd backend && npm start"
```

## 3. Local dev

- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`
- Frontend API base URL defaults to `/api`, so no env is required locally when the frontend is proxied separately.

Example:

```text
VITE_API_BASE_URL=/api
```

## 4. Railway flow

1. Create one Railway project.
2. Connect the repo and let Railway pick up the root `railway.toml`.
3. Add `MONGO_URI` in Railway variables.
4. Deploy once; Railway builds the frontend, starts the backend, and serves the SPA from the same service.
5. If you want an explicit local allowlist, keep `CLIENT_URLS=http://localhost:5173` for local development.

## 5. Why this is the minimal setup

This uses one Railway service, one public URL, and one deploy pipeline. The frontend is no longer a separate deployment target; it is just static output served by the backend process.
