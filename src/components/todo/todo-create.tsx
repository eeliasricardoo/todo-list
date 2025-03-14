"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function TodoCreate() {
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsCreating(true);
    
    try {
      // Fazer requisição para a API do app diretamente
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title,
          user_id: user?.id, // Usar o id do Clerk
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar tarefa');
      }
      
      // Limpar o campo após criar com sucesso
      setTitle("");
      
      // Exibir notificação
      toast({
        title: "Tarefa criada",
        description: "Sua tarefa foi criada com sucesso.",
      });
      
      // Refrescar os dados
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao criar tarefa:", error);
      toast({
        title: "Erro ao criar tarefa",
        description: error.message || "Ocorreu um erro ao criar sua tarefa.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-6">
      <Input
        type="text"
        placeholder="Adicionar nova tarefa..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isCreating}
        className="flex-1"
      />
      <Button type="submit" disabled={isCreating || !title.trim()}>
        {isCreating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PlusIcon className="h-4 w-4" />
        )}
        <span className="ml-2">Adicionar</span>
      </Button>
    </form>
  );
} 