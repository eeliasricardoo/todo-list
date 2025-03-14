"use client";

import React, { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function TodosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const isLoading = !isAuthLoaded || !isUserLoaded;

  useEffect(() => {
    // Se não estiver carregando e não houver usuário, redirecionar para login
    if (!isLoading && !userId) {
      console.log("LAYOUT: Usuário não autenticado, redirecionando para login");
      // Usar redirecionamento direto para garantir
      window.location.href = "/login";
    }
  }, [userId, isLoading, router]);

  // Se estiver carregando, mostrar mensagem de carregamento
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver carregando e houver usuário, mostrar conteúdo
  if (!isLoading && userId) {
    return <>{children}</>;
  }

  // Caso intermediário (provavalmente nunca chegará aqui devido ao redirecionamento)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md text-center">
        <p>Redirecionando para login...</p>
      </div>
    </div>
  );
} 