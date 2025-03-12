# Configuração do Supabase

Este documento explica como configurar o Supabase para o aplicativo de lista de tarefas.

## Pré-requisitos

1. Uma conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase
3. Node.js e npm instalados

## Passos para Configuração

### 1. Configuração de Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

Você pode encontrar essas informações no painel do Supabase em Configurações do Projeto > API.

### 2. Configuração do Banco de Dados

Execute o script SQL de migração no Editor SQL do Supabase. O script está localizado em:

```
supabase/migrations/20230101000000_initial_schema.sql
```

Este script irá:
- Criar tabelas para tarefas (todos) e perfis de usuário
- Configurar gatilhos para criação automática de perfil
- Implementar políticas de segurança (RLS)

### 3. Configuração da Autenticação

No painel do Supabase, vá para Autenticação > Provedores e habilite:

1. Email (com ou sem confirmação)
2. Provedores OAuth desejados (Google, GitHub, etc.)

### 4. Configuração de Storage (opcional)

Se quiser permitir upload de avatares:

1. Vá para Storage no painel do Supabase
2. Crie um bucket chamado `avatars`
3. Configure as permissões de acesso:

```sql
-- Permitir apenas usuários autenticados fazer upload de avatares
CREATE POLICY "Avatar uploads require authentication"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND owner = auth.uid());

-- Avatares são visíveis para todos
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

## Verificação da Configuração

Para verificar se tudo está funcionando:

1. Tente criar uma conta de usuário
2. Faça login
3. Crie uma tarefa
4. Verifique se a tarefa aparece na sua lista

Se ocorrer algum erro, verifique:
- Variáveis de ambiente
- Logs do console
- Painel do Supabase para erros de permissão

## Estrutura do Banco de Dados

### Tabela `todos`
- `id`: UUID, chave primária
- `title`: texto, título da tarefa
- `completed`: booleano, status de conclusão
- `created_at`: timestamp, data de criação
- `user_id`: UUID, relacionado a auth.users

### Tabela `profiles`
- `id`: UUID, chave primária, relacionado a auth.users
- `updated_at`: timestamp, última atualização
- `username`: texto, nome de usuário único
- `full_name`: texto, nome completo
- `avatar_url`: texto, URL do avatar

## Segurança

O aplicativo utiliza Row-Level Security (RLS) do Supabase para garantir que:
- Usuários só podem ver, criar, atualizar e excluir suas próprias tarefas
- Perfis são visíveis para todos os usuários autenticados
- Usuários só podem atualizar seu próprio perfil 