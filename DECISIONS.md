# Decisões técnicas

Registro do porquê de cada escolha — útil para justificar o projeto na apresentação.

## Contribuições simuladas, sem gateway de pagamento real

Integrar Stripe/Pix exigiria conta em gateway, modo sandbox, webhooks e tratamento de eventos assíncronos — complexidade alheia aos critérios avaliados (que pedem autenticação, cadastro, banco, compartilhamento de dados e responsividade, não processamento de pagamento). O valor contribuído é gravado direto no banco como se a transação tivesse ocorrido.

## Campanhas públicas, sem convite/link

Um sistema de convite por campanha (geração e validação de código/link, controle de quem pode ver o quê) adicionaria uma tabela e uma camada de permissão inteira só para chegar no mesmo requisito ("compartilhar dados entre usuários") que campanhas públicas já resolvem com uma query simples.

## Turso (SQLite gerenciado) em vez de Postgres gerenciado

O requisito é "deve existir alguma base de dados no back-end" — SQLite via Turso atende isso com o mínimo de configuração (sem servidor de banco separado) e, ao contrário de um arquivo `.sqlite` local, persiste em hosts serverless free como o Vercel, onde o disco é efêmero.

## Next.js fullstack em vez de front-end e back-end separados

Um único projeto (rotas de página + rotas de API no mesmo App Router) elimina a necessidade de dois repositórios/configurações, CORS entre front e back, e duplicação de tipos. Menos arquivos, menos código, mesmo resultado funcional.

## Sem ORM

O schema tem 3 tabelas e poucas queries (listar campanhas, listar contribuintes, criar/atualizar). Um ORM (Prisma, Drizzle) adicionaria configuração, geração de cliente e uma camada de abstração desproporcional ao tamanho do projeto. Queries SQL diretas via `@libsql/client` são mais diretas de ler e manter aqui.

## iron-session em vez de um provedor de auth completo (Clerk, Auth.js, Supabase Auth)

Não há necessidade de OAuth social, MFA ou múltiplos provedores — só e-mail/senha. `iron-session` resolve sessão via cookie assinado em poucas linhas, sem dependência de serviço externo nem conta adicional.
