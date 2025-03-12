import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Criando um cliente Supabase específico para o middleware
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificando se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // URLs que não exigem autenticação
  const publicUrls = ['/login', '/register', '/'];
  
  // Se o usuário não estiver autenticado e estiver tentando acessar uma rota protegida
  if (!session && !publicUrls.includes(req.nextUrl.pathname)) {
    // Redirecionar para a página de login
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se o usuário estiver autenticado e estiver tentando acessar páginas de login/registro
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    // Redirecionar para a página de tarefas
    return NextResponse.redirect(new URL('/todos', req.url));
  }

  return res;
}

// Configurando quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    // Executar em todas as rotas, exceto arquivos estáticos e API
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}; 