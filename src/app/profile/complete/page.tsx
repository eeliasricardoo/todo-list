"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import debounce from "lodash.debounce";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CompleteProfilePage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
  });
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({
    checking: false,
    available: null,
    message: "",
  });

  // Função para verificar disponibilidade do username
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: "Nome de usuário deve ter pelo menos 3 caracteres",
      });
      return;
    }

    setUsernameStatus({
      checking: true,
      available: null,
      message: "Verificando disponibilidade...",
    });

    try {
      const response = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      setUsernameStatus({
        checking: false,
        available: data.available,
        message: data.available 
          ? "Nome de usuário disponível!" 
          : "Nome de usuário já está em uso",
      });
    } catch (error) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: "Erro ao verificar disponibilidade",
      });
    }
  };

  // Debounce para não fazer muitas requisições seguidas
  const debouncedCheckUsername = debounce(checkUsernameAvailability, 500);

  useEffect(() => {
    if (formData.username.length >= 3) {
      debouncedCheckUsername(formData.username);
    } else {
      setUsernameStatus({
        checking: false,
        available: null,
        message: "",
      });
    }

    return () => {
      debouncedCheckUsername.cancel();
    };
  }, [formData.username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    if (!formData.username) {
      toast.error("Nome de usuário é obrigatório");
      return;
    }

    if (usernameStatus.checking || usernameStatus.available === false) {
      toast.error("Por favor, escolha um nome de usuário válido e disponível");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          username: formData.username,
          full_name: formData.fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao salvar o perfil");
      }

      toast.success("Perfil completado com sucesso!");
      router.push("/todos");
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      toast.error(error.message || "Erro ao salvar o perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete seu perfil</CardTitle>
          <CardDescription>
            Forneça algumas informações adicionais para personalizar sua experiência
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário *</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  placeholder="Escolha um nome de usuário único"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={`pr-10 ${
                    usernameStatus.available === true
                      ? "border-green-500"
                      : usernameStatus.available === false
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {usernameStatus.checking ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  </div>
                ) : usernameStatus.available === true ? (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                ) : usernameStatus.available === false ? (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                ) : null}
              </div>
              {usernameStatus.message && (
                <p className={`text-sm ${
                  usernameStatus.available === true
                    ? "text-green-600"
                    : usernameStatus.available === false
                    ? "text-red-600"
                    : "text-gray-500"
                }`}>
                  {usernameStatus.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Será usado para identificar você no sistema. Mínimo de 3 caracteres.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Seu nome completo"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Como você deseja ser chamado.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || usernameStatus.checking || usernameStatus.available === false}
            >
              {isLoading ? "Salvando..." : "Concluir cadastro"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 