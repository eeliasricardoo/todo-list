"use client";

import React, { useState, useEffect } from "react";
import { useTodoStore } from "@/lib/store/todo-store";
import { SortableTodoItem } from "./sortable-todo-item";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { TodoItem } from "./todo-item";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TodoList() {
  const { todos, isLoading, error, fetchAllTodos, reorderTodos } = useTodoStore();
  const [activeTodo, setActiveTodo] = useState<string | null>(null);
  const { toast } = useToast();

  // Buscar tarefas ao montar o componente
  useEffect(() => {
    fetchAllTodos();
  }, [fetchAllTodos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mínimo de 8px para iniciar o drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTodo(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);
    
    if (over && active.id !== over.id) {
      reorderTodos(active.id.toString(), over.id.toString());
      
      toast({
        title: "Tarefa reordenada",
        description: "A ordem das tarefas foi atualizada com sucesso.",
        duration: 2000,
      });
    }
  };

  const getActiveTodoItem = () => {
    if (!activeTodo) return null;
    const todo = todos.find(t => t.id === activeTodo);
    if (!todo) return null;
    return todo;
  };

  if (isLoading && todos.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <div className="animate-spin mx-auto mb-4 h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        Carregando suas tarefas...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Erro ao carregar tarefas</AlertTitle>
        <AlertDescription className="mb-2">
          {error.message || "Não foi possível carregar suas tarefas. Tente novamente."}
        </AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchAllTodos()}
          className="mt-2"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </Alert>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Nenhuma tarefa encontrada. Adicione uma nova tarefa acima.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative">
        <p className="text-sm text-muted-foreground mb-4 italic">
          Dica: Arraste os itens usando a alça à esquerda para reordenar.
        </p>
        <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
          <div>
            {todos.map((todo) => (
              <SortableTodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </SortableContext>
        
        <DragOverlay adjustScale={true}>
          {activeTodo && getActiveTodoItem() && (
            <div className="w-full max-w-2xl opacity-80">
              <TodoItem todo={getActiveTodoItem()!} />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
} 