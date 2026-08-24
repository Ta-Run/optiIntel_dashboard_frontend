# optIntel — Incident & File Operations Dashboard

Enterprise-style frontend for an Incident & File Operations Management System.

## Tech Stack

- React 18 + Vite
- React Router
- Tailwind CSS
- Lucide React icons
- Recharts

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

- Operations dashboard with KPIs and charts
- File upload, listing, and detail views with processing timeline
- Incident management with actions and timeline
- Processing jobs monitoring
- Service health operations center
- Dead Letter Queue management
- Audit logs with filters
- Reports and analytics
- Global search and notifications
- Mock API service layer (ready for NestJS backend integration)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── mock/           # Static mock data
├── services/       # API service layer (mock → REST later)
├── hooks/          # Custom React hooks
├── utils/          # Helpers and constants
├── context/        # React context providers
└── routes/         # Route definitions
```

## Backend Integration

Replace mock implementations in `src/services/` with real REST API calls when the NestJS backend is ready.
