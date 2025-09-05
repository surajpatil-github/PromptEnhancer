# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
# server deps (use ci if lockfile exists; fallback to install)
COPY package*.json ./
RUN npm ci || npm install
# client deps
COPY client/package*.json client/
RUN cd client && (npm ci || npm install)

# ---------- build client ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN cd client && npm run build

# ---------- production ----------
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
RUN npm prune --omit=dev || true
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
