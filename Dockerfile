# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Removed all ARG/ENV declarations for VITE_*

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
