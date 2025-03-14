import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Obter as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqbpiftooxpecncuxupx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYnBpZnRvb3hwZWNuY3V4dXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0NDEzMzEsImV4cCI6MjAyNjAxNzMzMX0.EMbLhyEBxJYy9XoYmOJZJ7Gx8sKsUY6TQEj_sINQm5Q';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] ERRO: Variáveis de ambiente Supabase não configuradas!');
}

// Verificar se estamos em ambiente de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development';

// Chave para armazenamento do token de autenticação
const STORAGE_KEY = 'sb:token';
const FALLBACK_KEY = 'sb_fallback_token';

console.log(`[Supabase] Inicializando cliente com URL: ${supabaseUrl}`);
console.log(`[Supabase] Ambiente: ${isDevelopment ? 'desenvolvimento' : 'produção'}`);

// Implementar armazenamento personalizado para fallback
const customStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') {
        return null;
      }
      
      // Tentar obter do localStorage primeiro
      let value = null;
      try {
        value = window.localStorage.getItem(key);
        console.log(`[Supabase] getItem localStorage: ${key} - ${value ? 'Encontrado' : 'Não encontrado'}`);
      } catch (error: any) {
        console.log(`[Supabase] Erro ao acessar localStorage: ${error.message}`);
      }
      
      // Se não encontrar no localStorage, tentar cookies
      if (!value) {
        try {
          const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
          value = match ? decodeURIComponent(match[2]) : null;
          console.log(`[Supabase] getItem cookie: ${key} - ${value ? 'Encontrado' : 'Não encontrado'}`);
          
          // Cópia de segurança - verificar também em uma chave alternativa
          if (!value) {
            const backupMatch = document.cookie.match(new RegExp('(^| )' + FALLBACK_KEY + '=([^;]+)'));
            value = backupMatch ? decodeURIComponent(backupMatch[2]) : null;
            console.log(`[Supabase] getItem cookie fallback: ${FALLBACK_KEY} - ${value ? 'Encontrado' : 'Não encontrado'}`);
          }
        } catch (error: any) {
          console.log(`[Supabase] Erro ao acessar cookies: ${error.message}`);
        }
      }
      
      return value;
    } catch (error: any) {
      console.error('[Supabase] Erro geral em getItem:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      
      console.log(`[Supabase] setItem: Salvando token (${key})`);
      
      // Tentar salvar no localStorage
      try {
        window.localStorage.setItem(key, value);
        console.log(`[Supabase] setItem: Token salvo em localStorage`);
      } catch (error: any) {
        console.log(`[Supabase] Erro ao salvar em localStorage: ${error.message}`);
      }
      
      // Salvar também em cookies como backup
      try {
        // Salvar em duas chaves diferentes como redundância
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
        document.cookie = `${FALLBACK_KEY}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
        console.log(`[Supabase] setItem: Token salvo em cookies (redundância)`);
      } catch (error: any) {
        console.log(`[Supabase] Erro ao salvar em cookies: ${error.message}`);
      }
    } catch (error: any) {
      console.error('[Supabase] Erro geral em setItem:', error);
    }
  },
  
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      
      console.log(`[Supabase] removeItem: Removendo token (${key})`);
      
      // Remover do localStorage
      try {
        window.localStorage.removeItem(key);
        console.log(`[Supabase] removeItem: Token removido do localStorage`);
      } catch (error: any) {
        console.log(`[Supabase] Erro ao remover do localStorage: ${error.message}`);
      }
      
      // Remover também dos cookies
      try {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
        document.cookie = `${FALLBACK_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
        console.log(`[Supabase] removeItem: Token removido dos cookies`);
      } catch (error: any) {
        console.log(`[Supabase] Erro ao remover dos cookies: ${error.message}`);
      }
    } catch (error: any) {
      console.error('[Supabase] Erro geral em removeItem:', error);
    }
  }
};

// Cliente do Supabase para utilizar no navegador (lado do cliente)
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: STORAGE_KEY,
      storage: customStorage,
      debug: isDevelopment, // Ativar logs de debug no desenvolvimento
    },
    global: {
      headers: {
        'x-application-name': 'todo-list',
      },
    }
  }
);

// Verificar sessão ao inicializar (para debug apenas)
if (typeof window !== 'undefined') {
  console.log('[Supabase] Verificando sessão inicial...');
  
  try {
    // Verificar valores atuais para diagnóstico
    console.log('[Supabase] Cookies disponíveis:', document.cookie);
    
    const storedValue = customStorage.getItem(STORAGE_KEY);
    console.log(`[Supabase] Valor armazenado: ${storedValue ? 'Presente' : 'Ausente'}`);
    
    // Verificar sessão com o Supabase
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('[Supabase] Erro ao verificar sessão inicial:', error);
      } else {
        console.log('[Supabase] Sessão inicial:', data.session ? 'Encontrada' : 'Não encontrada');
        if (data.session) {
          console.log('[Supabase] Sessão ID:', data.session.user.id);
          
          // Resolver possível problema: forçar o armazenamento da sessão novamente
          if (!storedValue) {
            console.log('[Supabase] Armazenando sessão existente no storage...');
            customStorage.setItem(STORAGE_KEY, JSON.stringify({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_at: data.session.expires_at,
              user: data.session.user
            }));
          }
        }
      }
    });
  } catch (error: any) {
    console.error('[Supabase] Erro ao inicializar verificação de sessão:', error);
  }
}

// Função para acessar o Supabase Auth diretamente
export const restoreSession = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.log('[Supabase] restoreSession: Nenhuma sessão encontrada para restaurar');
      return null;
    }
    
    console.log('[Supabase] restoreSession: Sessão encontrada, verificando armazenamento');
    
    // Verificar se a sessão está armazenada corretamente
    const storedValue = customStorage.getItem(STORAGE_KEY);
    
    if (!storedValue) {
      console.log('[Supabase] restoreSession: Armazenando sessão novamente');
      
      // Forçar o armazenamento da sessão
      customStorage.setItem(STORAGE_KEY, JSON.stringify({
        access_token: data.session.access_token, 
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        user: data.session.user
      }));
    }
    
    return data.session;
  } catch (error: any) {
    console.error('[Supabase] Erro ao restaurar sessão:', error);
    return null;
  }
};

// Exportar funções úteis 
export const getSupabasePublicSettings = () => {
  return {
    url: supabaseUrl,
    isDevelopment,
  };
};

// Função para criar um cliente do lado do servidor (com a service role key)
export const createServerSupabaseClient = () => {
  // Para testes, podemos desabilitar temporariamente a validação
  const serviceRoleKey = 'sua_chave_service_role_aqui'; // Use a service role real em produção
  
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