-- Create um schema para o nosso aplicativo
create schema if not exists public;

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Todos
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  completed boolean not null default false,
  created_at timestamp with time zone default now() not null,
  user_id uuid not null -- Vamos armazenar o ID do usuário do Clerk aqui
);

-- Perfil do Usuário (corresponde aos usuários do Clerk)
create table if not exists public.profiles (
  id uuid primary key, -- ID do usuário do Clerk
  updated_at timestamp with time zone default now(),
  username text unique,
  full_name text,
  avatar_url text
);

-- Como não estamos usando auth.users do Supabase, não precisamos de trigger para perfis.
-- Os perfis serão criados pelo webhook do Clerk.

-- Permissões (para uso via cliente administrativo)
-- Estas são necessárias para quando utilizamos o supabase-js com a service role key

-- Conceder permissões para a tabela de tarefas
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Conceder permissões para a tabela de perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Configurar políticas de segurança para o admin
CREATE POLICY "Admin pode ler todos os dados"
  ON public.todos
  FOR SELECT
  USING (true);

CREATE POLICY "Admin pode inserir todos os dados"
  ON public.todos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin pode atualizar todos os dados"
  ON public.todos
  FOR UPDATE
  USING (true);

CREATE POLICY "Admin pode excluir todos os dados"
  ON public.todos
  FOR DELETE
  USING (true);

-- Políticas para perfis
CREATE POLICY "Admin pode ler todos os perfis"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Admin pode inserir todos os perfis"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin pode atualizar todos os perfis"
  ON public.profiles
  FOR UPDATE
  USING (true);

-- Tabela de auditoria (opcional)
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action text not null,
  resource text not null,
  resource_id uuid,
  details jsonb,
  created_at timestamp with time zone default now() not null
);

-- Índices para melhorar a performance 
CREATE INDEX idx_todos_user_id ON public.todos(user_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);

-- Informações para o desenvolvedor
COMMENT ON TABLE public.todos IS 'Tarefas dos usuários';
COMMENT ON TABLE public.profiles IS 'Perfis de usuário que correspondem aos usuários do Clerk';
COMMENT ON TABLE public.activity_log IS 'Registro de atividades dos usuários';
COMMENT ON COLUMN public.todos.user_id IS 'ID do usuário no Clerk';
COMMENT ON COLUMN public.profiles.id IS 'ID do usuário no Clerk'; 