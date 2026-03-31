# ──────────────────────────────────────────────────────────────
# Pickleball Booking System — Backend Dockerfile
# Multi-stage build: install dependencies then run
# ──────────────────────────────────────────────────────────────

# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY src/ ./src/

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

# Expose port (default 5000)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
