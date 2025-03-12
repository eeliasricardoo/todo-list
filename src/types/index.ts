export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  userId?: string;
}

export type TodoCreateInput = Omit<Todo, 'id' | 'createdAt'>;

export interface TodoWithString extends Omit<Todo, 'createdAt'> {
  createdAt: string;
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
export function supabaseToAppTodo(supabaseTodo: SupabaseTodo): Todo {
  return {
    id: supabaseTodo.id,
    title: supabaseTodo.title,
    completed: supabaseTodo.completed,
    createdAt: new Date(supabaseTodo.created_at),
    userId: supabaseTodo.user_id,
  };
}

// Converter de aplicação para formato Supabase
export function appToSupabaseTodo(todo: TodoWithString, userId: string): Omit<SupabaseTodo, 'id'> {
  return {
    title: todo.title,
    completed: todo.completed,
    created_at: todo.createdAt,
    user_id: userId,
  };
} 