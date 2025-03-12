"use client";

import React, { useEffect } from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * Componente de cliente que envolve o layout principal.
 * Utilizado para lidar com problemas de hidratação e executar código apenas no cliente.
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  useEffect(() => {
    // Este efeito é executado apenas no cliente após a hidratação
    // Podemos fazer ajustes no DOM aqui se necessário
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      // Qualquer atributo adicionado aqui é seguro porque 
      // já estamos no cliente após a hidratação
      htmlElement.setAttribute('data-client-rendered', 'true');
    }
  }, []);

  return <>{children}</>;
} 