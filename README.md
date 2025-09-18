# Road Safety Guard

Road Safety Guard is a modern MERN application to report, analyze, and prevent road accidents. It enables citizens to submit structured incident reports and helps authorities with a data‑driven dashboard, trends, and safety resources.

## Live Demo
- App: [`https://road-safety-guard-rcxx.vercel.app/`](https://road-safety-guard-rcxx.vercel.app/)

> Note: The API is self‑hosted. Some features may require a running backend (see Setup).

## Highlights (for Recruiters/Placement)
- End‑to‑end MERN stack with authentication (JWT) and protected routes
- Real‑time analytics dashboards with charts and geospatial maps (Leaflet)
- Admin moderation workflow for verifying accident reports
- Clean modular architecture: routes, controllers, models, middleware
- Production‑ready client build and environment‑based configuration

## Screenshots
Add your screenshots to `docs/screenshots/` and update the paths below.

| Screen | Preview |
|---|---|
| Landing / Dashboard | ![Dashboard](docs/screenshots/dashboard.png) |
| Report Accident | ![Report](docs/screenshots/report.png) |
| Recent Accidents | ![Recent Accidents](docs/screenshots/recent.png) |
| Admin Panel | ![Admin](docs/screenshots/admin.png) |

## Features
- Authentication: signup/login (JWT), profile
- Accident Reporting: severity, category, casualties, vehicles, weather, coordinates
- Dashboard: stats, trends, category analytics, high‑risk hotspots, interactive map
- Admin: verify/reject reports
- Safety Resources: curated tips and emergency contacts

## Tech Stack
- Frontend: React 18, React Router 6, Tailwind CSS, Recharts, Leaflet
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, express‑validator
- Tooling: Nodemon, Concurrently, Axios, dotenv

## Getting Started (Local)
1) Install
```bash
# from project root
npm install
cd server && npm install
cd ../client && npm install
```

2) Environment (create `server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/road_safety_guard
# For hosted DB, use your Atlas URI instead
# MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
```

3) Run (concurrently)
```bash
# from project root
npm run dev
# Frontend: http://localhost:3001 (configured)
# Backend API: http://localhost:5000
```

## API Overview (selected)
- Auth
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/me`
- Accidents
  - POST `/api/accidents`
  - GET `/api/accidents`
  - GET `/api/accidents/:id`
- Analytics
  - GET `/api/analytics/dashboard`
  - GET `/api/analytics/trends`
  - GET `/api/analytics/heatmap`

## Architecture
- `client/` React SPA
  - Pages, components, routing, context (`AuthContext`), UI (Tailwind)
- `server/` Express API
  - `routes/`, `controllers/`, `models/`, `middleware/`
  - `config/db.js` for Mongo connection, `server.js` for app boot

## Deployment
- Frontend is deployed on Vercel: [`road-safety-guard-rcxx.vercel.app`](https://road-safety-guard-rcxx.vercel.app/)
- Backend can be deployed to Render/Railway/Heroku or a VPS
  - Set environment variables on the platform: `MONGODB_URI`, `PORT`, `CORS_ORIGIN`
  - Update client base URL if the API is hosted on a different domain

## Seed Data (Optional)
```bash
# generates demo users and accidents
cd server
npm run seed
```

## Contact
For placement queries or demos, please reach out via email or LinkedIn.

—

This project is open‑source (MIT). Contributions and feedback are welcome.
