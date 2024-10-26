"use client";

import { ReactNode } from "react";

// Client-side wrapper to handle client components
interface ClientOnlyWrapperProps {
  children: ReactNode;
}

export default function ClientOnlyWrapper({ children }: ClientOnlyWrapperProps) {
  return <>{children}</>;
}
