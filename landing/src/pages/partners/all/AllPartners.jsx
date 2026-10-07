import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    HeartHandshake,
    Building2,
    Globe2,
    BookOpen,
    Search,
} from "lucide-react";
import SEO from "../../../components/SEO";

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
    {
        name: "Butabika Hospital",
        type: "Health facility",
        description:
            "Uganda's national referral mental health hospital, serving over 1,000 patients daily and training the next generation of mental health practitioners.",
        icon: BookOpen,
        color: "navy",
    },
];

const types = [
    "All",
    "NGO",
    "Community program",
    "Advocacy organisation",
    "Health facility",
];

const colorMap = {
    teal: "bg-niamind-teal/15 text-niamind-teal",
    green: "bg-niamind-green/15 text-niamind-green",
    gold: "bg-niamind-gold/20 text-niamind-navy",
    navy: "bg-niamind-navy/10 text-niamind-navy",
};

export default function AllPartnersPage() {
    const [activeType, setActiveType] = useState("All");
    const [query, setQuery] = useState("");

    const filtered = partners.filter((p) => {
        const matchesType = activeType === "All" || p.type === activeType;
        const matchesQuery =
            query === "" ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase());
        return matchesType && matchesQuery;
    });

    return (
        <>
            <SEO
                title={"All Partner Organisations | Niamind"}
                description={
                    "Browse every verified mental health organisation on Niamind. Filter by type and find the cause that matters most to you."
                }
            />
            <div className="min-h-screen bg-niamind-bg">
                {/* Back nav */}
                <div className="mx-auto max-w-6xl px-5 pt-8">
                    <Link
                        to="/partners"
                        className="inline-flex items-center gap-2 text-sm font-bold text-niamind-muted hover:text-niamind-navy transition"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to partners
                    </Link>
                </div>

                {/* Header */}
                <section className="py-12">
                    <div className="mx-auto max-w-6xl px-5">
                        <p className="text-sm font-bold text-niamind-teal uppercase tracking-wide">
                            Partner directory
                        </p>
                        <h1 className="mt-3 text-4xl font-extrabold text-niamind-navy leading-tight">
                            Every organisation we work with
                        </h1>
                        <p className="mt-4 text-niamind-muted leading-relaxed max-w-xl">
                            Verified organisations doing real mental health work
                            across Africa. Browse by type or search by name.
                        </p>

                        {/* Search + filters */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-niamind-muted" />
                                <input
                                    type="text"
                                    placeholder="Search organisations"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-niamind-border bg-white text-sm text-niamind-navy placeholder:text-niamind-muted outline-none focus:ring-2 focus:ring-niamind-teal/30"
                                />
                            </div>

                            {/* Type filters */}
                            <div className="flex flex-wrap gap-2">
                                {types.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setActiveType(type)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                                            activeType === type
                                                ? "bg-niamind-navy text-white"
                                                : "bg-white border border-niamind-border text-niamind-muted hover:bg-niamind-bg"
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid */}
                <section className="pb-20">
                    <div className="mx-auto max-w-6xl px-5">
                        {filtered.length === 0 ? (
                            <div className="rounded-2xl bg-white border border-niamind-border p-12 text-center">
                                <p className="font-extrabold text-niamind-navy">
                                    No organisations found
                                </p>
                                <p className="mt-2 text-sm text-niamind-muted">
                                    Try a different search or filter.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered.map((partner) => {
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
                        )}

                        {/* Count */}
                        <p className="mt-8 text-xs text-niamind-muted text-center">
                            Showing {filtered.length} of {partners.length}{" "}
                            verified organisations
                        </p>
                    </div>
                </section>

                {/* CTA — apply to list */}
                <section className="py-16 bg-white border-t border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-extrabold text-niamind-navy text-lg">
                                Is your organisation not listed yet?
                            </p>
                            <p className="mt-1 text-sm text-niamind-muted leading-relaxed max-w-md">
                                If you are doing verified mental health work
                                across Africa, there is a place for you here.
                            </p>
                        </div>
                        <Link
                            to="/partners"
                            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-niamind-teal text-white font-bold hover:opacity-95 transition text-sm"
                        >
                            Apply to be listed
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
