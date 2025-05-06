// import React from "react";

// export function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
//   return <div className={`rounded-xl shadow-md border p-4 bg-blue ${className}`}>{children}</div>;
// }

// export function CardContent({ children }: { children: React.ReactNode }) {
//   return <div>{children}</div>;
// }

import React from "react";

export function Card({ 
  children, 
  className = "", 
  style = {} 
}: { 
  children: React.ReactNode, 
  className?: string,
  style?: React.CSSProperties 
}) {
  return (
    <div 
      className={`rounded-xl shadow-md border p-4 bg-blue text-black ${className}`}
      style={{ color: "#000000", ...style }}
    >
      {children}
    </div>
  );
}

export function CardContent({ 
  children,
  style = {}
}: { 
  children: React.ReactNode,
  style?: React.CSSProperties
}) {
  return <div style={{ color: "#000000", ...style }}>{children}</div>;
}