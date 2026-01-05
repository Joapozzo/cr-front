"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

type WelcomeToastOptions = {
  appName?: string;
  storageFlag?: string;
  storageNameKey?: string;
};

export function useWelcomeToast({
  appName = "Copa Relámpago",
  storageFlag = "registro_completo",
  storageNameKey = "usuario_nombre",
}: WelcomeToastOptions = {}) {
  const pathname = usePathname();

  useEffect(() => {
    // Solo mostrar el toast de bienvenida si estamos en /home
    if (pathname !== "/home") {
      return;
    }

    const registroCompleto = sessionStorage.getItem(storageFlag);
    const usuarioNombre = sessionStorage.getItem(storageNameKey);

    if (registroCompleto === "true") {
      sessionStorage.removeItem(storageFlag);
      sessionStorage.removeItem(storageNameKey);

      const nombre = usuarioNombre || "Usuario";

      toast.success(`¡Bienvenido a ${appName}, ${nombre}! 🎉`, {
        duration: 5000,
        icon: "👋",
        style: {
          background: "var(--gray-400)",
          color: "white",
          border: "1px solid var(--green)",
        },
      });
    }
  }, [appName, storageFlag, storageNameKey, pathname]);
}
