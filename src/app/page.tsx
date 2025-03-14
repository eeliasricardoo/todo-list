"use client";

import { useAuth } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  const { userId } = useAuth()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Lista de Tarefas</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Organize suas tarefas de forma simples e eficiente
        </p>

        <SignedIn>
          <div className="space-y-6">
            <p className="text-muted-foreground">Você está conectado!</p>
            <Link
              href="/todos"
              className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium"
            >
              Ver minhas tarefas
            </Link>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="space-y-6">
            <p className="text-muted-foreground">Entre ou crie uma conta para começar</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 rounded-md bg-secondary text-secondary-foreground font-medium"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  )
}
