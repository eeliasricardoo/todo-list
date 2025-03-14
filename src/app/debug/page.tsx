"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const { user, session } = useAuth();
  const [localSession, setLocalSession] = useState(null);
  const [cookies, setCookies] = useState([]);

  useEffect(() => {
    // Verificar sessão diretamente do Supabase
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setLocalSession(data.session);
    };
    
    // Listar cookies disponíveis
    const cookieList = document.cookie.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return { name, value: value.substring(0, 20) + '...' };
    });
    
    setCookies(cookieList);
    checkSession();
  }, []);

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Página de Debug</h1>
      
      <div className="grid gap-6">
        <div className="border p-4 rounded-md">
          <h2 className="font-semibold mb-2">Estado do useAuth</h2>
          <p><strong>Usuário logado:</strong> {user ? 'Sim' : 'Não'}</p>
          <p><strong>ID do usuário:</strong> {user?.id || 'N/A'}</p>
          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p><strong>Sessão válida:</strong> {session ? 'Sim' : 'Não'}</p>
        </div>
        
        <div className="border p-4 rounded-md">
          <h2 className="font-semibold mb-2">Sessão direta do Supabase</h2>
          <p><strong>Sessão válida:</strong> {localSession ? 'Sim' : 'Não'}</p>
          <p><strong>ID da sessão:</strong> {localSession?.id || 'N/A'}</p>
        </div>
        
        <div className="border p-4 rounded-md">
          <h2 className="font-semibold mb-2">Cookies ({cookies.length})</h2>
          {cookies.length > 0 ? (
            <ul className="list-disc pl-5">
              {cookies.map((cookie, index) => (
                <li key={index}>
                  <strong>{cookie.name}:</strong> {cookie.value}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum cookie encontrado</p>
          )}
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = '/todos'} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Ir para Todos
          </button>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Ir para Login
          </button>
        </div>
      </div>
    </div>
  );
} 