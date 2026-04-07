# DespesAI

Monorepo [Turborepo](https://turborepo.dev) com **API** (Express + Prisma + PostgreSQL) e **web** (Next.js). Este documento cobre apenas o **ambiente de desenvolvimento**.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [pnpm](https://pnpm.io/) 9 (o repositório fixa `packageManager` no `package.json` da raiz)
- PostgreSQL acessível (local ou remoto) para a API

## Estrutura do repositório

| Caminho | Descrição |
|--------|-----------|
| `apps/api` | Backend HTTP (Express), Prisma, JWT, documentação OpenAPI |
| `apps/web` | Frontend (Next.js App Router), BFF em `app/api` que repassa auth para a API |
| `config/eslint-config` | Configuração compartilhada do ESLint |
| `config/typescript-config` | `tsconfig` base do monorepo |
| `config/prettier` | Prettier compartilhado |

## Configuração (desenvolvimento)

### 1. Instalar dependências

Na raiz do repositório:

```sh
pnpm install
```

### 2. Variáveis de ambiente da API

Copie o exemplo e ajuste os valores em `apps/api`:

```sh
cp apps/api/.env.example apps/api/.env
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | URL do PostgreSQL no formato `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public` |
| `JWT_SECRET` | Sim | Segredo para assinar tokens JWT (use uma string longa e aleatória) |
| `PORT` | Não | Porta da API (padrão: **3002**) |
| `CORS_ORIGINS` | Não | Lista separada por vírgula de origens extras permitidas pelo CORS |

A API já permite, por padrão, `http://localhost:3000` e `http://127.0.0.1:3000` (origem do Next em dev).

O Prisma carrega também `apps/api/.env.local` se existir (`prisma.config.ts`).

### 3. Banco de dados e Prisma

Com o PostgreSQL rodando e `DATABASE_URL` correto, em `apps/api`:

```sh
cd apps/api
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

Isso aplica as migrações em `apps/api/prisma/migrations` e gera o client em `apps/api/generated/prisma`.

### 4. Variáveis de ambiente do Next (web)

```sh
cp apps/web/.env.example apps/web/.env
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `API_URL` | Recomendada | URL da API usada nas **rotas de servidor** do Next (proxy/BFF). Ex.: `http://localhost:3002` |
| `NEXT_PUBLIC_API_URL` | Recomendada | Mesma base da API para código que roda no **browser** |
| `JWT_SECRET` | Sim | Deve ser **o mesmo** `JWT_SECRET` da API (usado nas rotas server-side que validam o cookie de sessão) |

## Como rodar em desenvolvimento

### API e web juntos (recomendado)

Na raiz:

```sh
pnpm dev
```

O Turborepo sobe o `dev` de cada app em paralelo:

- **Web:** [http://localhost:3000](http://localhost:3000) (`next dev --port 3000`)
- **API:** [http://localhost:3002](http://localhost:3002) (ou a porta definida em `PORT`)

### Apenas um app

```sh
pnpm exec turbo dev --filter=api
pnpm exec turbo dev --filter=web
```

### Documentação interativa da API

Com a API no ar:

- Swagger UI: [http://localhost:3002/api-docs](http://localhost:3002/api-docs)
- OpenAPI JSON: [http://localhost:3002/openapi.json](http://localhost:3002/openapi.json)

## API (`apps/api`) — estrutura e rotas HTTP

### Organização de pastas (principal)

| Pasta / arquivo | Função |
|-----------------|--------|
| `src/index.ts` | Entrada: cria o app Express e escuta na porta |
| `src/app.ts` | Montagem de middlewares, rotas e tratamento de erros |
| `src/routes/` | Routers Express (`auth.routes.ts`, `user.routes.ts`) |
| `src/services/` | Regras de negócio (ex.: `auth.service.ts`) |
| `src/repositories/` | Acesso a dados (ex.: `user.repository.ts`) |
| `src/schemas/` | Validação / contratos (Zod), ex.: `auth.ts` |
| `src/lib/` | Utilitários (`prisma.ts`, `jwt.ts`, `http-error.ts`) |
| `src/openapi/document.ts` | Documento OpenAPI 3 servido em `/openapi.json` e `/api-docs` |
| `prisma/` | `schema.prisma`, migrações |

### Rotas expostas pelo Express

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET` | `/openapi.json` | Especificação OpenAPI |
| * | `/api-docs` | Interface Swagger |
| `POST` | `/auth/register` | Cadastro |
| `POST` | `/auth/login` | Login (resposta inclui JWT) |
| `POST` | `/user` | Cadastro (mesmo handler de registro) |
| `POST` | `/user/me` | Login (mesmo handler de login) |
| `GET` | `/user/:id` | Dados públicos do usuário por ID |

Erros tipados usam `HttpError`; falhas de validação Zod retornam `400` com `details`.

### Modelo de dados (Prisma)

O modelo `User` está em `apps/api/prisma/schema.prisma` (tabela `users`: `id`, `name`, `email`, `password`, timestamps).

## Web (`apps/web`) — estrutura, páginas e BFF

### Organização de pastas (principal)

| Pasta / arquivo | Função |
|-----------------|--------|
| `src/app/` | App Router do Next.js: `layout.tsx`, páginas e Route Handlers |
| `src/app/api/auth/*` | BFF: chama a API backend e gerencia cookie httpOnly de sessão |
| `src/components/` | Componentes de UI; `ui/` agrada primitives (button, card, input, etc.) |
| `src/contexts/` | React context (ex.: `auth-context.tsx`) |
| `src/lib/` | Cliente HTTP, config da API, erros, schemas compartilhados, helpers de servidor (`server/session-cookie.ts`, `server/backend-env.ts`) |

### Páginas (rotas do browser)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `src/app/page.tsx` | Landing |
| `/login` | `src/app/login/page.tsx` | Login |
| `/register` | `src/app/register/page.tsx` | Cadastro |
| `/dashboard` | `src/app/dashboard/page.tsx` | Área logada (exemplo) |

### Route Handlers (API do Next — BFF)

Estas rotas rodam no servidor Next e conversam com o backend em `API_URL` / `NEXT_PUBLIC_API_URL`:

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `POST` | `/api/auth/login` | Encaminha para `POST /auth/login` na API; define cookie de token |
| `POST` | `/api/auth/register` | Encaminha para `POST /auth/register` |
| `POST` | `/api/auth/logout` | Remove cookie de sessão |
| `GET` | `/api/auth/me` | Valida sessão / usuário atual (lado servidor) |

### Componentes

- **`src/components/ui/`** — Peças de interface reutilizáveis: `button`, `card`, `field`, `input`, `label`, `separator`.
- **`src/components/feature-card.tsx`** — Card de destaque na landing.
- **`src/components/providers.tsx`** — Provedores React usados no `layout`.

### Outros scripts úteis (raiz)

```sh
pnpm lint
pnpm check-types
pnpm format
pnpm build
```

---

Para detalhes de tarefas e cache do Turborepo, veja a [documentação oficial](https://turborepo.dev/docs).
