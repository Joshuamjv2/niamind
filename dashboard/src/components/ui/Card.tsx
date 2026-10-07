import React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-niamind-border rounded-2xl shadow-soft p-6">
      {children}
    </div>
  );
}