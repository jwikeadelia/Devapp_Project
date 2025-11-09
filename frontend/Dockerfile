# Build stage
FROM node:20 AS builder

WORKDIR /app

# Salin package dan lock file
COPY package*.json ./

# Install dependencies
RUN npm ci

# Salin seluruh source code
COPY . .

# Pastikan semua file bin bisa dieksekusi (khususnya vite)
RUN chmod -R +x node_modules/.bin

# Jalankan build lewat npm exec (bukan npx)
RUN npm exec vite build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
