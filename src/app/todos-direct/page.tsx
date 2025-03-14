"use client";

import { useEffect, useState } from 'react';
import { TodoList } from '@/components/todo/todo-list';
import { TodoCreate } from '@/components/todo/todo-create';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function TodosDirectPage() {
  const { user, session, isLoading } = useAuth();
  const [loadingStatus, setLoadingStatus] = useState("Verificando autenticação...");

  useEffect(() => {
    console.log('TodosDirectPage - Estado de autenticação:', { 
      user: user?.id, 
      sessionExists: !!session,
      isLoading
    });
    
    // Verificar e atualizar mensagens de status
    if (isLoading) {
      setLoadingStatus("Carregando dados de autenticação...");
    } else if (!user) {
      setLoadingStatus("Usuário não autenticado. Você deve fazer login.");
    } else {
      setLoadingStatus("Autenticado com sucesso! Carregando suas tarefas...");
    }
  }, [user, session, isLoading]);

  // Enquanto estiver carregando, mostrar skeleton
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container max-w-2xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Lista de Tarefas</h1>
          <div className="text-center mb-4 text-sm text-muted-foreground">{loadingStatus}</div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </>
    );
  }

  // Se não estiver autenticado
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container max-w-2xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Lista de Tarefas</h1>
          <div className="text-center p-8 border rounded-lg">
            <p className="mb-4 text-muted-foreground">{loadingStatus}</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Ir para Login
            </button>
          </div>
        </div>
      </>
    );
  }

  // Usuário autenticado - mostrar lista de tarefas
  return (
    <>
      <Navbar />
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Lista de Tarefas</h1>
        <TodoCreate />
        <TodoList />
      </div>
    </>
  );
} 