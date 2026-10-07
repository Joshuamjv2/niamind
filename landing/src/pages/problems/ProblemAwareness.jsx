import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { ArrowLeft, Globe2, BookOpen, HeartHandshake } from "lucide-react";
import SEO from "../../components/SEO";

export default function ProblemAwareness() {
    return (
        <>
            <SEO
                title={
                    "Millions Struggling With No Name for What They Feel — Niamind"
                }
                description={
                    "Mental health literacy across East Africa remains critically low. Niamind is the destination awareness campaigns point to."
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
                            <p className="text-sm font-bold text-niamind-green">
                                The problem / Awareness
                            </p>
                            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-niamind-navy leading-tight">
                                Millions are struggling with no name for what
                                they feel.
                            </h1>
                            <p className="mt-5 text-lg text-niamind-muted leading-relaxed">
                                Mental health literacy across East Africa
                                remains critically low. Many people experiencing
                                depression, anxiety, or trauma have never been
                                given the language to describe it, and stigma
                                ensures they rarely ask for it.
                            </p>
                        </div>

                        <div className="mt-10 inline-block rounded-2xl bg-niamind-green/10 border border-niamind-green/20 px-8 py-6">
                            <p className="text-5xl font-extrabold text-niamind-navy">
                                14M+
                            </p>
                            <p className="mt-2 text-sm text-niamind-muted font-semibold">
                                People in Uganda estimated to be living with
                                mental illness. Many do not know it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The reality */}
                <section className="py-16 bg-white border-y border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <p className="text-sm font-bold text-niamind-green uppercase tracking-wide">
                                    The reality
                                </p>
                                <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug">
                                    You cannot seek help for something you have
                                    no words for
                                </h2>
                                <div className="mt-6 space-y-4 text-niamind-muted leading-relaxed">
                                    <p>
                                        Mental health education in Uganda often
                                        arrives late, sometimes not until
                                        secondary school, sometimes never. With
                                        significant school dropout rates and
                                        millions who never reach that level of
                                        education, awareness does not filter
                                        through. The knowledge simply does not
                                        arrive.
                                    </p>
                                    <p>
                                        Even when people experience symptoms,
                                        stigma, in families, communities,
                                        churches, and workplaces, prevents them
                                        from naming it. Depression becomes
                                        laziness. Anxiety becomes weakness.
                                        Trauma becomes something to push
                                        through. The social cost of speaking up
                                        is too high.
                                    </p>
                                    <p>
                                        Awareness campaigns often exist in
                                        isolation. There is no clear destination
                                        for people who receive that information
                                        and want to act on it. The awareness
                                        happens, and then nothing follows.
                                    </p>
                                    <p>
                                        Niamind is designed to be the
                                        destination that awareness campaigns
                                        point to. Not just a place to book a
                                        session, but a place to start
                                        understanding what you are going
                                        through, and to take a first step.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        6M+
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        Children affected in Uganda
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        Over 6 million children are affected by
                                        mental health challenges. Most receive
                                        no support and no diagnosis.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        Low
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        Mental health literacy across East
                                        Africa
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        Many people experiencing chronic mental
                                        illness attribute symptoms to spiritual
                                        causes, family conflict, or personal
                                        failure, never connecting them to mental
                                        health.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-3xl font-extrabold text-niamind-navy">
                                        Everywhere
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-niamind-navy">
                                        Stigma, in homes, schools, workplaces
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted">
                                        The social cost of speaking openly about
                                        mental health remains one of the most
                                        powerful barriers to seeking support.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How Niamind responds */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-5">
                        <p className="text-sm font-bold text-niamind-green uppercase tracking-wide">
                            How Niamind responds
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug max-w-2xl">
                            A platform built to receive people who are just
                            starting to understand
                        </h2>
                        <p className="mt-4 text-niamind-muted leading-relaxed max-w-2xl">
                            Niamind is not waiting for people to arrive already
                            informed. It is designed to meet people at the
                            beginning of their awareness — and give them
                            somewhere real to go.
                        </p>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-green/15 flex items-center justify-center">
                                    <Globe2 className="h-6 w-6 text-niamind-green" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    The awareness destination
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    When awareness campaigns, community leaders,
                                    or health workers point people toward mental
                                    health support — Niamind is where they land.
                                    Built to receive people who are just
                                    beginning to ask questions.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-teal/15 flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-niamind-teal" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Partner education programs
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    Niamind funds and lists verified mental
                                    health education programs. From school
                                    campaigns to community training, the
                                    platform routes contributions to
                                    organisations actively expanding mental
                                    health literacy on the ground.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-gold/20 flex items-center justify-center">
                                    <HeartHandshake className="h-6 w-6 text-niamind-navy" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Community circles
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    Group sessions and peer circles create
                                    low-barrier entry points for people not yet
                                    ready for one-on-one sessions. Community is
                                    often where awareness begins — and where
                                    stigma starts to break.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-niamind-bg border-t border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5 text-center">
                        <p className="text-xs font-bold text-niamind-green uppercase tracking-widest">
                            Be part of the response
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy">
                            Awareness without somewhere to go is just noise.
                        </h2>
                        <p className="mt-4 text-niamind-muted max-w-xl mx-auto leading-relaxed">
                            Niamind is the destination. Help us build it — for
                            everyone who will eventually need it.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/#waitlist"
                                className="inline-flex justify-center px-6 py-3 rounded-xl bg-niamind-green text-white font-bold shadow-soft hover:opacity-95 transition"
                            >
                                Join the waitlist
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
