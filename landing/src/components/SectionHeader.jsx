import React from "react";

export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      {eyebrow && (
        <p className="text-sm font-bold tracking-wide text-niamind-teal uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-niamind-navy tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-niamind-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
