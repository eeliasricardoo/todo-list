import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { syncUserWithSupabase } from '@/lib/services/supabase-admin';

export async function POST(req: NextRequest) {
  // Verificar se a requisição é autenticada com a chave webhook secreta do Clerk
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error('Segredo do webhook não configurado');
    return NextResponse.json(
      { error: 'Webhook não configurado' },
      { status: 500 }
    );
  }
  
  // Obter as headers da requisição
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');
  
  // Se algum header estiver faltando, retornar erro
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Headers de webhook ausentes');
    return NextResponse.json(
      { error: 'Headers de webhook ausentes' },
      { status: 400 }
    );
  }
  
  // Obter o corpo da requisição como texto
  const payload = await req.text();
  const body = JSON.parse(payload);
  
  // Criar um objeto de headers para autenticação
  const svixHeaders = {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature,
  };
  
  // Inicializar o webhook Svix e verificar a assinatura
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const event = wh.verify(payload, svixHeaders) as WebhookEvent;
    
    // Processar eventos específicos
    const eventType = event.type;
    console.log(`Webhook recebido: ${eventType}`);
    
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      
      // Obter o email principal
      const email = email_addresses && email_addresses.length > 0
        ? email_addresses[0].email_address
        : null;
        
      if (!email) {
        console.error('Email não encontrado para o usuário:', id);
        return NextResponse.json(
          { error: 'Email não encontrado' },
          { status: 400 }
        );
      }
      
      // Sincronizar com o Supabase
      const result = await syncUserWithSupabase({
        id,
        email,
        first_name,
        last_name,
        image_url,
      });
      
      if (result.error) {
        console.error('Erro ao sincronizar usuário com Supabase:', result.error);
        return NextResponse.json(
          { error: 'Erro ao sincronizar usuário' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ success: true });
    }
    
    // Para outros eventos, apenas retornar sucesso
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 400 }
    );
  }
}

// Ignorar CSRF para webhooks
export const config = {
  api: {
    bodyParser: false,
  },
}; 