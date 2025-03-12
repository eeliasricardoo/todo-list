import React from "react";
import { ClientOnly } from "@/components/client-only-component";
import { TodoCreate } from "@/components/todo/todo-create";
import { TodoList } from "@/components/todo/todo-list";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";

export default function TodosPage() {
  return (
    <>
      <Navbar />
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Lista de Tarefas</h1>
        
        <ClientOnly>
          <TodoCreate />
          <TodoList />
          <Toaster />
        </ClientOnly>
      </div>
    </>
  );
} 