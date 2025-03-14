import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';
import { supabaseToAppTodo } from '@/types';
import { Database } from '@/types/supabase';
import supabaseAdmin from '@/lib/services/supabase-admin';

// Criar cliente Supabase para o servidor com permissões administrativas
// para contornar o RLS, já que o auth.uid() do Supabase não funcionará com Clerk
const supabase = supabaseAdmin;

// GET: Buscar todas as tarefas do usuário atual
export async function GET(req: NextRequest) {
  try {
    // Obter o ID do usuário autenticado via Clerk
    const { userId } = auth();
    
    // Verificar se o usuário está autenticado
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Buscar tarefas do usuário no Supabase
    // Como estamos usando o cliente administrativo, o RLS não será aplicado
    // então precisamos filtrar manualmente pelo user_id
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar tarefas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Converter para o formato da aplicação
    const todos = data.map(supabaseToAppTodo);
    
    return NextResponse.json(todos);
  } catch (error: any) {
    console.error('Erro na API de tarefas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Criar nova tarefa para o usuário atual
export async function POST(req: NextRequest) {
  try {
    // Obter o ID do usuário autenticado via Clerk
    const { userId } = auth();
    
    // Verificar se o usuário está autenticado
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Obter dados da requisição
    const data = await req.json();
    
    // Validar dados
    if (!data.title || data.title.trim() === "") {
      return NextResponse.json({ error: "Título da tarefa é obrigatório" }, { status: 400 });
    }
    
    // Criar nova tarefa no Supabase
    // Sempre usar o userId do Clerk, nunca confiar no user_id enviado pelo cliente
    const { data: newTodo, error } = await supabase
      .from('todos')
      .insert([{
        title: data.title.trim(),
        user_id: userId,
        completed: false
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar tarefa:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Converter para o formato da aplicação e retornar
    return NextResponse.json(supabaseToAppTodo(newTodo), { status: 201 });
  } catch (error: any) {
    console.error('Erro na API de criação de tarefa:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 