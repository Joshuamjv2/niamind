import React from "react";
import { ArrowRight } from "lucide-react";
import SectionHeader from "../SectionHeader";

export default function ProblemSection() {
    return (
        <section
            id="problem"
            className="relative overflow-hidden py-20 bg-[#F7FAF9] border-y border-niamind-border"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-niamind-teal/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-niamind-gold/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl px-5">
                <SectionHeader
                    eyebrow="The problem"
                    title="Three barriers. One crisis."
                    subtitle="Across Africa, three barriers stand between people and the support they need. Awareness. Access. Affordability. All three are real. All three are urgent."
                />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Access */}
                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7 flex flex-col">
                        <p className="text-sm font-bold text-niamind-teal">
                            Too few professionals
                        </p>

                        <h3 className="mt-2 text-xl font-extrabold text-niamind-navy">
                            Not enough help
                        </h3>

                        <div className="mt-5 rounded-2xl bg-niamind-teal/10 border border-niamind-teal/20 p-5">
                            <p className="text-3xl font-extrabold text-niamind-navy">
                                1 : 500,000
                            </p>

                            <p className="mt-1 text-xs text-niamind-muted font-semibold">
                                Psychiatrists to people. Uganda's reality.
                            </p>
                        </div>

                        <p className="mt-5 text-sm text-niamind-muted leading-relaxed flex-1">
                            Uganda has fewer than 100 psychiatrists for over 45
                            million people. The recommended ratio is 1 per
                            30,000. The gap is not closing. It is widening.
                        </p>

                        <a
                            href="/problem/access"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-niamind-navy hover:opacity-70 transition"
                        >
                            Read more <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Affordability */}
                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7 flex flex-col">
                        <p className="text-sm font-bold text-niamind-gold">
                            Cost as a barrier
                        </p>

                        <h3 className="mt-2 text-xl font-extrabold text-niamind-navy">
                            Out of reach
                        </h3>

                        <div className="mt-5 rounded-2xl bg-niamind-gold/10 border border-niamind-gold/20 p-5">
                            <p className="text-3xl font-extrabold text-niamind-navy">
                                $13 – $40
                            </p>

                            <p className="mt-1 text-xs text-niamind-muted font-semibold">
                                Cost of one session. Many live on under $2 a
                                day.
                            </p>
                        </div>

                        <p className="mt-5 text-sm text-niamind-muted leading-relaxed flex-1">
                            Even when support exists and people are ready to
                            seek it, the cost of a single session puts it out of
                            reach for most. This is not a pricing problem. It is
                            a structural one, and it needs a structural
                            response.
                        </p>

                        <a
                            href="/problem/affordability"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-niamind-navy hover:opacity-70 transition"
                        >
                            Read more <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Awareness */}
                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7 flex flex-col">
                        <p className="text-sm font-bold text-niamind-green">
                            Silence and stigma
                        </p>

                        <h3 className="mt-2 text-xl font-extrabold text-niamind-navy">
                            Hidden in plain sight
                        </h3>

                        <div className="mt-5 rounded-2xl bg-niamind-green/10 border border-niamind-green/20 p-5">
                            <p className="text-3xl font-extrabold text-niamind-navy">
                                14M+
                            </p>

                            <p className="mt-1 text-xs text-niamind-muted font-semibold">
                                People in Uganda living with mental illness.
                            </p>
                        </div>

                        <p className="mt-5 text-sm text-niamind-muted leading-relaxed flex-1">
                            Millions are living with depression, anxiety, or
                            trauma without words for what they are experiencing.
                            Stigma in homes, schools, and workplaces keeps
                            people silent long before cost or access ever
                            becomes a factor.
                        </p>

                        <a
                            href="/problem/awareness"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-niamind-navy hover:opacity-70 transition"
                        >
                            Read more <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* Philosophy statement */}
                <div className="mt-12 rounded-2xl bg-niamind-navy text-white p-8 md:p-10 text-center">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                        Our position
                    </p>

                    <p className="mt-4 text-xl md:text-2xl font-extrabold leading-snug max-w-3xl mx-auto">
                        Niamind addresses all three barriers together. Not
                        because it is the boldest story to tell, but because
                        solving one without the others has never been enough.
                    </p>
                </div>
            </div>
        </section>
    );
}
