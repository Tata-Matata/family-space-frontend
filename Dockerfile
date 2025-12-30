# Stage 1: Build the Angular app
# =========================
# 1️⃣ Build stage
# =========================

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
# Use production config (defaultConfiguration is "production" in angular.json)
RUN npm run build -- --configuration=production

# =========================
# 2️⃣ Runtime stage
# =========================

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Remove default NGINX static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built app to NGINX html directory
COPY --from=builder /app/dist/family-space-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]