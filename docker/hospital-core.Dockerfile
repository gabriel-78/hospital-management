# syntax=docker/dockerfile:1

########## base: node + pnpm ##########
FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

########## deps: install completo (cacheado nos manifests) ##########
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/package.json ./packages/
COPY services/hospital-core/package.json ./services/hospital-core/
COPY services/pharma-service/package.json ./services/pharma-service/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

########## build: prisma generate + tsup + deploy enxuto ##########
FROM deps AS build
COPY packages ./packages
COPY services/hospital-core ./services/hospital-core
# DATABASE_URL dummy: só para o prisma.config carregar (codegen, sem conexão)
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN pnpm --filter backend exec prisma generate
RUN pnpm --filter backend build
# node_modules self-contained só com as prod-deps DESTE serviço (enxuga a imagem):
RUN pnpm --filter backend deploy --prod /deploy

########## runtime: alpine enxuto, não-root ##########
FROM node:22-alpine AS runtime
WORKDIR /app/services/hospital-core
ENV NODE_ENV=production
ENV PORT=3333
# prod node_modules enxuto (via pnpm deploy — só as deps deste serviço)
COPY --from=build /deploy/node_modules ./node_modules
# app buildada + client Prisma gerado + manifest (tem o campo "imports" do #prisma)
COPY --from=build /app/services/hospital-core/dist ./dist
COPY --from=build /app/services/hospital-core/src/generated ./src/generated
COPY --from=build /app/services/hospital-core/package.json ./package.json
USER node
EXPOSE 3333
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" || exit 1
CMD ["node", "dist/server.js"]
