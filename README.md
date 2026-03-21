# ⚡ Thunder Todo

A clean, minimal todo list web app built with React (Vite) + Node.js/Express.

## Features

- ✅ Add todos
- ✓ Mark as complete / incomplete
- 🗑 Delete todos
- 🔍 Filter by status: All / Active / Completed

## Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Deployment**: Docker + docker-compose

## Development

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:3001/todos

## Docker Deployment

```bash
docker-compose up --build
```

App available at http://localhost:3001
