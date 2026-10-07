import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { ArrowLeft, Users, Building2, HeartHandshake } from "lucide-react";
import SEO from "../../components/SEO";

export default function ProblemAccess() {
    return (
        <>
            <SEO
                title={"The Mental Health Access Crisis in Africa — Niamind"}
                description={
                    "Uganda has fewer than 100 psychiatrists for 45 million people. Niamind is building the infrastructure to close that gap."
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
                            <p className="text-sm font-bold text-niamind-teal">
                                The problem / Access
                            </p>
                            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-niamind-navy leading-tight">
                                There are not enough people to help.
                            </h1>
                            <p className="mt-5 text-lg text-niamind-muted leading-relaxed">
                                Uganda has fewer than 100 psychiatrists for over
                                45 million people. The crisis is not just about
                                numbers. It is about what happens to real people
                                when the support they need simply is not there.
                            </p>
                        </div>

                        <div className="mt-10 inline-block rounded-2xl bg-niamind-teal/10 border border-niamind-teal/20 px-8 py-6">
                            <p className="text-5xl font-extrabold text-niamind-navy">
                                1 : 500,000
                            </p>
                            <p className="mt-2 text-sm text-niamind-muted font-semibold">
                                Psychiatrists to people in Uganda. The
                                recommended ratio is 1 per 30,000.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The reality */}
                <section className="py-16 bg-white border-y border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <p className="text-sm font-bold text-niamind-teal uppercase tracking-wide">
                                    The reality
                                </p>
                                <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug">
                                    A system stretched far beyond what it was
                                    built to hold
                                </h2>
                                <div className="mt-6 space-y-4 text-niamind-muted leading-relaxed">
                                    <p>
                                        Uganda's Butabika National Referral
                                        Mental Hospital, the country's largest
                                        mental health facility, handles over
                                        1,000 patients daily with just 14
                                        specialists. It is operating at over
                                        118% capacity and carries a funding
                                        deficit of more than $25 million.
                                    </p>
                                    <p>
                                        Across Uganda, fewer than 60
                                        government-employed psychiatrists serve
                                        the entire country across 11 mental
                                        health facilities. For most people,
                                        reaching one means travelling hours,
                                        waiting days, and hoping there is still
                                        space when they arrive.
                                    </p>
                                    <p>
                                        Uganda spends less than 1% of its
                                        national health budget on mental health.
                                        The economic cost of untreated mental
                                        illness is projected to rise from $1.1
                                        billion in 2024 to $4.5 billion by 2040.
                                    </p>
                                    <p>
                                        This cannot be fixed by one platform or
                                        one policy. It requires building new
                                        capacity, training more practitioners,
                                        funding more programmes, and creating
                                        infrastructure that allows existing
                                        professionals to reach far more people
                                        than the physical system ever could.
                                    </p>
                                </div>
                            </div>

                            {/* Stat cards */}
                            <div className="space-y-4">
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        Under 100
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        Psychiatrists in Uganda
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        For a population of over 45 million
                                        people.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        14
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        Specialists at Butabika Hospital
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        For 1,200+ patients. Operating at 118%
                                        capacity with a $25M funding deficit.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        $4.5B
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        Projected economic loss by 2040
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        Up from $1.1 billion in 2024. Untreated
                                        mental illness carries a cost for all of
                                        us.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How Niamind responds */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-5">
                        <p className="text-sm font-bold text-niamind-teal uppercase tracking-wide">
                            How Niamind responds
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug max-w-2xl">
                            Building capacity, not just connecting to what
                            exists
                        </h2>
                        <p className="mt-4 text-niamind-muted leading-relaxed max-w-2xl">
                            Niamind is not a directory. It is designed to grow
                            the number of people who can give and receive
                            support from multiple directions at once.
                        </p>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-teal/15 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-niamind-teal" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Care without borders
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    Verified professionals connect with people
                                    online so geography is no longer the reason
                                    someone cannot be helped. One professional
                                    can reach far more people than a physical
                                    practice ever allows.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-gold/20 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-niamind-navy" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Investing in new capacity
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    Niamind channels support directly to
                                    verified organisations training the next
                                    generation of practitioners, including
                                    community health workers, peer supporters,
                                    and clinic-based mental health staff.
                                    Transparently and publicly.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-green/15 flex items-center justify-center">
                                    <HeartHandshake className="h-6 w-6 text-niamind-green" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Participation that opens doors
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    Professionals who contribute to the
                                    community grow their presence on the
                                    platform. Every act of care creates a
                                    measurable, direct link between professional
                                    engagement and wider access.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-niamind-bg border-t border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5 text-center">
                        <p className="text-xs font-bold text-niamind-teal uppercase tracking-widest">
                            Be part of the response
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy">
                            The gap is too wide to wait.
                        </h2>
                        <p className="mt-4 text-niamind-muted max-w-xl mx-auto leading-relaxed">
                            Whether you are a professional ready to make your
                            work count further, or someone who believes this
                            matters, there is a place for you in what we are
                            building.
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
