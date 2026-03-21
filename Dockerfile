# Multi-stage build: frontend + backend

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend + serve frontend static files
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public

# Serve static frontend from Express
ENV PORT=3001
EXPOSE 3001

CMD ["node", "index.js"]
