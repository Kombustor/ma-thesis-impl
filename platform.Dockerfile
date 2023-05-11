####### STAGE 1: PRUNER #######
FROM node:17-alpine AS pruner
WORKDIR /prune
COPY . .

RUN npm i -g turbo@1.5.5 && \
    turbo prune --scope platform && \
    cp -R .yarn .yarnrc.yml out/

####### STAGE 2: BUILDER #######
FROM node:17-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /build

# Disable husky postinstall
ENV HUSKY 0
ENV NEXT_TELEMETRY_DISABLED 1

# Build args
ARG NEXT_PUBLIC_ANALYTICS_ID
ARG NEXT_PUBLIC_ANALYTICS_URL
ENV NEXT_PUBLIC_ANALYTICS_ID=$NEXT_PUBLIC_ANALYTICS_ID
ENV NEXT_PUBLIC_ANALYTICS_URL=$NEXT_PUBLIC_ANALYTICS_URL

COPY --from=pruner /prune/out .

RUN yarn install

# Add `ARG` instructions below if you need `NEXT_PUBLIC_` variables
# then put the value on your fly.toml
# Example:
# ARG NEXT_PUBLIC_EXAMPLE="value here"

# Dummy database url for building
ENV DATABASE_URL postgres://postgres:postgres@postgres:5432/postgres

RUN yarn workspace @mbg/api-platform build:prepare && yarn workspace platform build

####### STAGE 3: RUNNER #######
FROM node:17-alpine AS runner
WORKDIR /app

# to fix turborepo
RUN apk add --no-cache libc6-compat

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /build/apps/platform/public ./public
COPY --from=builder /build/apps/platform/public ./apps/platform/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /build/apps/platform/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /build/apps/platform/.next/static ./apps/platform/.next/static

# Copy app source to /source
COPY --from=pruner --chown=nextjs:nodejs /prune/out /source

USER nextjs

ENV PORT 3000

CMD ["node", "apps/platform/server.js"]

