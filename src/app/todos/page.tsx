"use client";

import React from "react";
import { TodoCreate } from "@/components/todo/todo-create";
import { TodoList } from "@/components/todo/todo-list";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { useUser } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileCheck } from "@/components/auth/profile-check";

export default function TodosPage() {
  const { isLoaded, isSignedIn } = useUser();

  // Enquanto estiver carregando, mostrar skeleton
  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <div className="container max-w-2xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Lista de Tarefas</h1>
          <div className="text-center mb-4 text-sm text-muted-foreground">Carregando...</div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </>
    );
  }

  // Se não estiver autenticado - o middleware já deve ter redirecionado
  // mas mantemos esta verificação por segurança
  if (!isSignedIn) {
    return (
      <>
        <Navbar />
        <div className="container max-w-2xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Lista de Tarefas</h1>
          <div className="text-center p-8 border rounded-lg">
            <p className="mb-4 text-muted-foreground">Você precisa estar autenticado para ver suas tarefas.</p>
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

  // Usuário autenticado - verificar se tem perfil completo antes de mostrar tarefas
  return (
    <ProfileCheck>
      <Navbar />
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Lista de Tarefas</h1>
        <TodoCreate />
        <TodoList />
        <Toaster />
      </div>
    </ProfileCheck>
  );
} 