import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com privilégios de administrador para operações
 * que não passam pelo RLS (Row Level Security)
 */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
);

/**
 * Sincroniza um usuário do Clerk com o Supabase
 * Esta função cria ou atualiza um usuário no Supabase quando um usuário se autentica via Clerk
 */
export async function syncUserWithSupabase(params: {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
}) {
  const { id, email, first_name, last_name, image_url } = params;
  
  try {
    // Verificar se o usuário já existe na tabela de perfis
    const { data: existingProfile, error: queryError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    
    if (queryError) {
      console.error('Erro ao verificar perfil existente:', queryError);
      return { error: queryError };
    }
    
    if (!existingProfile) {
      // Criar um perfil com o mesmo UUID do Clerk
      console.log('Criando perfil de usuário no Supabase:', id, email);
      
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id,
          username: email.split('@')[0],
          full_name: [first_name, last_name].filter(Boolean).join(' '),
          avatar_url: image_url,
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Erro ao criar perfil de usuário:', insertError);
        return { error: insertError };
      }
    } else {
      // Atualizar o perfil do usuário existente
      console.log('Atualizando perfil do usuário no Supabase:', id);
      
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          username: email.split('@')[0],
          full_name: [first_name, last_name].filter(Boolean).join(' '),
          avatar_url: image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) {
        console.error('Erro ao atualizar perfil de usuário:', updateError);
        return { error: updateError };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao sincronizar usuário com Supabase:', error);
    return { error };
  }
}

export default supabaseAdmin; 