import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para supressão de warnings de hidratação
  reactStrictMode: true,
  // Ignorar erros de hidratação durante o desenvolvimento
  experimental: {
    // Esta opção em específico ajuda a ignorar erros de hidratação causados por extensões
    suppressHydrationWarning: true,
  },
  // Opções de React
  compiler: {
    // Ignora certos erros de hidratação durante o desenvolvimento
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    // Permite que pequenas diferenças durante a hidratação não causem um erro fatal
    styledComponents: true,
  },
};

export default nextConfig;
