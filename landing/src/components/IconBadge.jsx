import React from "react";

/**
 * IconBadge — a consistent circular icon container for use across Niamind.
 *
 * Props:
 *   icon      — a Lucide (or any) React icon component, e.g. <ShieldCheck />
 *   variant   — "teal" | "gold" | "green" | "navy" | "muted"  (default: "teal")
 *   size      — "sm" | "md" | "lg"  (default: "md")
 *   className — any extra Tailwind classes to add to the wrapper
 */

const VARIANT_MAP = {
    teal: { bg: "bg-niamind-teal/15", icon: "text-niamind-teal" },
    gold: { bg: "bg-niamind-gold/20", icon: "text-niamind-gold" },
    green: { bg: "bg-niamind-green/15", icon: "text-niamind-green" },
    navy: { bg: "bg-niamind-navy/10", icon: "text-niamind-navy" },
    muted: { bg: "bg-niamind-border", icon: "text-niamind-muted" },
};

const SIZE_MAP = {
    sm: { wrapper: "h-8 w-8", icon: "h-4 w-4" },
    md: { wrapper: "h-11 w-11", icon: "h-5 w-5" },
    lg: { wrapper: "h-14 w-14", icon: "h-7 w-7" },
};

export default function IconBadge({
    icon,
    variant = "teal",
    size = "md",
    className = "",
}) {
    const { bg, icon: iconColor } = VARIANT_MAP[variant] ?? VARIANT_MAP.teal;
    const { wrapper, icon: iconSize } = SIZE_MAP[size] ?? SIZE_MAP.md;

    // Clone the icon element so we can inject consistent sizing + color classes
    const styledIcon = React.isValidElement(icon)
        ? React.cloneElement(icon, {
              className:
                  `${iconSize} ${iconColor} ${icon.props.className ?? ""}`.trim(),
          })
        : icon;

    return (
        <div
            className={`
                shrink-0 rounded-full flex items-center justify-center
                ${wrapper} ${bg} ${className}
            `.trim()}
        >
            {styledIcon}
        </div>
    );
}
