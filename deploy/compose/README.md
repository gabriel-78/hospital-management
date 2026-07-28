# Local stack (Docker Compose)

Sobe os backends + Postgres (x2) + Redis a partir dos Dockerfiles.

## Subir tudo
```bash
docker compose -f deploy/compose/docker-compose.yml up -d --build
```
- hospital-core → http://localhost:3333 (docs em /docs)
- pharma-service → http://localhost:5001 (docs em /docs)

## Migrations + seed (opt-in, quando você quiser)
```bash
docker compose -f deploy/compose/docker-compose.yml --profile init up hospital-migrate pharma-migrate --build --abort-on-container-exit
```

## Parar / limpar
```bash
docker compose -f deploy/compose/docker-compose.yml down          # para
docker compose -f deploy/compose/docker-compose.yml down -v       # para + apaga volumes (dados)
```

> Frontend não está no compose ainda — rode `pnpm --filter hospital-management-portal dev` (Vite em :5173).
