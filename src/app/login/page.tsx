"use client";

import React from "react";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Tarefas</h1>
          <p className="text-muted-foreground">Faça login para gerenciar suas tarefas</p>
        </div>
        
        {/* Componente SignIn do Clerk com aparência personalizada */}
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-md rounded-lg border border-border bg-background",
              header: "text-center",
              footer: "text-center text-sm text-muted-foreground",
            }
          }}
          redirectUrl="/todos"
          signUpUrl="/register"
        />
      </div>
    </div>
  );
} 