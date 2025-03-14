import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function GET() {
  try {
    // Obter o ID do usuário autenticado via Clerk
    const { userId } = auth();
    
    return NextResponse.json({
      authenticated: !!userId,
      userId: userId || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erro na API check-auth:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 