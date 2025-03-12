import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Verifica se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente para o Supabase não estão configuradas corretamente.');
}

// Cliente do Supabase para utilizar no navegador (lado do cliente)
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Função para criar um cliente do lado do servidor (com a service role key)
export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Chave de service role do Supabase não está configurada.');
  }
  
  return createClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    }
  );
}; 