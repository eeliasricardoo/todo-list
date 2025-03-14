"use client";

import { useUser, UserButton as ClerkUserButton, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

export function UserButton() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-70"><User className="h-4 w-4" /></Button>;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <ClerkUserButton 
            appearance={{
              elements: {
                userButtonBox: "h-8 w-8 rounded-full",
                userButtonTrigger: "h-full w-full",
                userButtonAvatarBox: "h-full w-full",
                userButtonAvatarImage: "h-full w-full object-cover rounded-full",
              }
            }}
            afterSignOutUrl="/login"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="ml-1">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton>
            <div className="flex items-center gap-2 text-sm text-destructive cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 