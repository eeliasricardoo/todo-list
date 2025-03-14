import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabaseToAppTodo } from '@/types';
import supabaseAdmin from '@/lib/services/supabase-admin';

// Usar o cliente Supabase administrativo
const supabase = supabaseAdmin;

// Tipos para a resposta da API
interface Params {
  params: {
    id: string;
  };
}

// GET: Buscar uma tarefa específica
export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Obter o ID do usuário autenticado via Clerk
    const { userId } = auth();
    
    // Verificar se o usuário está autenticado
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const id = params.id;
    
    // Buscar a tarefa no Supabase
    // Como estamos usando cliente administrativo, aplicamos o filtro de usuário manualmente
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // Tarefa não encontrada ou erro de permissão
      return NextResponse.json(
        { error: error.code === 'PGRST116' ? 'Tarefa não encontrada' : error.message }, 
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    return NextResponse.json(supabaseToAppTodo(data));
  } catch (error: any) {
    console.error('Erro na API de tarefa específica:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Atualizar uma tarefa específica
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // Obter o ID do usuário autenticado via Clerk
    const { userId } = auth();
    
    // Verificar se o usuário está autenticado
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const id = params.id;
    const data = await req.json();
    
    // Verificar se a tarefa pertence ao usuário
    const { data: todoCheck, error: checkError } = await supabase
      .from('todos')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada ou sem permissão para editar' }, 
        { status: 404 }
      );
    }
    
    // Atualizar a tarefa
    // Precisamos filtrar pelo user_id para garantir que o usuário só atualize suas próprias tarefas
    const { data: updatedTodo, error } = await supabase
      .from('todos')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(supabaseToAppTodo(updatedTodo));
  } catch (error: any) {
    console.error('Erro na API de atualização de tarefa:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remover uma tarefa específica
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Obter o ID do usuário autenticado via Clerk
    const { userId } = auth();
    
    // Verificar se o usuário está autenticado
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const id = params.id;
    
    // Verificar se a tarefa pertence ao usuário
    const { data: todoCheck, error: checkError } = await supabase
      .from('todos')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada ou sem permissão para excluir' }, 
        { status: 404 }
      );
    }
    
    // Excluir a tarefa
    // Filtrar pelo user_id para garantir que o usuário só exclua suas próprias tarefas
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao excluir tarefa:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro na API de exclusão de tarefa:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 