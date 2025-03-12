import { create } from 'zustand';
import { Todo, TodoCreateInput } from '@/types';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '@/lib/services/todo-service';

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;
  fetchAllTodos: () => Promise<void>;
  addTodo: (input: TodoCreateInput) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  editTodo: (id: string, title: string) => Promise<void>;
  reorderTodos: (activeId: string, overId: string) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,
  
  fetchAllTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await fetchTodos();
      set({ todos, isLoading: false });
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar tarefas'), 
        isLoading: false 
      });
    }
  },
  
  addTodo: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const newTodo = await createTodo(input);
      set((state) => ({
        todos: [newTodo, ...state.todos],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Erro desconhecido ao adicionar tarefa'), 
        isLoading: false 
      });
    }
  },
  
  toggleTodo: async (id) => {
    // Otimistic update
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    
    const updatedCompleted = !todo.completed;
    
    // Update local state immediately
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, completed: updatedCompleted } : t
      ),
    }));
    
    try {
      // Then update server
      await updateTodo(id, { completed: updatedCompleted });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      
      // Revert to original state if error
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, completed: todo.completed } : t
        ),
        error: error instanceof Error ? error : new Error('Erro ao atualizar tarefa'),
      }));
    }
  },
  
  removeTodo: async (id) => {
    // Save original todos for potential reversion
    const originalTodos = [...get().todos];
    
    // Optimistic update
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
    
    try {
      // Then update server
      await deleteTodo(id);
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      
      // Revert to original state if error
      set({
        todos: originalTodos,
        error: error instanceof Error ? error : new Error('Erro ao remover tarefa'),
      });
    }
  },
  
  editTodo: async (id, title) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    
    const originalTitle = todo.title;
    
    // Optimistic update
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, title } : t
      ),
    }));
    
    try {
      // Then update server
      await updateTodo(id, { title });
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      
      // Revert to original state if error
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, title: originalTitle } : t
        ),
        error: error instanceof Error ? error : new Error('Erro ao editar tarefa'),
      }));
    }
  },
  
  reorderTodos: (activeId, overId) => {
    set((state) => {
      const oldTodos = [...state.todos];
      const activeIndex = oldTodos.findIndex((todo) => todo.id === activeId);
      const overIndex = oldTodos.findIndex((todo) => todo.id === overId);
      
      if (activeIndex === -1 || overIndex === -1) {
        return { todos: oldTodos };
      }
      
      // Criar uma nova array com a ordem atualizada
      const newTodos = [...oldTodos];
      const [movedTodo] = newTodos.splice(activeIndex, 1);
      newTodos.splice(overIndex, 0, movedTodo);
      
      return { todos: newTodos };
    });
    
    // TODO: Implementar persistência da ordem no backend quando tivermos essa funcionalidade
  },
})); 