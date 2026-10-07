import React from "react";
import SectionHeader from "../SectionHeader";

export default function HowItWorksSection() {
    return (
        <section id="how" className="py-20">
            <div className="mx-auto max-w-6xl px-5">
                <SectionHeader
                    eyebrow="How it works"
                    title="Built for everyone. Powered by everyone."
                    subtitle="Niamind works because every person in it plays a part. Professionals, seekers, and partners each contribute to something bigger than themselves."
                />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                        <p className="text-sm font-bold text-niamind-teal">
                            01
                        </p>
                        <h3 className="mt-3 text-lg font-extrabold text-niamind-navy">
                            Professionals bring their best
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            Every professional is credentialed and verified
                            before joining. Their standing on the platform grows
                            through the care they provide &mdash; not through
                            advertising or paid listings.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                        <p className="text-sm font-bold text-niamind-gold">
                            02
                        </p>
                        <h3 className="mt-3 text-lg font-extrabold text-niamind-navy">
                            Seekers find their way forward
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            Everyone who comes to Niamind looking for support is
                            met with the same care and the same quality of
                            professional. Your starting point does not determine
                            the support you receive.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                        <p className="text-sm font-bold text-niamind-green">
                            03
                        </p>
                        <h3 className="mt-3 text-lg font-extrabold text-niamind-navy">
                            The platform sustains itself
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            Partners and organisations invest in a healthier
                            workforce and a healthier society. That investment
                            keeps the platform running and care accessible
                            &mdash; for everyone, not just those who can afford
                            it today.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
