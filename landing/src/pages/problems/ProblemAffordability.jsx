import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { ArrowLeft, Coins, HeartHandshake, Smartphone } from "lucide-react";
import SEO from "../../components/SEO";

export default function ProblemAffordability() {
    return (
        <>
            <SEO
                title={
                    "Why Mental Health Help Is Out of Reach for Most — Niamind"
                }
                description={
                    "A single therapy session costs $13–$40 in Kampala. Many live on under $2 a day. Niamind is addressing this structurally, not symptomatically."
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
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-6xl px-5">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold text-niamind-gold">
                                The problem / Affordability
                            </p>
                            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-niamind-navy leading-tight">
                                Even when help is available, most people still
                                cannot reach it.
                            </h1>
                            <p className="mt-5 text-lg text-niamind-muted leading-relaxed">
                                A single therapy session in Kampala costs
                                between $13 and $40. In a region where millions
                                live on under $2 a day, this is not a pricing
                                problem. It is a structural one. And no amount
                                of good intentions changes that reality.
                            </p>
                        </div>

                        <div className="mt-10 inline-block rounded-2xl bg-niamind-gold/10 border border-niamind-gold/20 px-8 py-6">
                            <p className="text-5xl font-extrabold text-niamind-navy">
                                $13 – $40
                            </p>
                            <p className="mt-2 text-sm text-niamind-muted font-semibold">
                                Cost of one session in Kampala. Many people in
                                Uganda live on under $2 a day.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The reality */}
                <section className="py-16 bg-white border-y border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <p className="text-sm font-bold text-niamind-gold uppercase tracking-wide">
                                    The reality
                                </p>
                                <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug">
                                    When survival comes first, wellbeing becomes
                                    invisible
                                </h2>
                                <div className="mt-6 space-y-4 text-niamind-muted leading-relaxed">
                                    <p>
                                        In Uganda, the average cost of a private
                                        therapy session ranges from UGX 50,000
                                        to 150,000, roughly $13 to $40. For
                                        someone managing food, rent, school
                                        fees, and transport on less than $2 a
                                        day, that is not just expensive. It is
                                        simply not possible.
                                    </p>
                                    <p>
                                        Cost does not sit alone as a barrier. It
                                        compounds with everything else. When
                                        every hour and every shilling goes
                                        toward survival, emotional wellbeing
                                        becomes something to deal with later,
                                        even when the need is urgent.
                                    </p>
                                    <p>
                                        Many platforms that address mental
                                        health access offer a free tier, but
                                        free tiers are usually a lesser product.
                                        Fewer professionals, longer waits, less
                                        attention. The message underneath is
                                        hard to miss: real support is for paying
                                        customers.
                                    </p>
                                    <p>
                                        Niamind is built on a different
                                        principle. Everyone who comes looking
                                        for help reaches the same verified
                                        professionals. What changes is how the
                                        care is funded, not the quality of what
                                        is received.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        UGX 50K – 150K
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        Per session in Kampala
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        Roughly $13 – $40. For millions of
                                        people, one session equals weeks of
                                        income.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        Under $2 / day
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        What many live on
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        When food and shelter come first,
                                        seeking help is not a choice most people
                                        get to make.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        Under 1%
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        Uganda's mental health budget
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        Less than 1% of the national health
                                        budget goes to mental health. For most
                                        people, public support is not a
                                        realistic option.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How Niamind responds */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-5">
                        <p className="text-sm font-bold text-niamind-gold uppercase tracking-wide">
                            How Niamind responds
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug max-w-2xl">
                            Care that does not ask how much you earn
                        </h2>
                        <p className="mt-4 text-niamind-muted leading-relaxed max-w-2xl">
                            Niamind does not offer a reduced product for people
                            who cannot pay. It builds a system where the
                            community funds real access at the same standard as
                            any paid session.
                        </p>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-gold/20 flex items-center justify-center">
                                    <HeartHandshake className="h-6 w-6 text-niamind-navy" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Help for everyone
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    People who are not in a position to pay can
                                    still access verified professionals. A
                                    professional reviews their situation and
                                    takes their case. The same professionals,
                                    the same quality.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-teal/15 flex items-center justify-center">
                                    <Coins className="h-6 w-6 text-niamind-teal" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Access funded by the community
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    Professionals who contribute to the platform
                                    grow their presence within it. Organisations
                                    and individuals who invest in care slots
                                    fund access directly, transparently, and
                                    without dependency on charity.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-green/15 flex items-center justify-center">
                                    <Smartphone className="h-6 w-6 text-niamind-green" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Built for how people actually pay
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    Payments work through M-Pesa, MTN Mobile
                                    Money, Airtel Money, and other local
                                    providers from day one. No bank account
                                    needed. No unnecessary friction for anyone.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-niamind-bg border-t border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5 text-center">
                        <p className="text-xs font-bold text-niamind-gold uppercase tracking-widest">
                            Be part of the response
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy">
                            Everyone deserves help. Not just those who can pay.
                        </h2>
                        <p className="mt-4 text-niamind-muted max-w-xl mx-auto leading-relaxed">
                            Be part of a platform where your circumstances do
                            not decide whether you get help, and where everyone
                            who can contribute, does.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/#waitlist"
                                className="inline-flex justify-center px-6 py-3 rounded-xl bg-niamind-gold text-white font-bold shadow-soft hover:opacity-95 transition"
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
