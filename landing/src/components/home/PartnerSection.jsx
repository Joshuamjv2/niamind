import React from "react";
import { HeartHandshake, Building2, Globe2, ArrowRight } from "lucide-react";
import SectionHeader from "../SectionHeader";

export default function PartnersSection() {
    return (
        <section id="partners" className="py-20">
            <div className="mx-auto max-w-6xl px-5">
                <SectionHeader
                    eyebrow="For Partners"
                    title="Built alongside the work already being done."
                    subtitle="Across the region, NGOs, clinics, community programmes, and education initiatives are already doing vital work. Niamind is the infrastructure that connects them to more people, more resources, and more impact."
                />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                        <div className="h-11 w-11 rounded-2xl bg-niamind-teal/15 flex items-center justify-center">
                            <HeartHandshake className="h-6 w-6 text-niamind-teal" />
                        </div>
                        <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                            NGOs and community organisations
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            Join Niamind to extend your reach, receive support
                            directly tied to the care you deliver, and connect
                            with people who are ready to engage. Every
                            contribution is transparent and fully reported.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                        <div className="h-11 w-11 rounded-2xl bg-niamind-gold/20 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-niamind-navy" />
                        </div>
                        <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                            Health programmes and clinics
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            Extend your services digitally, receive referrals
                            from verified professionals, and ensure the people
                            who find Niamind can find their way to you too.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                        <div className="h-11 w-11 rounded-2xl bg-niamind-green/15 flex items-center justify-center">
                            <Globe2 className="h-6 w-6 text-niamind-green" />
                        </div>
                        <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                            Education and awareness campaigns
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            When your campaigns move people to act, Niamind is
                            where they land. We meet them with a clear, calm
                            path forward &mdash; whatever their level of
                            readiness.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center hidden">
                    <a
                        href="/partners"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-niamind-border text-niamind-navy font-bold hover:bg-niamind-bg transition shadow-sm"
                    >
                        Become a partner
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
