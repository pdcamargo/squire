# Stage 1: Install dependencies and build
FROM node:22-alpine AS builder

# allow build-time override of the port (default: 3333)
ARG PORT=3333

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --force

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

ARG PORT=3333
ENV PORT=${PORT}
# Only production dependencies
ENV NODE_ENV=production

WORKDIR /app

# Copy built assets and node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Expose AdonisJS default port
EXPOSE ${PORT}

# Run the compiled server
CMD ["npm", "run", "start"]