"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface ProfileCheckProps {
  children: React.ReactNode;
}

export function ProfileCheck({ children }: ProfileCheckProps) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!isLoaded || !userId) {
      setIsCheckingProfile(false);
      return;
    }

    const checkProfile = async () => {
      try {
        // Verificar se o usuário já tem um perfil no Supabase
        const response = await fetch(`/api/profile/check?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        
        if (response.ok && data.hasProfile) {
          setHasProfile(true);
        } else {
          // Se não tiver perfil, redirecionar para a página de complementação
          router.push("/profile/complete");
        }
      } catch (error) {
        console.error("Erro ao verificar perfil:", error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [userId, isLoaded, router]);

  if (!isLoaded || isCheckingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Verificando perfil...</span>
      </div>
    );
  }

  if (!hasProfile && userId) {
    return null; // O redirecionamento já foi feito no useEffect
  }

  return <>{children}</>;
} 