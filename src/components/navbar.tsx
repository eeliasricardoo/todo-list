"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/auth/user-button';
import { useUser } from '@clerk/nextjs';
import { Menu } from 'lucide-react';

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="ml-2 text-xl font-bold">Lista de Tarefas</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {isLoaded ? (
            isSignedIn ? (
              <UserButton />
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            )
          ) : (
            // Estado de carregamento
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          )}
        </div>
      </div>
    </header>
  );
} 