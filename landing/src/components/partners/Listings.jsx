import React from "react";
import {
    ArrowRight,
    HeartHandshake,
    Building2,
    Globe2,
    BookOpen,
} from "lucide-react";

const partners = [
    {
        name: "BasicNeeds Uganda",
        type: "NGO",
        description:
            "Works with people living with mental illness and epilepsy to help them access treatment, rebuild their livelihoods, and reintegrate into their communities.",
        icon: HeartHandshake,
        color: "teal",
    },
    {
        name: "TPO Uganda",
        type: "Community program",
        description:
            "Provides psychosocial support and mental health services to conflict-affected and vulnerable populations across Uganda.",
        icon: Globe2,
        color: "green",
    },
    {
        name: "Mental Health Uganda",
        type: "Advocacy organisation",
        description:
            "A user-led organisation advocating for the rights and wellbeing of people living with mental health conditions across Uganda.",
        icon: Building2,
        color: "gold",
    },
];

const colorMap = {
    teal: "bg-niamind-teal/15 text-niamind-teal",
    green: "bg-niamind-green/15 text-niamind-green",
    gold: "bg-niamind-gold/20 text-niamind-navy",
    navy: "bg-niamind-navy/10 text-niamind-navy",
};

export default function PartnerListings() {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-6xl px-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                        <p className="text-sm font-bold text-niamind-teal uppercase tracking-wide">
                            Our partners
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug max-w-2xl">
                            Organisations already doing the work
                        </h2>
                        <p className="mt-4 text-niamind-muted leading-relaxed max-w-xl">
                            Every organisation listed here has been verified by
                            Niamind. They receive contributions and publish
                            their impact through the platform's public ledger.
                        </p>
                    </div>

                    <a
                        href="/partners/all"
                        className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-niamind-navy border border-niamind-border rounded-xl px-5 py-3 hover:bg-niamind-bg transition"
                    >
                        See all
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                {/* Cards — 1 col on mobile, 2 on tablet, 3 on desktop */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((partner) => {
                        const Icon = partner.icon;
                        return (
                            <div
                                key={partner.name}
                                className="rounded-2xl bg-white border border-niamind-border shadow-card p-7 flex flex-col"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div
                                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[partner.color]}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-bold text-niamind-muted border border-niamind-border rounded-full px-3 py-1 shrink-0">
                                        {partner.type}
                                    </span>
                                </div>

                                <p className="mt-4 font-extrabold text-niamind-navy">
                                    {partner.name}
                                </p>

                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed flex-1">
                                    {partner.description}
                                </p>

                                <a
                                    href="#waitlist"
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-niamind-teal hover:opacity-70 transition"
                                >
                                    Get involved
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* See more */}
                <div className="mt-8 text-center">
                    <a
                        href="/partners/all"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-niamind-border text-niamind-navy font-bold hover:bg-niamind-bg transition text-sm"
                    >
                        See all
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
