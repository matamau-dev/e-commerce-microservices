# nestjs/auth-service/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY src/infrastructure/jwt/rs256/private.key ./src/infrastructure/jwt/rs256/private.key
COPY src/infrastructure/jwt/rs256/public.key  ./src/infrastructure/jwt/rs256/public.key

EXPOSE 3002
CMD ["node", "dist/main.js"]