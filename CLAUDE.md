# CLAUDE.md

Guia para trabalhar neste repositório com o Claude Code.

## O que é este projeto

Trabalho prático da disciplina (ver `regras_trabalho.md`): uma aplicação web de **vaquinha** (arrecadação coletiva). Usuários criam campanhas com meta de valor; outros usuários contribuem com valores simulados (sem gateway de pagamento real).

Avaliação prioriza **organização e simplicidade do código** sobre quantidade de funcionalidades. Ver `ARCHITECTURE.md` para o desenho completo e `DECISIONS.md` para o porquê de cada escolha.

## Regra de ouro

**Não adicionar complexidade além do que os critérios em `regras_trabalho.md` exigem.** Sem ORM, sem state manager, sem gateway de pagamento, sem testes automatizados de UI, sem abstrações para casos hipotéticos. Three similar lines beat a premature abstraction.

## Stack

- Next.js (App Router), TypeScript
- `@libsql/client` — SQLite (Turso) via queries SQL diretas, sem ORM
- `bcryptjs` — hash de senha
- `iron-session` — sessão via cookie
- Tailwind CSS — estilo responsivo

## Estrutura

Ver `ARCHITECTURE.md` para a árvore de arquivos completa e o schema do banco.

## Comandos

```bash
npm run dev      # desenvolvimento local
npm run build    # build de produção
npm run start    # rodar build de produção
```

Variáveis de ambiente necessárias em `.env.local`: `TURSO_URL`, `TURSO_TOKEN`, `SESSION_SECRET` (ver `.env.example`).

## Padrões de código

- Queries SQL diretas em `lib/db.ts`, sem camada de ORM.
- Autenticação via `lib/session.ts` (iron-session) + `proxy.ts` — toda rota fora de `/login` e `/register` exige sessão.
- Senhas sempre com hash (`bcryptjs`), nunca em texto plano.
- Comentários só quando o "porquê" não é óbvio pelo código (ex: por que um valor está em centavos).
