"use client";

import { useEffect, useState } from "react";

export default function DebugSupabase() {
  const [envVars, setEnvVars] = useState({
    url: "",
    anonKey: ""
  });

  useEffect(() => {
    // No lado do cliente, mostrar apenas os primeiros 10 caracteres da chave por segurança
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "não definido",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` 
        : "não definido"
    });
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-md my-4 text-sm">
      <h2 className="font-semibold mb-2">Depuração do Supabase</h2>
      <div>
        <p><strong>URL:</strong> {envVars.url}</p>
        <p><strong>Chave Anônima (primeiros caracteres):</strong> {envVars.anonKey}</p>
      </div>
    </div>
  );
} 