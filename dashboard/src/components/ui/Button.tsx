import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: Props) {
  const base =
    "px-4 py-2 rounded-3xl font-semibold text-sm transition flex items-center justify-center";

  const styles = {
    primary: "bg-niamind-teal text-white hover:opacity-90 shadow-soft",
    secondary:
      "bg-white border border-niamind-border text-niamind-navy hover:bg-gray-50",
    ghost: "text-niamind-navy hover:bg-gray-100",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}