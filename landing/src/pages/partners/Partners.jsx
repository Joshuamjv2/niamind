import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PartnerTestimonials from "../../components/partners/Testimonials";
import {
    ArrowLeft,
    ArrowRight,
    HeartHandshake,
    Building2,
    Globe2,
    BookOpen,
    CheckCircle2,
} from "lucide-react";
import PartnerListings from "../../components/partners/Listings";
import SEO from "../../components/SEO";

const partnerContent = {
    organisation: {
        subheading:
            "Niamind is not starting from scratch. Across the region, organisations like yours are already doing the hard work. We want to connect that work to more people and more funding.",
        steps: [
            {
                title: "Apply to be listed",
                body: "Tell us about your organisation, the work you do, and the communities you serve. We review every application before listing.",
            },
            {
                title: "Get verified",
                body: "We verify your organisation before you appear on the platform. This protects your credibility and the trust of everyone using Niamind.",
            },
            {
                title: "Receive contributions",
                body: "Slot purchases and direct contributions from the Niamind community are routed to you. A 7% platform fee is retained to cover the infrastructure that makes this possible. You receive a full breakdown on every transaction.",
            },
            {
                title: "Grow your reach",
                body: "Your work becomes visible to professionals, users, and donors across the platform. A public impact ledger tracks and publishes every contribution you receive.",
            },
        ],
        cta: "Apply to be listed",
    },
    donor: {
        subheading:
            "Your contribution goes to verified organisations doing real work. A 7% platform fee is retained to keep the infrastructure running. You can see exactly where the rest lands.",
        steps: [
            {
                title: "Choose who you support",
                body: "Browse verified partner organisations and direct your contribution to the cause that matters most to you.",
            },
            {
                title: "Transparent from the start",
                body: "A 7% platform fee covers the cost of running and maintaining Niamind. The remainder goes directly to the organisation you have chosen. Every transaction is broken down clearly.",
            },
            {
                title: "Track the impact",
                body: "A public impact ledger shows how contributions move through the platform and what they fund. Your contribution is always accounted for.",
            },
            {
                title: "Build something lasting",
                body: "Every contribution helps train more practitioners, run more programs, and reach more people who would otherwise have no access at all.",
            },
        ],
        cta: "Support a partner",
    },
};

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

const colorMap = {
    teal: "bg-niamind-teal/15 text-niamind-teal",
    green: "bg-niamind-green/15 text-niamind-green",
    gold: "bg-niamind-gold/20 text-niamind-navy",
    navy: "bg-niamind-navy/10 text-niamind-navy",
};

export default function PartnersPage() {
    const [audience, setAudience] = useState("organisation");
    const content = partnerContent[audience];

    return (
        <>
            <SEO
                title={
                    "Partner With Niamind — NGOs, Clinics and Community Programmes"
                }
                description={
                    "Verified organisations doing mental health work across Africa can list on Niamind, receive contributions, and reach more people."
                }
            />
            <MainLayout>
                {/* Back nav */}
                <div className="mx-auto max-w-6xl px-5 pt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-niamind-muted hover:text-niamind-navy transition"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Niamind
                    </Link>
                </div>

                {/* Hero */}
                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-5">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold text-niamind-teal">
                                Partner programs
                            </p>
                            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-niamind-navy leading-tight">
                                The work is already happening.{" "}
                                <span className="text-niamind-teal">
                                    We are here to amplify it.
                                </span>
                            </h1>
                            <p className="mt-5 text-lg text-niamind-muted leading-relaxed">
                                Niamind partners with verified organisations
                                doing real mental health work across Africa. We
                                connect them to funding, visibility, and a
                                community that believes this work matters.
                            </p>
                        </div>

                        {/* Toggle */}
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-1.5 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAudience("organisation")}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                                        audience === "organisation"
                                            ? "bg-niamind-gold text-white shadow-sm"
                                            : "text-niamind-muted hover:bg-white"
                                    }`}
                                >
                                    I run an organisation
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAudience("donor")}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                                        audience === "donor"
                                            ? "bg-niamind-gold text-white shadow-sm"
                                            : "text-niamind-muted hover:bg-white"
                                    }`}
                                >
                                    I want to contribute
                                </button>
                            </div>

                            <a
                                href="#waitlist"
                                className="inline-flex justify-center px-6 py-3 rounded-xl bg-niamind-teal text-white font-bold shadow-soft hover:opacity-95 transition text-sm"
                            >
                                {content.cta}
                            </a>
                        </div>

                        <p className="mt-5 text-sm text-niamind-muted leading-relaxed max-w-xl">
                            {content.subheading}
                        </p>
                    </div>
                </section>

                {/* How it works — toggle-dependent */}
                <section className="py-16 bg-white border-y border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5">
                        <p className="text-sm font-bold text-niamind-teal uppercase tracking-wide">
                            How it works
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug max-w-2xl">
                            {audience === "organisation"
                                ? "From application to impact"
                                : "From contribution to care"}
                        </h2>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.steps.map((step) => (
                                <div
                                    key={step.title}
                                    className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 flex gap-4"
                                >
                                    <div className="h-8 w-8 rounded-xl bg-niamind-teal/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-niamind-teal" />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-niamind-navy">
                                            {step.title}
                                        </p>
                                        <p className="mt-1 text-sm text-niamind-muted leading-relaxed">
                                            {step.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Partner listings */}
                <PartnerListings />

                {/* Transparency statement */}
                <section className="py-16 bg-niamind-navy">
                    <div className="mx-auto max-w-4xl px-5 text-center">
                        <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                            How contributions work
                        </p>
                        <h2 className="mt-4 text-2xl md:text-3xl font-extrabold text-white leading-snug">
                            A 7% platform fee is retained on all contributions.
                        </h2>
                        <p className="mt-5 text-base text-white/70 leading-relaxed max-w-2xl mx-auto">
                            This covers the cost of running, maintaining, and
                            growing the platform. The remainder goes to the
                            organisation you have chosen to support. Every
                            transaction is broken down clearly for both the
                            donor and the organisation. The public impact ledger
                            records every contribution made through Niamind.
                        </p>
                    </div>
                </section>

                <PartnerTestimonials />

                {/* CTA */}
                <section className="py-16 bg-niamind-bg border-t border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5 text-center">
                        <p className="text-xs font-bold text-niamind-teal uppercase tracking-widest">
                            Get involved
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy">
                            The community is what makes this work.
                        </h2>
                        <p className="mt-4 text-niamind-muted max-w-xl mx-auto leading-relaxed">
                            Whether you run an organisation doing mental health
                            work or you want to contribute to one, there is a
                            place for you here.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/#waitlist"
                                className="inline-flex justify-center px-6 py-3 rounded-xl bg-niamind-teal text-white font-bold shadow-soft hover:opacity-95 transition"
                            >
                                Get early access
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-white border border-niamind-border text-niamind-navy font-bold hover:bg-niamind-bg transition"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to
                                Niamind
                            </Link>
                        </div>
                    </div>
                </section>
            </MainLayout>
        </>
    );
}
