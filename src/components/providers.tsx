"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { EmissionsProvider } from "@/context/EmissionsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <EmissionsProvider>{children}</EmissionsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
