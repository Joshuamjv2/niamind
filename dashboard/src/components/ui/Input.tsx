import React from "react";

type Props = {
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-niamind-muted mb-[.5px] font-semibold">{label}</label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-6 py-3 rounded-3xl border border-niamind-border bg-white focus:outline-none focus:ring-2 focus:ring-niamind-teal"
      />
    </div>
  );
}