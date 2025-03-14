import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Inicializa o cliente Supabase com a chave de serviço para contornar o RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function GET(request: Request) {
  try {
    // Verifica autenticação do Clerk
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter o userId da query string, se presente
    const url = new URL(request.url);
    const queryUserId = url.searchParams.get("userId");

    // Verificar se o userId na query corresponde ao usuário autenticado
    if (queryUserId && queryUserId !== userId) {
      return NextResponse.json(
        { error: "ID de usuário não corresponde ao usuário autenticado" },
        { status: 403 }
      );
    }

    // Buscar o perfil no Supabase
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 é o código para "Não encontrado"
      console.error("Erro ao verificar perfil:", error);
      return NextResponse.json(
        { error: "Erro ao verificar perfil" },
        { status: 500 }
      );
    }

    // Retorna se o usuário tem um perfil e, se tiver, os dados do perfil
    return NextResponse.json({
      hasProfile: !!data,
      profile: data || null,
    });
  } catch (error) {
    console.error("Erro no servidor:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 