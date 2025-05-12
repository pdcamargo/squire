# Stage 1: Install dependencies and build
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Only production dependencies
ENV NODE_ENV=production

# Copy built assets and node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Expose AdonisJS default port
EXPOSE 3333

# Run the compiled server
CMD ["node", "bin/server.js"]
