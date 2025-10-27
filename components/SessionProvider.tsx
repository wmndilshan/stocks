'use client';

import React, { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}
