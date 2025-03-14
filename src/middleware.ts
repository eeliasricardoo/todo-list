import { clerkMiddleware } from "@clerk/nextjs/server";

// Este middleware do Clerk gerencia a autenticação para rotas específicas
export default clerkMiddleware();

export const config = {
  // Configuração de matcher para todas as rotas, exceto arquivos estáticos
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}; 