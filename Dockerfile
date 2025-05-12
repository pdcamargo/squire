# syntax=docker/dockerfile:1

### Stage 1: install deps ###
FROM node:22-alpine AS deps

WORKDIR /app
# only copy package manifests (cache deps install)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --force

### Stage 2: build ###
FROM node:22-alpine AS builder

ARG PORT=3333
ENV NODE_ENV=development

WORKDIR /app
# bring in deps
COPY --from=deps /app/node_modules ./node_modules
# copy source & build
COPY . .
RUN npm run build

### Stage 3: production image ###
FROM node:22-alpine AS runner

ARG PORT=3333
ENV PORT=${PORT}
ENV NODE_ENV=production

WORKDIR /app
# copy build output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# remove any dev deps that snuck in
RUN npm prune --production --force

# drop to non-root for safety
USER node

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
