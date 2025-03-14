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

export async function POST(request: Request) {
  try {
    // Verifica autenticação do Clerk
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Extrai dados do corpo da requisição
    const body = await request.json();
    const { id, username, full_name } = body;

    // Verifica se o ID do usuário corresponde ao ID autenticado
    if (id !== userId) {
      return NextResponse.json(
        { error: "ID de usuário não corresponde ao usuário autenticado" },
        { status: 403 }
      );
    }

    // Verifica se o username já está em uso
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: "Nome de usuário já está em uso" },
        { status: 409 }
      );
    }

    // Insere ou atualiza o perfil
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        username,
        full_name,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar perfil:", error);
      return NextResponse.json(
        { error: "Falha ao salvar o perfil" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro no servidor:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Endpoint para verificar a disponibilidade de username
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Nome de usuário não fornecido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 é o código para "Não encontrado", o que é bom neste caso
      return NextResponse.json(
        { error: "Erro ao verificar o nome de usuário" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { available: !data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no servidor:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 