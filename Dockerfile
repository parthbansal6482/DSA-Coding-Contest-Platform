FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY index.html vite.config.ts tsconfig.json ./
RUN npm run build

FROM node:20-alpine AS backend-deps

WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

COPY --from=backend-deps /app/server/node_modules ./server/node_modules
COPY server ./server
COPY --from=frontend-builder /app/build ./public

EXPOSE 5001

CMD ["node", "server/src/server.js"]
