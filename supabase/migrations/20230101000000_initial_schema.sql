-- Create um schema para o nosso aplicativo
create schema if not exists public;

-- Tabela de Todos
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  completed boolean not null default false,
  created_at timestamp with time zone default now() not null,
  user_id uuid references auth.users(id) not null
);

-- Perfil do Usuário
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text
);

-- Função para criar um perfil de usuário após o cadastro
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para criar um perfil de usuário após o cadastro
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Security policies
-- Permitir apenas que usuários autenticados vejam seus próprios todos
create policy "Users can view their own todos"
  on todos for select
  using (auth.uid() = user_id);

-- Permitir apenas que usuários autenticados insiram seus próprios todos
create policy "Users can insert their own todos"
  on todos for insert
  with check (auth.uid() = user_id);

-- Permitir apenas que usuários autenticados atualizem seus próprios todos
create policy "Users can update their own todos"
  on todos for update
  using (auth.uid() = user_id);

-- Permitir apenas que usuários autenticados excluam seus próprios todos
create policy "Users can delete their own todos"
  on todos for delete
  using (auth.uid() = user_id);

-- Perfis são visíveis para todos os usuários
create policy "Profiles are viewable by everyone"
  on profiles for select
  to authenticated
  using (true);

-- Só o próprio usuário pode atualizar seu perfil
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Habilitar RLS nas tabelas
alter table todos enable row level security;
alter table profiles enable row level security; 