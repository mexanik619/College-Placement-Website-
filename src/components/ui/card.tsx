import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return <div className={`rounded-xl shadow-md border p-4 bg-blue ${className}`}>{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
