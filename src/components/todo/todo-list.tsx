"use client";

import { useState, useEffect } from "react";
import { TodoItem } from "./todo-item";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  // Buscar todas as tarefas do usuário
  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/todos');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar tarefas');
        }
        
        const data = await response.json();
        setTodos(data);
      } catch (error: any) {
        console.error('Erro ao buscar tarefas:', error);
        toast({
          title: 'Erro ao carregar tarefas',
          description: error.message || 'Não foi possível carregar suas tarefas.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [user, toast]);

  // Função para atualizar uma tarefa
  const updateTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar tarefa');
      }
      
      // Atualizar o estado localmente
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error);
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error.message || 'Não foi possível atualizar a tarefa.',
        variant: 'destructive',
      });
    }
  };

  // Função para excluir uma tarefa
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir tarefa');
      }
      
      // Atualizar o estado localmente
      setTodos(todos.filter(todo => todo.id !== id));
      
      toast({
        title: 'Tarefa excluída',
        description: 'A tarefa foi removida com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao excluir tarefa:', error);
      toast({
        title: 'Erro ao excluir tarefa',
        description: error.message || 'Não foi possível excluir a tarefa.',
        variant: 'destructive',
      });
    }
  };

  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  // Sem tarefas
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Você ainda não tem tarefas. Crie uma tarefa acima para começar.
      </div>
    );
  }

  // Ordenar tarefas: tarefas não concluídas primeiro, depois por data de criação
  const sortedTodos = [...todos].sort((a, b) => {
    // Primeiro por status (não concluídas primeiro)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Depois por data (mais recentes primeiro)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Renderizar lista de tarefas
  return (
    <div className="space-y-4">
      {sortedTodos.map((todo) => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onToggle={(completed) => updateTodo(todo.id, completed)}
          onDelete={() => deleteTodo(todo.id)}
        />
      ))}
    </div>
  );
} 