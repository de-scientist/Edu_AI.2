"use client";

import { ThemeProvider } from "./ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        {mounted && (
          <div suppressHydrationWarning>
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                className: '',
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
          </div>
        )}
      </ThemeProvider>
    </SessionProvider>
  );
} 