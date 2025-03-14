export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
}

export type TodoCreateInput = Omit<Todo, 'id' | 'created_at'>;

export interface TodoWithString extends Omit<Todo, 'created_at'> {
  created_at: string;
}

export interface SupabaseTodo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
}

// Converter de Supabase para o formato da aplicação
export function supabaseToAppTodo(supabaseTodo: any): Todo {
  return {
    id: supabaseTodo.id,
    title: supabaseTodo.title,
    completed: supabaseTodo.completed,
    user_id: supabaseTodo.user_id,
    created_at: supabaseTodo.created_at,
  };
}

// Converter de aplicação para formato Supabase
export function appToSupabaseTodo(todo: TodoWithString, userId: string): Omit<SupabaseTodo, 'id'> {
  return {
    title: todo.title,
    completed: todo.completed,
    created_at: todo.created_at,
    user_id: userId,
  };
} 