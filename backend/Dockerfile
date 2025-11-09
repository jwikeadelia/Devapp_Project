# Gunakan image Node.js
FROM node:18

WORKDIR /app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

# Copy semua file project
COPY . .

# Copy skrip wait-for-db.sh
COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

# Expose port
EXPOSE 5000

# Jalankan backend setelah DB siap
CMD ["./wait-for-db.sh", "db", "npm", "start"]
