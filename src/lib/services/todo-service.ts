import { Todo, TodoCreateInput } from "@/types";

// URLs base
const API_BASE = '/api';
const TODOS_API = `${API_BASE}/todos`;

/**
 * Configuração comum para todas as requisições
 */
const defaultFetchOptions = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Obter todas as tarefas
export async function fetchTodos(): Promise<Todo[]> {
  try {
    console.log('Buscando todas as tarefas...');
    
    const response = await fetch(TODOS_API, {
      ...defaultFetchOptions,
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error('Erro na resposta da API:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Você precisa estar autenticado para acessar as tarefas');
      }
      
      throw new Error(`Erro ao buscar tarefas: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Tarefas recuperadas com sucesso:', data.length);
    
    // Convertendo as datas de string para Date
    return data.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  } catch (error) {
    console.error('Exceção ao buscar tarefas:', error);
    throw error;
  }
}

// Obter uma tarefa específica
export async function fetchTodo(id: string): Promise<Todo> {
  try {
    console.log(`Buscando tarefa com ID: ${id}`);
    
    const response = await fetch(`${TODOS_API}/${id}`, {
      ...defaultFetchOptions,
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error('Erro na resposta da API:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Você precisa estar autenticado para acessar esta tarefa');
      }
      
      if (response.status === 404) {
        throw new Error('Tarefa não encontrada');
      }
      
      throw new Error(`Erro ao buscar tarefa: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Tarefa recuperada com sucesso:', data.id);
    
    // Convertendo a data de string para Date
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error(`Exceção ao buscar tarefa ${id}:`, error);
    throw error;
  }
}

// Criar uma nova tarefa
export async function createTodo(todo: TodoCreateInput): Promise<Todo> {
  try {
    console.log('Criando nova tarefa:', todo.title);
    
    const response = await fetch(TODOS_API, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify(todo),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error('Erro na resposta da API:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Você precisa estar autenticado para criar tarefas');
      }
      
      throw new Error(`Erro ao criar tarefa: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Tarefa criada com sucesso:', data.id);
    
    // Convertendo a data de string para Date
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error('Exceção ao criar tarefa:', error);
    throw error;
  }
}

// Atualizar uma tarefa
export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  try {
    console.log(`Atualizando tarefa ${id}:`, updates);
    
    const response = await fetch(`${TODOS_API}/${id}`, {
      ...defaultFetchOptions,
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error('Erro na resposta da API:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Você precisa estar autenticado para atualizar tarefas');
      }
      
      if (response.status === 404) {
        throw new Error('Tarefa não encontrada');
      }
      
      throw new Error(`Erro ao atualizar tarefa: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Tarefa atualizada com sucesso:', data.id);
    
    // Convertendo a data de string para Date
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error(`Exceção ao atualizar tarefa ${id}:`, error);
    throw error;
  }
}

// Excluir uma tarefa
export async function deleteTodo(id: string): Promise<void> {
  try {
    console.log(`Excluindo tarefa com ID: ${id}`);
    
    const response = await fetch(`${TODOS_API}/${id}`, {
      ...defaultFetchOptions,
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error('Erro na resposta da API:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Você precisa estar autenticado para excluir tarefas');
      }
      
      if (response.status === 404) {
        throw new Error('Tarefa não encontrada');
      }
      
      throw new Error(`Erro ao excluir tarefa: ${response.statusText}`);
    }
    
    console.log('Tarefa excluída com sucesso:', id);
  } catch (error) {
    console.error(`Exceção ao excluir tarefa ${id}:`, error);
    throw error;
  }
} 