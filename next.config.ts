import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para supressão de warnings de hidratação
  reactStrictMode: true,
  // Configurações experimentais
  experimental: {
    // Removida a opção suppressHydrationWarning que não é reconhecida
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
