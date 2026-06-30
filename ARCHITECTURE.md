# Arquitetura

## Visão geral

Aplicação full-stack única em Next.js (App Router). Sem serviços externos além do banco (Turso) e da hospedagem (Vercel).

```
Browser ──HTTPS──> Next.js (Vercel)
                       │
                       ├── Server Components / Route Handlers
                       │     (auth, campaigns, profile)
                       │
                       └── @libsql/client ──> Turso (SQLite gerenciado)
```

## Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | Next.js (App Router) | Front-end e back-end no mesmo projeto, menos configuração |
| Banco | SQLite via Turso (`@libsql/client`) | Compatível com serverless (Vercel), free tier persistente |
| Senha | bcryptjs | Hash de senha, pure JS, sem build nativo |
| Sessão | iron-session | Cookie assinado/criptografado, funciona no proxy (Edge) |
| Estilo | Tailwind CSS | Responsivo (mobile-first) com pouco código |

Sem ORM: queries SQL diretas em `lib/db.ts`. Sem gateway de pagamento: contribuições são valores simulados gravados direto no banco.

## Estrutura de arquivos

```
web/
  src/
    app/
      layout.tsx                  # layout raiz + navegação
      page.tsx                    # dashboard: lista de campanhas públicas
      login/page.tsx
      register/page.tsx
      profile/page.tsx            # editar nome / dados do usuário
      campaigns/new/page.tsx      # criar campanha
      campaigns/[id]/page.tsx     # detalhe: progresso, contribuintes, form de contribuição
      api/
        auth/register/route.ts
        auth/login/route.ts
        auth/logout/route.ts
        profile/route.ts          # GET/PUT
        campaigns/route.ts        # GET (listar) / POST (criar)
        campaigns/[id]/route.ts   # GET detalhe
        campaigns/[id]/contribute/route.ts  # POST contribuição simulada
    lib/
      db.ts                       # client libsql + criação de tabelas
      session.ts                  # iron-session helpers (getSession)
    proxy.ts                      # protege rotas, redireciona não-autenticados
  .env.local                      # TURSO_URL, TURSO_TOKEN, SESSION_SECRET
```

## Schema do banco

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_cents INTEGER NOT NULL,
  deadline TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount_cents INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

Valores em centavos (`INTEGER`) para evitar erro de ponto flutuante.

## Fluxos principais

**Autenticação**
1. `/register` → `POST /api/auth/register` cria usuário com senha hasheada (bcryptjs) → cria sessão (iron-session) → redireciona ao dashboard.
2. `/login` → `POST /api/auth/login` valida credenciais → cria sessão.
3. `proxy.ts` checa a sessão em toda rota exceto `/login` e `/register`; sem sessão, redireciona para `/login`.
4. `POST /api/auth/logout` destrói a sessão.

**Campanhas (dado compartilhado entre usuários)**
1. Dashboard (`/`): `SELECT campaigns.*, SUM(contributions.amount_cents) AS raised FROM campaigns LEFT JOIN contributions ON ... GROUP BY campaigns.id` — toda campanha de todo usuário aparece para todo usuário logado.
2. `/campaigns/new` → `POST /api/campaigns` cria campanha vinculada ao `owner_id` do usuário da sessão.
3. `/campaigns/[id]`: detalhe da campanha + `SELECT contributions.amount_cents, users.name FROM contributions JOIN users ON ... WHERE campaign_id = ?` lista todos os contribuintes — visível a qualquer usuário autenticado, não só ao dono.
4. Contribuir: `POST /api/campaigns/[id]/contribute` insere linha em `contributions` com o valor informado pelo usuário logado.

**Perfil**
1. `/profile` → `GET /api/profile` carrega dados do usuário da sessão.
2. Atualizar → `PUT /api/profile` atualiza `name` (e opcionalmente outros campos) do usuário autenticado.

## Deploy

- **Vercel** (free tier): hospeda o Next.js, sem sleep, HTTPS automático — resolve o requisito de disponibilidade 24/7.
- **Turso** (free tier): banco SQLite gerenciado, persistente em ambiente serverless (diferente de SQLite em arquivo local, que se perde no disco efêmero de hosts free como Vercel/Render).
- Variáveis de ambiente configuradas no painel do Vercel: `TURSO_URL`, `TURSO_TOKEN`, `SESSION_SECRET`.
