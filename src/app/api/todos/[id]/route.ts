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

// GET - Obter uma tarefa específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = getSupabaseClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Buscar tarefa específica
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
      }
      console.error('Erro ao buscar tarefa:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Converter para o formato da aplicação
    return NextResponse.json(supabaseToAppTodo(data));
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PATCH - Atualizar uma tarefa
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = getSupabaseClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Obter dados do corpo da requisição
    const updates = await request.json();
    
    // Verificar permissão para atualizar esta tarefa
    const { data: todoCheck, error: checkError } = await supabase
      .from('todos')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
      }
      console.error('Erro ao verificar tarefa:', checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    if (todoCheck.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Não autorizado a modificar esta tarefa' }, { status: 403 });
    }
    
    // Atualizar tarefa no banco de dados
    const { data, error } = await supabase
      .from('todos')
      .update({
        ...updates,
        title: updates.title,
        completed: updates.completed,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Converter para o formato da aplicação e retornar
    return NextResponse.json(supabaseToAppTodo(data));
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE - Remover uma tarefa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = getSupabaseClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Verificar permissão para excluir esta tarefa
    const { data: todoCheck, error: checkError } = await supabase
      .from('todos')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
      }
      console.error('Erro ao verificar tarefa:', checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    if (todoCheck.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Não autorizado a excluir esta tarefa' }, { status: 403 });
    }
    
    // Excluir tarefa do banco de dados
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir tarefa:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Retornar sucesso
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 