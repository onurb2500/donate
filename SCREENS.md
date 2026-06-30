# Telas — Vaquinha

Resumo de todas as telas da aplicação, para referência de design. Estado atual: funcional, estilizado com Tailwind "padrão" (sem identidade visual definida) — espaço aberto para redesenho.

Paleta/tipografia atuais: neutra (cinza/branco/azul/verde), fonte Geist. Layout mobile-first, container centralizado (`max-w-sm` a `max-w-3xl` conforme a tela).

---

## 1. Login — `/login`

**Objetivo:** autenticar usuário existente.

**Elementos:**
- Título "Entrar"
- Campo e-mail (input type email)
- Campo senha (input type password)
- Mensagem de erro (texto vermelho, condicional — ex: "Credenciais inválidas.")
- Botão "Entrar" (primário, azul, largura total)
- Link "Cadastre-se" para `/register`

**Estados:** vazio (inicial) → preenchendo → erro (credenciais inválidas) → sucesso (redireciona para `/`).

**Layout:** card único centralizado verticalmente e horizontalmente, sem navbar (usuário ainda não autenticado).

---

## 2. Cadastro — `/register`

**Objetivo:** criar nova conta.

**Elementos:**
- Título "Criar conta"
- Campo nome
- Campo e-mail
- Campo senha (mínimo 6 caracteres)
- Mensagem de erro condicional (ex: "E-mail já cadastrado.")
- Botão "Cadastrar" (primário, azul, largura total)
- Link "Entrar" para `/login`

**Estados:** igual ao login — vazio → preenchendo → erro → sucesso (redireciona para `/`, já autenticado).

**Layout:** mesmo padrão de card centralizado do login, sem navbar.

---

## 3. Dashboard / Lista de campanhas — `/` (rota raiz, autenticada)

**Objetivo:** mostrar todas as campanhas públicas da plataforma (é a tela inicial após login).

**Elementos:**
- Navbar fixa no topo (ver seção "Navegação")
- Título "Campanhas"
- Lista vertical de cards de campanha, cada um com:
  - Título da campanha (link para o detalhe)
  - Nome de quem criou ("por {nome}")
  - Barra de progresso (arrecadado / meta)
  - Texto "{valor arrecadado} de {meta} ({porcentagem}%)"
- Estado vazio: "Nenhuma campanha ainda." quando não há campanhas

**Dados exibidos por card:** título, autor, valor arrecadado (R$), meta (R$), % atingido.

**Layout:** lista de cards empilhados (1 coluna), container centralizado `max-w-3xl`. Pode evoluir para grid de 2-3 colunas em telas largas.

---

## 4. Nova campanha — `/campaigns/new` (autenticada)

**Objetivo:** criar uma campanha de arrecadação.

**Elementos:**
- Título "Nova campanha"
- Campo título (texto)
- Campo descrição (textarea, 4 linhas)
- Campo meta em R$ (number, decimal)
- Campo prazo (date, opcional)
- Mensagem de erro condicional
- Botão "Criar campanha" (primário, azul, largura total)

**Estados:** formulário vazio → preenchendo → erro de validação → sucesso (redireciona para o detalhe da campanha criada).

**Layout:** formulário único em coluna, container `max-w-md`, com navbar no topo.

---

## 5. Detalhe da campanha — `/campaigns/[id]` (autenticada)

**Objetivo:** mostrar progresso da campanha, permitir contribuir e listar quem já contribuiu (tela onde o "compartilhamento de dados entre usuários" fica mais visível).

**Elementos, de cima para baixo:**
- Título da campanha
- Autor ("por {nome}")
- Descrição completa (texto livre, pode ser longo)
- Barra de progresso (arrecadado / meta)
- Texto "{valor arrecadado} arrecadados de {meta} ({porcentagem}%)"
- Formulário de contribuição inline: campo valor (R$) + botão "Contribuir" (verde)
- Seção "Contribuintes": lista de quem contribuiu, cada item mostrando nome + valor contribuído
- Estado vazio da lista: "Ninguém contribuiu ainda."

**Estados:** carregando dados da campanha → exibindo → contribuindo (form) → erro de contribuição → sucesso (lista atualiza, sem reload de página).

**Layout:** coluna única, container `max-w-2xl`, navbar no topo.

---

## 6. Meu cadastro / Perfil — `/profile` (autenticada)

**Objetivo:** visualizar e atualizar dados do próprio usuário.

**Elementos:**
- Título "Meu cadastro"
- Campo e-mail (somente leitura, desabilitado)
- Campo nome (editável)
- Mensagem de sucesso condicional ("Dados atualizados.")
- Mensagem de erro condicional
- Botão "Salvar" (primário, azul, largura total)

**Estados:** carregando dados → preenchido → editando → salvo (mensagem de sucesso) → erro.

**Layout:** card único centralizado `max-w-sm`, navbar no topo.

---

## Navegação — componente fixo (presente em todas as telas autenticadas)

**Elementos (barra horizontal no topo, abaixo do header do navegador):**
- Logo/nome do app "Vaquinha" (link para `/`)
- Link "Nova campanha" → `/campaigns/new`
- Link "Meu cadastro" → `/profile`
- Nome do usuário logado (texto, não clicável)
- Botão "Sair" (logout, vermelho)

**Comportamento responsivo:** os itens quebram linha (`flex-wrap`) em telas estreitas; não há menu hambúrguer no estado atual — espaço para melhoria em mobile se o design pedir.

**Não aparece em:** `/login`, `/register` (usuário ainda não autenticado).

---

## Fluxo de navegação entre telas

```
/login ──(cadastro)──> /register
/login ──(login ok)──> /  (dashboard)
/register ──(cadastro ok)──> /  (dashboard)

/  (dashboard) ──(clicar em campanha)──> /campaigns/[id]
/  (dashboard) ──(navbar "Nova campanha")──> /campaigns/new
/  (dashboard) ──(navbar "Meu cadastro")──> /profile

/campaigns/new ──(criar com sucesso)──> /campaigns/[id]  (da campanha criada)

qualquer tela autenticada ──(navbar "Sair")──> /login
```

## Pontos em aberto para o design

- Não há tela de "minhas campanhas" separada (todas aparecem juntas no dashboard) — avaliar se faz sentido separar "campanhas que eu criei" de "todas as campanhas".
- Não há avatar/foto de usuário.
- Não há paginação na lista de campanhas nem na lista de contribuintes (assume-se poucos itens, adequado ao escopo do protótipo).
- Não há confirmação visual (modal/toast) ao contribuir — hoje é só a lista e a barra de progresso atualizando.
- Cores e tipografia são as padrão do Tailwind/Geist; sem identidade visual própria do produto ainda.
