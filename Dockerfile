# syntax=docker/dockerfile:1

### Stage 1: install deps ###
FROM node:22-alpine AS deps

# enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
# copy manifests for pnpm
COPY package.json pnpm-lock.yaml ./
# install deps
RUN pnpm install --ignore-scripts

### Stage 2: build ###
FROM node:22-alpine AS builder

ARG PORT=3333
ENV PORT=${PORT}
ENV NODE_ENV=development

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
# bring in deps
COPY --from=deps /app/node_modules ./node_modules
# copy source & build
COPY . .
RUN pnpm run build

### Stage 3: production image ###
FROM node:22-alpine AS runner

ARG PORT=3333
ENV PORT=${PORT}
ENV NODE_ENV=production

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
# copy build output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# remove dev dependencies
RUN pnpm prune --prod

# drop to non-root for safety
USER node

EXPOSE ${PORT}

CMD ["sh", "-c", "cd build && pnpm run start"]
