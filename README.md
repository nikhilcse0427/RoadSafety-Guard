# Road Safety Guard

A modern MERN (MongoDB, Express, React, Node) app to report, analyze, and prevent road accidents. It provides an incident reporting workflow, a data-driven dashboard with high‑risk locations, trends and analytics, and practical safety resources.

## Why this project matters
Road crashes are a major public safety issue. Road Safety Guard helps communities and authorities:
- Report incidents quickly with structured data (severity, casualties, coordinates, etc.)
- Identify high‑risk locations and trends to prioritize interventions
- Share safety guidance and emergency information

## Live Demo
- App: <your-demo-url>
- API: <your-api-url>

## Quick Start
1) Install
```bash
# from project root
npm install
cd server && npm install
cd ../client && npm install
```

2) Environment (server/.env)
```env
MONGODB_URI=mongodb://localhost:27017/road-safety-guard
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

3) Run (concurrently)
```bash
# from project root
npm run dev
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## Core Features
- Authentication: signup/login (JWT), profile management
- Accident Reporting: severity, category, casualties, vehicles, weather, coordinates
- Dashboard: stats cards, recent accidents, high‑risk locations, trends, category analytics, live map
- Admin: verify/reject reports, moderation
- Safety Resources: tips, contacts, guides

## Screens (high‑level)
- Dashboard (analytics + hotspots)
- Recent Accidents (filters + detail view)
- Report Accident (form)
- Admin Panel (verification workflow)
- Settings (profile + danger zone)

## Tech Highlights
- Frontend: React, React Router, Tailwind CSS, Recharts, Leaflet, Axios
- Backend: Node, Express, MongoDB, Mongoose, JWT, express‑validator
- DX: Modular routes/controllers, context‑based auth, Toast notifications

## API Overview (selected)
- Auth
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/me`
  - PUT `/api/auth/profile`
  - DELETE `/api/auth/delete`
- Accidents
  - POST `/api/accidents`
  - GET `/api/accidents`
  - GET `/api/accidents/:id`
  - PUT `/api/accidents/:id`
  - DELETE `/api/accidents/:id`
- Analytics
  - GET `/api/analytics/dashboard`
  - GET `/api/analytics/trends`
  - GET `/api/analytics/heatmap`

## Architecture (at a glance)
- client/ (React SPA)
  - Routing, pages, components
  - AuthContext for session + Axios config
- server/ (Express API)
  - routes/ (auth, accidents, analytics, admin)
  - controllers/ (business logic)
  - models/ (User, Accident)
  - middleware/ (auth)

## Setup Tips
- Seed data: run `node server/seed.js` to populate demo users and accidents
- API base URL: client uses relative URLs by default; set `REACT_APP_API_BASE_URL` if deploying separately
- Maps: Leaflet + OSM tiles (no API key required)

## Design Decisions & Trade‑offs
- Simplicity first: REST API + Mongo aggregations for analytics
- Coordinates stored on accident for easy mapping; analytics aggregate by location
- Role‑based actions (user, admin) to keep moderation simple

## Contributing
- Fork, create a feature branch, open a PR
- Please include clear descriptions and screenshots/gifs of UI changes

## License
MIT
