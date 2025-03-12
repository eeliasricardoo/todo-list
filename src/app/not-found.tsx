"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="rounded-full bg-destructive/10 p-8 mb-8">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="min-w-[160px]">
            <Link href="/">
              Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="outline" className="min-w-[160px]">
            <Link href="/todos">
              Minhas tarefas
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 