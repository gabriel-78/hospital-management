# hospital-management

Aplicação para gerenciamento de hospitais: cadastro de médicos e pacientes, agendamento de consultas, registro do resultado da consulta e emissão de prescrição com medicamentos vindos de um catálogo farmacêutico.

O projeto é um **monorepo** com dois backends independentes (cada um com o seu banco), um pacote compartilhado de domínio e um frontend em React.

---

## Sumário

- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como o projeto funciona, passo a passo](#como-o-projeto-funciona-passo-a-passo)
- [Como executar o projeto (local)](#como-executar-o-projeto)
- [Outras formas de executar](#outras-formas-de-executar)
  - [Docker Compose](#docker-compose-backends-também-em-container)
  - [Kubernetes local (kind)](#kubernetes-local-kind)
- [Scripts disponíveis](#scripts-disponíveis)
- [Endpoints da API](#endpoints-da-api)
- [Problemas comuns](#problemas-comuns)

---

## Arquitetura

```
┌───────────────────┐   HTTP   ┌─────────────────────┐   HTTP   ┌─────────────────────┐
│ Frontend (React)  │ ───────▶ │ hospital-core :3333 │ ───────▶ │ pharma-service :5001│
│ Vite        :5173 │          └──────────┬──────────┘          └──────────┬──────────┘
└───────────────────┘                     │                                │
                                ┌─────────┴─────────┐                      │ Prisma
                         Prisma │                   │ cache                ▼
                                ▼                   ▼              ┌─────────────────┐
                    ┌─────────────────────┐  ┌──────────────┐      │ Postgres :5433  │
                    │ Postgres :5432      │  │ Redis :6379  │      │ db: pharma      │
                    │ db: hospital-mgmt   │  └──────────────┘      └─────────────────┘
                    └─────────────────────┘
```

| Componente | Porta | Responsabilidade |
|---|---|---|
| `frontend` | 5173 | Interface web. Conversa **apenas** com o `hospital-core`. |
| `services/hospital-core` | 3333 | API principal: empresas, médicos, pacientes, consultas, resultados e prescrições. Faz cache no Redis e consulta o `pharma-service` para buscar medicamentos. |
| `services/pharma-service` | 5001 | API do catálogo de produtos farmacêuticos (medicamentos). |
| `packages` (`@shared/core`) | — | Código de domínio compartilhado pelos dois backends: entidades base, `Either`/`Result`, `AppError` e Value Objects (CNPJ, CRM, endereço, nome, id). |
| Postgres `hospital-postgres` | 5432 | Banco do `hospital-core`. |
| Postgres `pharma-postgres` | 5433 | Banco do `pharma-service`. |
| Redis | 6379 | Cache do `hospital-core` (lista de médicos e produtos da farmácia). |

---

## Tecnologias

### Monorepo e ferramentas
| Tecnologia | Uso |
|---|---|
| **pnpm 9 (workspaces)** | Gerenciador de pacotes; liga os pacotes do monorepo entre si (`@shared/core` é consumido via `workspace:*`). |
| **Turborepo** | Orquestra os scripts (`dev`, `build`, `typecheck`, `lint`) em todos os pacotes de uma vez. |
| **TypeScript** | Linguagem de todo o projeto (backends, frontend e pacote compartilhado). |
| **ESLint + Prettier** | Padronização e qualidade de código. |

### Backends (`hospital-core` e `pharma-service`)
| Tecnologia | Uso |
|---|---|
| **Node.js + Express 5** | Servidor HTTP. |
| **Prisma 7** (com `@prisma/adapter-pg` e `pg`) | ORM, migrations e seeds. Os schemas ficam divididos em arquivos em `prisma/schemas/`. |
| **PostgreSQL** | Banco relacional (um banco por serviço). |
| **Redis** (`redis` v5) | Cache no `hospital-core`. |
| **Zod 4** | Validação das variáveis de ambiente e dos dados de entrada das rotas. |
| **Axios** | Cliente HTTP que o `hospital-core` usa para chamar o `pharma-service`. |
| **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) | Documentação interativa da API em `/docs`. |
| **tsx** | Execução em modo desenvolvimento com *hot reload* (`tsx watch`). |
| **tsup** | Build de produção (gera `dist/server.js`). |

### Frontend
| Tecnologia | Uso |
|---|---|
| **React 19 + Vite 7** | SPA e servidor de desenvolvimento. |
| **React Router 7** | Rotas da aplicação. |
| **TanStack Query 5** | Busca, cache e sincronização dos dados da API. |
| **Axios** | Cliente HTTP (`src/infra/api.ts`). |
| **Zustand** | Estado global persistido (sessão: médico ou paciente selecionado). |
| **React Hook Form + Zod** | Formulários e validação. |
| **Tailwind CSS 3 + shadcn/ui (Radix UI)** | Estilos e componentes acessíveis (`src/components/ui`). |
| **lucide-react, sonner, date-fns, react-day-picker** | Ícones, notificações, datas e calendário. |

### Infraestrutura
| Tecnologia | Uso |
|---|---|
| **Docker** (multi-stage, `node:22-alpine`) | Imagens dos backends em `docker/`. |
| **Docker Compose** | Stack local completa em `deploy/compose/`. |
| **Kubernetes (kind + Kustomize)** | Manifests com overlays `dev` e `prod` em `deploy/k8s/`. |

---

## Estrutura de pastas

```
hospital-management/
├── frontend/                  # SPA React (Vite)
│   └── src/
│       ├── components/        # Layouts, diálogos e componentes de UI (shadcn)
│       ├── infra/api.ts       # Instância do axios apontando para o hospital-core
│       ├── modules/           # Um módulo por domínio: doctor, patient, consultation,
│       │                      #   consultation-result, pharma
│       │                      #   (cada um com pages, components, hooks, services, schemas)
│       ├── pages/RootPage.tsx # Página inicial (escolha de sessão)
│       ├── routes/            # Definição das rotas
│       └── stores/            # Estado global (Zustand)
├── services/
│   ├── hospital-core/         # API principal (pacote "backend")
│   │   ├── prisma/            # schemas/, migrations/, seed/
│   │   └── src/
│   │       ├── infra/         # server.ts, env.ts, rotas, banco, cache (Redis), middlewares
│   │       ├── modules/       # company, doctor, patient, consultation,
│   │       │                  #   consultation-result, integrations/pharma, health
│   │       └── shared/        # Contratos compartilhados (ex.: interface de cache)
│   └── pharma-service/        # API do catálogo de produtos
│       ├── prisma/
│       └── src/modules/       # product, health
├── packages/                  # @shared/core: entidades base, Either/Result, Value Objects
├── docker/                    # Dockerfiles dos backends
├── deploy/
│   ├── compose/               # docker-compose.yml (Postgres x2, Redis, backends, migrations)
│   └── k8s/                   # base/, overlays/dev, overlays/prod, jobs/ (migrations)
├── turbo.json
└── pnpm-workspace.yaml
```

### Organização de um módulo do backend

Todos os módulos seguem a mesma divisão em camadas. Exemplo com `doctor`:

```
modules/doctor/
├── doctor.domain.ts           # Entidade de domínio e regras de negócio (usa os VOs do @shared/core)
├── use-cases/                 # Um caso de uso por arquivo (create, list, find-by-id, update, delete)
├── infra/
│   ├── doctor.repository.ts         # Interface do repositório
│   ├── prisma-doctor.repository.ts  # Implementação com Prisma
│   ├── cached-doctor.repository.ts  # Decorator que adiciona cache Redis
│   └── doctor.mapper.ts             # Conversão domínio ⇄ banco
├── http/                      # routes (com validação Zod), controller e presenter
└── schemas/                   # Schemas Zod de entrada (input) e saída (output)
```

O fluxo de uma requisição é: **rota → validação (Zod) → controller → use case → repositório (cache → Prisma) → presenter → resposta JSON**. Os erros de domínio trafegam como `Either` em vez de exceções.

---

## Como o projeto funciona, passo a passo

1. **Escolha de sessão.** Na página inicial, o usuário escolhe entrar como **médico** ou **paciente** e seleciona um registro da lista (ou cadastra/edita um). A escolha fica salva no navegador (Zustand com `persist`).
2. **Cadastro de médicos e pacientes.** O frontend chama `POST/PUT/DELETE /doctors` e `/patients` no `hospital-core`. O CRM do médico é validado por um Value Object do `@shared/core`. Os registros usam *soft delete* (`deletedAt`).
3. **Agendamento de consultas.** Na tela **Consultas** (`/consultations`), é criada uma consulta ligando médico, paciente e data (`POST /consultations`). Toda consulta nasce com status `SCHEDULED`.
4. **Ciclo de vida da consulta.** A consulta pode ser **remarcada** (`PATCH /consultations/:id/reschedule`), **cancelada** (`.../cancel` → `CANCELLED`) ou **concluída** (`.../complete` → `COMPLETED`).
5. **Resultado e prescrição.** Ao concluir, o médico registra o resultado (`POST /consultation-results`) com uma descrição e, opcionalmente, uma prescrição com itens (medicamento, dosagem, duração, instruções).
6. **Busca de medicamentos.** Para preencher a prescrição, o frontend busca produtos em `GET /integrations/pharma/products` no `hospital-core`, que repassa a chamada ao `pharma-service` (`GET /products`) e guarda o resultado no Redis. O id do produto escolhido fica salvo no item da prescrição (`remedyId`).
7. **Histórico.** A tela **Histórico** (`/history`) lista as consultas passadas e os respectivos resultados.

### Modelo de dados

**`hospital-core`** (banco `hospital-management`):
- `Company` — hospital ou clínica (`HOSPITAL` | `CLINIC`), com CNPJ e endereço.
- `Doctor` — nome e CRM (único).
- `Patient` — nome.
- `Consultation` — médico + paciente + data, status `SCHEDULED` | `CANCELLED` | `COMPLETED`.
- `ConsultationResult` — descrição do atendimento (1 por consulta).
- `Prescription` e `PrescriptionItem` — prescrição do resultado e seus medicamentos.
- `HealthCheck` — usado pela rota `/health`.

**`pharma-service`** (banco `pharma`):
- `Product` — nome (único), categoria e princípio ativo.
- `HealthCheck`.

---

## Como executar o projeto

Este é o caminho recomendado para desenvolvimento: **bancos e Redis no Docker**, **backends e frontend rodando localmente** com *hot reload*.

> **Em qual diretório rodar os comandos?**
> Salvo indicação em contrário, **todos os comandos devem ser executados na raiz do repositório** (a pasta `hospital-management/`, onde ficam `package.json`, `pnpm-workspace.yaml` e `turbo.json`). Cada passo abaixo traz uma linha **📁 Diretório** dizendo onde rodar.
>
> Isso funciona porque:
> - os caminhos usados nos comandos (`deploy/compose/...`, `docker/...`) são relativos à raiz;
> - o `pnpm --filter <pacote>` executa o comando **dentro da pasta do pacote** (por exemplo, `--filter backend` roda em `services/hospital-core/`), então não é preciso fazer `cd`.
>
> Para conferir se você está no lugar certo: `ls pnpm-workspace.yaml` deve encontrar o arquivo.

| Nome no `--filter` | Pasta do pacote |
|---|---|
| `backend` | `services/hospital-core/` |
| `pharma-service` | `services/pharma-service/` |
| `hospital-management-portal` | `frontend/` |
| `@shared/core` | `packages/` |

### 1. Pré-requisitos

| Ferramenta | Versão | Como verificar |
|---|---|---|
| Node.js | 22 ou superior | `node -v` |
| pnpm | 9.15.0 | `pnpm -v` (instale com `corepack enable && corepack prepare pnpm@9.15.0 --activate`) |
| Docker (com Docker Compose) | recente | `docker compose version` |

As portas **5173, 3333, 5001, 5432, 5433 e 6379** precisam estar livres.

### 2. Clonar e instalar as dependências

📁 **Diretório:** a pasta onde você guarda seus projetos; depois do `cd`, a raiz do repositório.

```bash
git clone <url-do-repositorio> hospital-management
cd hospital-management          # a partir daqui você está na raiz
pnpm install
```

Um único `pnpm install` **na raiz** instala as dependências de todos os pacotes do monorepo. Não rode `pnpm install` (nem `npm install`) dentro das subpastas.

### 3. Configurar as variáveis de ambiente

📁 **Diretório:** raiz do repositório.

Cada pacote lê o seu próprio `.env`, que fica **dentro da pasta do pacote** (não na raiz). Crie os três arquivos a partir dos exemplos:

```bash
cp services/hospital-core/.env.example  services/hospital-core/.env
cp services/pharma-service/.env.example services/pharma-service/.env
cp frontend/.env.example                frontend/.env
```

Depois edite cada um para ficar com o conteúdo abaixo:

**`services/hospital-core/.env`**
```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/hospital-management"
PHARMA_SERVICE_URL="http://localhost:5001"
# Opcionais (valores padrão):
# PORT=3333
# REDIS_URL="redis://localhost:6379"
# FRONT_END_URL="http://localhost:5173"
```

**`services/pharma-service/.env`**
```env
DATABASE_URL="postgresql://admin:admin@localhost:5433/pharma"
PORT=5001
FRONT_END_URL="http://localhost:5173"
```

**`frontend/.env`**
```env
VITE_API_URL="http://localhost:3333"
```

> O frontend lê `VITE_API_URL` (em `src/infra/api.ts`). Use esse nome, mesmo que o `.env.example` mostre outro.

`FRONT_END_URL` é a origem liberada no CORS dos backends. Se mudar a porta do frontend, ajuste essa variável.

### 4. Subir os bancos e o Redis

📁 **Diretório:** raiz do repositório (o `-f` aponta para o arquivo do Compose a partir dela).

```bash
docker compose -f deploy/compose/docker-compose.yml up -d --wait hospital-postgres pharma-postgres redis
```

O `--wait` só devolve o terminal quando os três containers estiverem saudáveis.

### 5. Gerar o client do Prisma

📁 **Diretório:** raiz do repositório.

```bash
pnpm --filter backend exec prisma generate
pnpm --filter pharma-service exec prisma generate
```

Isso gera o código do client em `src/generated/prisma` de cada serviço (não acessa o banco). Repita sempre que alterar um arquivo em `prisma/schemas/`.

> O `hospital-core` aparece como `backend` nos comandos `--filter`, porque esse é o `name` no `package.json` dele.

<details>
<summary>Prefere entrar na pasta de cada serviço?</summary>

O resultado é o mesmo. O Prisma precisa ser executado **dentro da pasta do serviço**, onde ficam o `prisma.config.ts` e o `.env`:

```bash
cd services/hospital-core && pnpm exec prisma generate && cd ../..
cd services/pharma-service && pnpm exec prisma generate && cd ../..
```
</details>

### 6. Criar as tabelas (migrations) e popular os bancos (seeds)

📁 **Diretório:** raiz do repositório.

Necessário só na primeira execução, ou depois de apagar os volumes do Docker:

```bash
pnpm --filter backend exec prisma migrate deploy
pnpm --filter backend exec prisma db seed

pnpm --filter pharma-service exec prisma migrate deploy
pnpm --filter pharma-service exec prisma db seed
```

> Rodar `prisma ...` direto na raiz, **sem** o `--filter`, falha: o Prisma não encontra o schema nem o `.env`. Use o `--filter` ou entre na pasta do serviço, como no passo 5.

Dados criados pelos seeds:
- **hospital-core:** 2 empresas, 5 médicos e 5 pacientes.
- **pharma-service:** 50 produtos.

### 7. Iniciar backends e frontend

📁 **Diretório:** raiz do repositório.

```bash
pnpm dev
```

O Turborepo inicia os três processos em paralelo, no mesmo terminal. Quando estiver pronto, aparecem as mensagens:

```
pharma-service:dev: Server is running on http://localhost:5001
backend:dev: [Redis] Connected
backend:dev: Server is running on http://localhost:3333
hospital-management-portal:dev:   ➜  Local:   http://localhost:5173/
```

Para rodar só um deles (também na raiz, um por terminal):
```bash
pnpm --filter backend dev                       # hospital-core
pnpm --filter pharma-service dev
pnpm --filter hospital-management-portal dev    # frontend
```

Ou, entrando na pasta de cada um:
```bash
cd services/hospital-core  && pnpm dev
cd services/pharma-service && pnpm dev
cd frontend                && pnpm dev
```

### 8. Acessar

| O quê | Endereço |
|---|---|
| Aplicação web | http://localhost:5173 |
| API hospital-core + Swagger | http://localhost:3333 · http://localhost:3333/docs |
| API pharma-service + Swagger | http://localhost:5001 · http://localhost:5001/docs |
| Health checks | http://localhost:3333/health · http://localhost:5001/health |

Teste rápido pelo terminal:
```bash
curl http://localhost:3333/doctors
curl http://localhost:5001/products
```

### 9. Acessar os bancos (opcional)

| | hospital-core | pharma-service |
|---|---|---|
| Host | `localhost` | `localhost` |
| Porta | `5432` | `5433` |
| Banco | `hospital-management` | `pharma` |
| Usuário / senha | `admin` / `admin` | `admin` / `admin` |

Use qualquer cliente PostgreSQL (DBeaver, extensão PostgreSQL do VS Code etc.) ou o Prisma Studio (📁 raiz do repositório):
```bash
pnpm --filter backend studio
pnpm --filter pharma-service studio
```

### 10. Parar tudo

1. No terminal do `pnpm dev`, pressione `Ctrl+C`.
2. Pare os containers (📁 raiz do repositório):
   ```bash
   docker compose -f deploy/compose/docker-compose.yml down       # mantém os dados
   docker compose -f deploy/compose/docker-compose.yml down -v    # apaga também os dados
   ```

Para voltar a trabalhar depois, basta repetir os passos **4** e **7**. As migrations e seeds só precisam ser refeitas se você usou `down -v`.

---

## Outras formas de executar

### Docker Compose (backends também em container)

Sobe Postgres x2, Redis e os dois backends a partir dos Dockerfiles.

📁 **Diretório:** raiz do repositório.

```bash
docker compose -f deploy/compose/docker-compose.yml up -d --build

# migrations + seed (na primeira vez)
docker compose -f deploy/compose/docker-compose.yml --profile init up hospital-migrate pharma-migrate --build --abort-on-container-exit
```

O frontend ainda não está no Compose. Rode-o localmente com `pnpm --filter hospital-management-portal dev`. Mais detalhes em [deploy/compose/README.md](deploy/compose/README.md).

### Kubernetes local (kind)

Nesta forma, os **dois backends, os dois Postgres e o Redis rodam dentro de um cluster Kubernetes local** criado com o [kind](https://kind.sigs.k8s.io/) (Kubernetes rodando dentro do Docker). O **frontend continua rodando na sua máquina** e acessa o cluster por `port-forward`.

Os manifests ficam em `deploy/k8s/` e usam Kustomize:

| Pasta | Conteúdo |
|---|---|
| `base/` | `Deployment` e `Service` do `hospital-core` e do `pharma-service`. |
| `overlays/dev/` | Namespace `hospital-management`, Postgres x2 (`StatefulSet`), Redis, `ConfigMap` e `Secret` de desenvolvimento. É o que usamos localmente. |
| `overlays/prod/` | Modelo para produção (banco gerenciado via secret, 3 réplicas, imagem de registry). **Não é aplicado localmente.** |
| `jobs/migrate-job.yaml` | Jobs que rodam as migrations e os seeds nos dois bancos. |

> 📁 **Todos os comandos desta seção são executados na raiz do repositório.** Os `docker build` usam a raiz como contexto (o `.` no final) e os caminhos `deploy/k8s/...` são relativos a ela.

#### 1. Pré-requisitos

| Ferramenta | Como instalar (macOS) | Como verificar |
|---|---|---|
| Docker Desktop **aberto e rodando** | [docker.com](https://www.docker.com/products/docker-desktop/) | `docker ps` |
| kind | `brew install kind` | `kind version` |
| kubectl | `brew install kubectl` | `kubectl version --client` |

As portas **3333 e 5001** precisam estar livres na sua máquina. Pare o `pnpm dev` dos backends e o Docker Compose, se estiverem rodando.

#### 2. Criar o cluster

```bash
kind create cluster --name hospital
kubectl cluster-info --context kind-hospital   # confirma que o kubectl aponta para o cluster novo
```

#### 3. Gerar as imagens e carregá-las no cluster

O cluster do kind **não enxerga as imagens do seu Docker local**. Por isso é preciso gerar as imagens e depois carregá-las com `kind load`.

```bash
# imagens das APIs
docker build -f docker/hospital-core.Dockerfile  -t hospital-core:local .
docker build -f docker/pharma-service.Dockerfile -t pharma-service:local .

# imagens usadas pelos Jobs de migration (estágio "build", que tem o Prisma CLI)
docker build -f docker/hospital-core.Dockerfile  --target build -t hospital-migrate:local .
docker build -f docker/pharma-service.Dockerfile --target build -t pharma-migrate:local .

# carrega as 4 imagens no cluster
kind load docker-image hospital-core:local pharma-service:local hospital-migrate:local pharma-migrate:local --name hospital
```

#### 4. Subir a aplicação

```bash
kubectl apply -k deploy/k8s/overlays/dev

# espera os bancos ficarem prontos
kubectl -n hospital-management rollout status statefulset/hospital-postgres --timeout=120s
kubectl -n hospital-management rollout status statefulset/pharma-postgres --timeout=120s

# confere os pods
kubectl -n hospital-management get pods
```

> Até o passo 5 rodar, o `/health` dos backends responde 500. Isso é esperado: as tabelas ainda não existem.

#### 5. Rodar as migrations e os seeds

Os bancos do cluster são **independentes** dos bancos do Docker Compose e começam vazios. O Job abaixo cria as tabelas e popula os dois bancos:

```bash
kubectl apply -f deploy/k8s/jobs/migrate-job.yaml
kubectl -n hospital-management wait --for=condition=complete job/hospital-migrate job/pharma-migrate --timeout=180s

# (opcional) ver o log das migrations
kubectl -n hospital-management logs job/hospital-migrate
kubectl -n hospital-management logs job/pharma-migrate
```

#### 6. Expor as APIs para a sua máquina

Os serviços só existem dentro do cluster. Para acessá-los em `localhost`, abra **um terminal para cada** comando e deixe-os rodando:

```bash
kubectl -n hospital-management port-forward svc/hospital-core 3333:3333
```
```bash
kubectl -n hospital-management port-forward svc/pharma-service 5001:5001
```

Teste em outro terminal:
```bash
curl http://localhost:3333/health
curl http://localhost:3333/doctors
```

O Swagger fica em http://localhost:3333/docs e http://localhost:5001/docs.

#### 7. Rodar o frontend

Em um novo terminal, ainda na raiz do repositório:

```bash
pnpm install                                   # se ainda não instalou as dependências
pnpm --filter hospital-management-portal dev
```

Acesse http://localhost:5173. O `frontend/.env` com `VITE_API_URL="http://localhost:3333"` (veja o [passo 3](#3-configurar-as-variáveis-de-ambiente) da execução local) aponta para o `port-forward`, ou seja, para o cluster.

#### 8. Acessar os bancos do cluster (opcional)

Os Postgres do cluster não ficam expostos. Faça um `port-forward` (um terminal para cada):

```bash
kubectl -n hospital-management port-forward svc/hospital-postgres 5432:5432
```
```bash
kubectl -n hospital-management port-forward svc/pharma-postgres 5433:5432
```

Depois conecte em `localhost:5432` (banco `hospital-management`) e `localhost:5433` (banco `pharma`), usuário `admin` e senha `admin` (definida no Secret `deploy/k8s/overlays/dev/app-secret.yaml`). Se o Postgres do Docker Compose estiver rodando, essas portas vão conflitar.

#### 9. Atualizar depois de mudar o código

O cluster roda as imagens, não o código-fonte. Depois de alterar um backend, gere a imagem de novo, recarregue e reinicie o Deployment. Exemplo com o `hospital-core`:

```bash
docker build -f docker/hospital-core.Dockerfile -t hospital-core:local .
kind load docker-image hospital-core:local --name hospital
kubectl -n hospital-management rollout restart deploy/hospital-core
```

Se a mudança incluir uma migration nova, gere também a imagem `hospital-migrate:local`, carregue-a e rode o Job de novo. Jobs não aceitam um segundo `apply`, então apague-os antes:

```bash
kubectl -n hospital-management delete job hospital-migrate pharma-migrate --ignore-not-found
kubectl apply -f deploy/k8s/jobs/migrate-job.yaml
```

#### 10. Comandos úteis para depuração

```bash
kubectl -n hospital-management get pods                         # status dos pods
kubectl -n hospital-management describe pod <nome-do-pod>       # eventos (ex.: ErrImagePull, CrashLoopBackOff)
kubectl -n hospital-management logs deploy/hospital-core -f     # logs em tempo real
kubectl -n hospital-management logs deploy/pharma-service -f
```

| Sintoma | Solução |
|---|---|
| Pod em `ErrImagePull` / `ImagePullBackOff` | A imagem não foi carregada no cluster. Refaça o `kind load` (passo 3). |
| `/health` responde 500 | As migrations não rodaram. Execute o passo 5. |
| `port-forward` falha com `address already in use` | Outro processo usa a porta (Docker Compose ou `pnpm dev`). Pare-o. |
| `kind` falha com `failed to connect to the docker API` | O Docker Desktop está fechado. Abra-o e tente de novo. |

#### 11. Derrubar

```bash
# encerre os port-forwards com Ctrl+C, depois:
kubectl delete -k deploy/k8s/overlays/dev   # remove a aplicação e mantém o cluster
kind delete cluster --name hospital         # remove o cluster inteiro (e os dados dos bancos)
```

Mais detalhes, incluindo o overlay de produção, em [deploy/k8s/README.md](deploy/k8s/README.md).

---

## Scripts disponíveis

Na **raiz** (executam em todos os pacotes via Turborepo):

| Comando | O que faz |
|---|---|
| `pnpm dev` | Inicia backends e frontend em modo desenvolvimento. |
| `pnpm build` | Build de produção dos backends e do pacote compartilhado. |
| `pnpm typecheck` | Checagem de tipos dos backends e do pacote compartilhado. |
| `pnpm lint` | Lint em todos os pacotes que têm o script. |

Em cada **backend** (`pnpm --filter <backend|pharma-service> <script>`):

| Script | O que faz |
|---|---|
| `dev` | `tsx watch` com o `.env` carregado. |
| `build` / `start` | Build com tsup / executa `dist/server.js`. |
| `typecheck` | `tsc --noEmit`. |
| `migrate` | `prisma migrate dev` (cria uma nova migration a partir do schema). |
| `gen-seed` | `prisma db seed`. |
| `studio` | Abre o Prisma Studio. |

No **frontend** (`pnpm --filter hospital-management-portal <script>`): `dev`, `build`, `preview`, `lint`, `typecheck`.

---

## Endpoints da API

A documentação completa, com corpo das requisições e respostas, está no Swagger (`/docs`). Resumo:

### hospital-core (`:3333`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status da API e do banco |
| GET · POST | `/companies` | Lista / cria empresas |
| GET · PUT · DELETE | `/companies/:id` | Busca / atualiza / remove empresa |
| GET · POST | `/doctors` | Lista / cria médicos |
| GET · PUT · DELETE | `/doctors/:id` | Busca / atualiza / remove médico |
| GET · POST | `/patients` | Lista / cria pacientes |
| GET · PUT · DELETE | `/patients/:id` | Busca / atualiza / remove paciente |
| GET · POST | `/consultations` | Lista / agenda consultas |
| GET · DELETE | `/consultations/:id` | Busca / remove consulta |
| PATCH | `/consultations/:id/reschedule` | Remarca a consulta |
| PATCH | `/consultations/:id/cancel` | Cancela a consulta |
| PATCH | `/consultations/:id/complete` | Conclui a consulta |
| POST | `/consultation-results` | Registra resultado (e prescrição) |
| GET | `/consultation-results/:consultationId` | Resultado de uma consulta |
| GET | `/integrations/pharma/products` | Produtos do pharma-service (com cache) |

### pharma-service (`:5001`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status da API e do banco |
| GET · POST | `/products` | Lista / cria produtos |
| GET · PUT · DELETE | `/products/:id` | Busca / atualiza / remove produto |

---

## Problemas comuns

| Sintoma | Causa provável e solução |
|---|---|
| `/health` responde 500 ou as telas ficam vazias com erro | As tabelas não existem. Rode as migrations e seeds (passo 6). |
| Erro de import `#prisma` ou `Cannot find module .../generated/prisma` | O client do Prisma não foi gerado. Rode o passo 5. |
| `ZodError` ao iniciar um backend, citando `DATABASE_URL` | Falta o `.env` do serviço, ou a URL é inválida (passo 3). |
| `[Redis]` com erro de conexão no hospital-core | O container do Redis não está rodando (passo 4). |
| Frontend carrega mas as chamadas falham com erro de CORS | `FRONT_END_URL` nos backends não corresponde à URL do frontend. |
| Frontend chama `undefined/doctors` | Falta `VITE_API_URL` em `frontend/.env`. Reinicie o Vite depois de criar o arquivo. |
| `port is already allocated` ao subir o Docker | Já existe outro Postgres/Redis local usando a porta. Pare-o ou altere a porta no `docker-compose.yml` e no `.env`. |
