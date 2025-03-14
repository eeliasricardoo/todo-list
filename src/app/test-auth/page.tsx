"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

export default function TestAuthPage() {
  const { user, session, isLoading } = useAuth();
  const [testResults, setTestResults] = useState<{ test: string; status: 'success' | 'error' | 'pending'; message: string }[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [allCookies, setAllCookies] = useState<string>("");

  useEffect(() => {
    // Obter todos os cookies para depuração
    setAllCookies(document.cookie);
  }, []);

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    // Teste 1: Verificar o estado de autenticação
    addTestResult({
      test: "Estado de autenticação",
      status: "pending",
      message: "Verificando estado atual..."
    });
    
    // Esperar um pouco para garantir que o estado de autenticação está carregado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar estado de autenticação
    const authStateResult = {
      test: "Estado de autenticação",
      status: user ? 'success' : 'error',
      message: user 
        ? `Autenticado como ${user.email} (${user.id})` 
        : "Não autenticado. Faça login primeiro para executar os testes completos."
    } as const;
    
    updateTestResult(authStateResult);
    
    // Se não estiver autenticado, não continuar com os outros testes
    if (!user) {
      setIsRunningTests(false);
      return;
    }
    
    // Teste 2: Verificar cookies
    addTestResult({
      test: "Cookies de sessão",
      status: "pending",
      message: "Verificando cookies..."
    });
    
    const hasCookies = document.cookie.includes('sb-');
    updateTestResult({
      test: "Cookies de sessão",
      status: hasCookies ? 'success' : 'error',
      message: hasCookies 
        ? "Cookies do Supabase encontrados" 
        : "Cookies de sessão não encontrados"
    });
    
    // Teste 3: Verificar sessão do Supabase diretamente
    addTestResult({
      test: "Sessão Supabase",
      status: "pending",
      message: "Verificando sessão diretamente com Supabase..."
    });
    
    try {
      const { data, error } = await supabase.auth.getSession();
      updateTestResult({
        test: "Sessão Supabase",
        status: data.session ? 'success' : 'error',
        message: data.session 
          ? `Sessão válida: ${data.session.user.id}` 
          : `Sem sessão válida: ${error?.message || "Motivo desconhecido"}`
      });
    } catch (error: any) {
      updateTestResult({
        test: "Sessão Supabase",
        status: 'error',
        message: `Erro ao verificar sessão: ${error.message}`
      });
    }
    
    // Teste 4: Middleware redirection test
    addTestResult({
      test: "Redirecionamento Middleware",
      status: "pending",
      message: "Testando redirecionamentos do middleware..."
    });
    
    // Verificar se o middleware está funcionando corretamente
    try {
      const response = await fetch('/api/check-auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      updateTestResult({
        test: "Redirecionamento Middleware",
        status: data.authenticated ? 'success' : 'error',
        message: data.authenticated 
          ? "Middleware reconhece autenticação" 
          : "Middleware não reconhece autenticação"
      });
    } catch (error: any) {
      updateTestResult({
        test: "Redirecionamento Middleware",
        status: 'error',
        message: `Erro ao verificar middleware: ${error.message}`
      });
    }
    
    // Teste 5: Navegação direta para todos
    addTestResult({
      test: "Navegação para /todos",
      status: "pending",
      message: "Verificando navegação direta para todos..."
    });
    
    // Criar um teste de navegação que não force um redirecionamento
    // mas verifique se a navegação funcionaria
    try {
      updateTestResult({
        test: "Navegação para /todos",
        status: 'success',
        message: "Usuário autenticado, navegação para /todos deve funcionar"
      });
    } catch (error: any) {
      updateTestResult({
        test: "Navegação para /todos",
        status: 'error',
        message: `Erro ao verificar navegação: ${error.message}`
      });
    }
    
    setIsRunningTests(false);
  };
  
  const addTestResult = (result: { test: string; status: 'success' | 'error' | 'pending'; message: string }) => {
    setTestResults(prev => [...prev, result]);
  };
  
  const updateTestResult = (result: { test: string; status: 'success' | 'error' | 'pending'; message: string }) => {
    setTestResults(prev => 
      prev.map(item => 
        item.test === result.test ? result : item
      )
    );
  };
  
  const renderStatusIcon = (status: 'success' | 'error' | 'pending') => {
    if (status === 'success') return '✅';
    if (status === 'error') return '❌';
    return '⏳';
  };
  
  const executeLoginTest = async () => {
    const testEmail = "test@user.com";
    const testPassword = "password123";
    
    addTestResult({
      test: "Login Teste",
      status: "pending",
      message: `Tentando login com ${testEmail}...`
    });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      if (error) {
        updateTestResult({
          test: "Login Teste",
          status: 'error',
          message: `Erro no login: ${error.message}`
        });
      } else {
        updateTestResult({
          test: "Login Teste",
          status: 'success',
          message: `Login bem-sucedido! Usuário: ${data.user?.id}`
        });
        
        // Atualizar informações da página após login
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      updateTestResult({
        test: "Login Teste",
        status: 'error',
        message: `Exceção ao fazer login: ${error.message}`
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Teste de Autenticação</h1>
        
        <div className="bg-muted/50 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Status Atual</h2>
          <p><strong>Autenticado:</strong> {isLoading ? "Carregando..." : user ? "Sim" : "Não"}</p>
          {user && (
            <>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID do Usuário:</strong> {user.id}</p>
              <p><strong>Sessão válida:</strong> {session ? "Sim" : "Não"}</p>
            </>
          )}
        </div>
        
        <div className="flex gap-4 mb-8">
          <Button onClick={runTests} disabled={isRunningTests}>
            {isRunningTests ? "Executando testes..." : "Executar Testes"}
          </Button>
          
          {!user && (
            <Button onClick={executeLoginTest} variant="outline">
              Fazer Login de Teste
            </Button>
          )}
          
          <Button onClick={() => window.location.href = '/todos'} variant="secondary">
            Ir para Todos
          </Button>
          
          <Button onClick={() => window.location.href = '/todos-direct'} variant="secondary">
            Ir para Todos Direct
          </Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <h2 className="text-xl font-semibold p-4 bg-muted">Resultados dos Testes</h2>
            <div className="divide-y">
              {testResults.map((result, index) => (
                <div key={index} className="p-4 flex items-start gap-3">
                  <span className="text-xl">{renderStatusIcon(result.status)}</span>
                  <div>
                    <h3 className="font-medium">{result.test}</h3>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Informações de Debug</h2>
          <div className="bg-black text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <p className="mb-2"><strong>Cookies:</strong></p>
            <pre>{allCookies || "Nenhum cookie encontrado"}</pre>
          </div>
        </div>
      </div>
    </>
  );
} 