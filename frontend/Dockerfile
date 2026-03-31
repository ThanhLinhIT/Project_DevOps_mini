# ──────────────────────────────────────────────────────────────
# Pickleball Booking System — Frontend Dockerfile
# Multi-stage build: build React app, then serve via Nginx
# ──────────────────────────────────────────────────────────────

# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# Build for production — API calls go through Nginx proxy, so no VITE_API_URL needed
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
