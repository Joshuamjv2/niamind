import React from "react";

// Replace these with real quotes when available
const testimonials = [
    {
        quote: "The gap between the people who need help and the people who can provide it has always been the hardest thing to close. Niamind is the first platform we have seen that is actually trying to close all of it at once, not just one part.",
        name: "Executive Director",
        organisation: "BasicNeeds Uganda",
        type: "NGO",
    },
    {
        quote: "We have been doing this work for years with limited visibility and unpredictable funding. Being listed on Niamind connected us to a community that understands why this matters. We are reaching people we simply could not reach before.",
        name: "Programs Lead",
        organisation: "TPO Uganda",
        type: "Community program",
    },
    {
        quote: "Awareness is only half the battle. People need somewhere to go when they are ready to act. Niamind is that place. Having our work visible there means the people we educate can actually follow through.",
        name: "Founder",
        organisation: "Mental Health Uganda",
        type: "Advocacy organisation",
    },
];

export default function PartnerTestimonials() {
    return (
        <section className="py-16 bg-niamind-bg border-y border-niamind-border">
            <div className="mx-auto max-w-6xl px-5">
                <p className="text-sm font-bold text-niamind-teal uppercase tracking-wide">
                    From our partners
                </p>
                <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug max-w-2xl">
                    The people doing the work, in their own words.
                </h2>
                <p className="mt-4 text-niamind-muted leading-relaxed max-w-2xl">
                    These are the organisations on the ground. What they say
                    about the problem and about Niamind matters more than
                    anything we could say ourselves.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.organisation}
                            className="rounded-2xl bg-white border border-niamind-border shadow-card p-7 flex flex-col"
                        >
                            {/* Quote mark */}
                            <span className="text-4xl font-extrabold text-niamind-teal leading-none">
                                &ldquo;
                            </span>

                            <p className="mt-2 text-sm text-niamind-muted leading-relaxed flex-1">
                                {t.quote}
                            </p>

                            <div className="mt-6 pt-5 border-t border-niamind-border">
                                <p className="text-sm font-extrabold text-niamind-navy">
                                    {t.name}
                                </p>
                                <p className="text-xs text-niamind-muted mt-0.5">
                                    {t.organisation}
                                </p>
                                <span className="mt-2 inline-block text-xs font-bold text-niamind-muted border border-niamind-border rounded-full px-3 py-1">
                                    {t.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
