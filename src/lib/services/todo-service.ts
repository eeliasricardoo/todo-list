import { Todo, TodoCreateInput } from "@/types";

// URLs base
const API_BASE = '/api';
const TODOS_API = `${API_BASE}/todos`;

// Obter todas as tarefas
export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(TODOS_API);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar tarefas: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Convertendo as datas de string para Date
  return data.map((todo: any) => ({
    ...todo,
    createdAt: new Date(todo.createdAt),
  }));
}

// Obter uma tarefa específica
export async function fetchTodo(id: string): Promise<Todo> {
  const response = await fetch(`${TODOS_API}/${id}`);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar tarefa: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Convertendo a data de string para Date
  return {
    ...data,
    createdAt: new Date(data.createdAt),
  };
}

// Criar uma nova tarefa
export async function createTodo(todo: TodoCreateInput): Promise<Todo> {
  const response = await fetch(TODOS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  
  if (!response.ok) {
    throw new Error(`Erro ao criar tarefa: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Convertendo a data de string para Date
  return {
    ...data,
    createdAt: new Date(data.createdAt),
  };
}

// Atualizar uma tarefa
export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  const response = await fetch(`${TODOS_API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error(`Erro ao atualizar tarefa: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Convertendo a data de string para Date
  return {
    ...data,
    createdAt: new Date(data.createdAt),
  };
}

// Excluir uma tarefa
export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${TODOS_API}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Erro ao excluir tarefa: ${response.statusText}`);
  }
} 