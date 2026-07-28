# Local Kubernetes (kind)

## Pré-requisitos
Docker rodando + `kind` e `kubectl` (`brew install kind kubectl`).

## Subir
```bash
kind create cluster --name hospital
# build + load das imagens
docker build -f docker/hospital-core.Dockerfile  -t hospital-core:local .
docker build -f docker/hospital-core.Dockerfile  --target build -t hospital-migrate:local .
docker build -f docker/pharma-service.Dockerfile -t pharma-service:local .
docker build -f docker/pharma-service.Dockerfile --target build -t pharma-migrate:local .
kind load docker-image hospital-core:local pharma-service:local hospital-migrate:local pharma-migrate:local --name hospital
# aplicar (NÃO toca no banco)
kubectl apply -k deploy/k8s/overlays/dev

# esperar o Postgres de cada serviço ficar pronto antes de migrar
kubectl -n hospital-management rollout status statefulset/hospital-postgres --timeout=120s
kubectl -n hospital-management rollout status statefulset/pharma-postgres --timeout=120s
```

> `/health` retorna 500 até o Job de migrate rodar — isso é esperado, não é bug.

## Migrations + seed (opt-in)
```bash
kubectl apply -f deploy/k8s/jobs/migrate-job.yaml
```

### Re-rodar migrations
Os Jobs são imutáveis: um `apply -f` sobre um Job já existente falha (`field is immutable`) ou não faz nada
(`unchanged`). Os Jobs têm `ttlSecondsAfterFinished: 300` e se auto-limpam 5 minutos após terminar, mas para
re-rodar antes disso (ou forçar uma nova execução imediatamente), apague e reaplique:
```bash
kubectl -n hospital-management delete job hospital-migrate pharma-migrate --ignore-not-found
kubectl apply -f deploy/k8s/jobs/migrate-job.yaml
```

## Acessar
```bash
kubectl -n hospital-management port-forward svc/hospital-core 3333:3333
kubectl -n hospital-management port-forward svc/pharma-service 5001:5001
```

## Derrubar
```bash
kubectl delete -k deploy/k8s/overlays/dev  # remove a app (mantém o cluster)
kind delete cluster --name hospital        # remove o cluster inteiro
```

## Ambientes (overlays)
- `overlays/dev` — kind local: apps + Postgres/Redis in-cluster.
- `overlays/prod` — TEMPLATE (não deployado aqui): banco gerenciado via secret, 3 réplicas, imagem de registry. Renderizar com `kubectl kustomize deploy/k8s/overlays/prod`.

> Frontend, Ingress e HPA ficam fora do escopo por enquanto.
