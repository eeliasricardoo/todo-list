"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background flex justify-between items-center p-4 gap-4 h-16">
      <div className="text-xl font-bold">Lista de Tarefas</div>
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
} 