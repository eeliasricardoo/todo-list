"use client";

import React, { useState } from "react";
import { useTodoStore } from "@/lib/store/todo-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function TodoCreate() {
  const { addTodo } = useTodoStore();
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "A tarefa não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }
    
    addTodo({
      title: title.trim(),
      completed: false,
    });
    
    setTitle("");
    
    toast({
      title: "Sucesso",
      description: "Tarefa adicionada com sucesso!",
    });
  };

  return (
    <Card className="p-4 mb-8">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <Input
          placeholder="Adicionar nova tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </form>
    </Card>
  );
} 