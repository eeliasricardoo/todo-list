# To-do List App

Uma aplicação simples de lista de tarefas construída com Next.js, TypeScript, Shadcn UI, Zustand e Supabase.

## Funcionalidades

- Adicionar tarefas
- Marcar tarefas como concluídas
- Editar tarefas existentes
- Remover tarefas
- Arrastar e soltar para reordenar tarefas (usando dnd-kit)
- Interface de usuário moderna e responsiva
- Feedbacks visuais por meio de toasts
- Autenticação de usuários
- Persistência de dados no Supabase

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Para tipagem estática
- **Tailwind CSS** - Para estilização
- **Shadcn UI** - Componentes de UI reutilizáveis
- **Zustand** - Para gerenciamento de estado
- **Lucide React** - Para ícones
- **Supabase** - Para autenticação e banco de dados
- **dnd-kit** - Para funcionalidade de arrastar e soltar

## Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/todo-list.git
   cd todo-list
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o Supabase:
   - Crie uma conta no [Supabase](https://supabase.com)
   - Crie um novo projeto
   - Copie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais
   - Siga as instruções em `docs/supabase-setup.md`

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Projeto

```
todo-list/
├── src/
│   ├── app/
│   │   ├── api/           
│   │   │   └── todos/     # API routes para tarefas
│   │   ├── auth/          # Páginas de autenticação
│   │   ├── todos/         # Página principal da lista de tarefas
│   │   ├── layout.tsx     # Layout da aplicação
│   │   └── page.tsx       # Redireciona para /todos
│   ├── components/
│   │   ├── auth/          # Componentes de autenticação
│   │   ├── todo/          # Componentes relacionados a tarefas
│   │   ├── ui/            # Componentes do Shadcn UI
│   │   └── navbar.tsx     # Barra de navegação com logout
│   ├── lib/
│   │   ├── store/         # Stores Zustand
│   │   ├── supabase/      # Cliente Supabase e funções relacionadas
│   │   └── services/      # Serviços para comunicação com a API
│   └── types/
│       └── index.ts       # Definições de tipos para a aplicação
├── supabase/
│   └── migrations/        # Scripts SQL para configuração do banco de dados
├── docs/
│   └── supabase-setup.md  # Documentação de configuração do Supabase
└── ...
```

## Autenticação

O aplicativo utiliza a autenticação do Supabase, permitindo:
- Login com email/senha
- Registro de novos usuários
- Integração com provedores OAuth (configurável)

## Banco de Dados

Os dados são armazenados no PostgreSQL do Supabase, com:
- Tabela `todos` para armazenar as tarefas de cada usuário
- Tabela `profiles` para informações de perfil
- Row-Level Security (RLS) para garantir acesso seguro aos dados

## Próximos Passos

- Filtros para visualizar tarefas (todas, concluídas, pendentes)
- Categorização de tarefas
- Datas de vencimento e lembretes
- Compartilhamento de listas de tarefas
- Tema escuro/claro

## Licença

MIT
