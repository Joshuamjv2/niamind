import React from "react";

export default function CTACard({
    title,
    description,
    buttonText,
    href,
    variant = "primary",
}) {
    const styles = {
        primary: "bg-niamind-teal text-white hover:opacity-95",
        secondary:
            "bg-white text-niamind-navy border border-niamind-border hover:bg-niamind-bg",
        gold: "bg-niamind-gold text-white hover:opacity-95",
    };

    return (
        <div className="rounded-2xl bg-white shadow-card border border-niamind-border p-7 flex flex-col gap-5">
            <div>
                <h3 className="text-xl font-extrabold text-niamind-navy">
                    {title}
                </h3>
                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                    {description}
                </p>
            </div>

            <a
                href={href}
                className={`mt-auto inline-flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm transition ${styles[variant]}`}
            >
                {buttonText}
            </a>
        </div>
    );
}
