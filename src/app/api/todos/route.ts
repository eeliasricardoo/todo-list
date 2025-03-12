import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseToAppTodo } from '@/types';
import { Database } from '@/types/supabase';

// Função para obter o cliente do Supabase para API Routes
function getSupabaseClient() {
  const cookieStore = cookies();
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore });
}

// GET - Listar todas as tarefas do usuário autenticado
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Buscar tarefas do usuário
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar tarefas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Converter para o formato da aplicação
    const todos = data.map(supabaseToAppTodo);
    
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST - Criar uma nova tarefa
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Obter dados do corpo da requisição
    const { title, completed = false } = await request.json();
    
    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Título da tarefa é obrigatório' }, { status: 400 });
    }
    
    // Inserir tarefa no banco de dados
    const { data, error } = await supabase
      .from('todos')
      .insert({
        title,
        completed,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar tarefa:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Converter para o formato da aplicação e retornar
    return NextResponse.json(supabaseToAppTodo(data), { status: 201 });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 