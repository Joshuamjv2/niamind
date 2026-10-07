import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
    ArrowLeft,
    ArrowRight,
    Coins,
    User,
    Users,
    UsersRound,
    HeartHandshake,
    Building2,
    ShieldCheck,
} from "lucide-react";
import SEO from "../components/SEO";

export default function SlotsPage() {
    return (
        <>
            <SEO
                title={"How the Niamind Slot System Works"}
                description={
                    "Slots are how professionals earn visibility and how contributions reach partner programmes. Transparent, fair, and community-powered."
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
                                The slot system
                            </p>
                            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-niamind-navy leading-tight">
                                Visibility earned through contribution.{" "}
                                <span className="text-niamind-teal">
                                    Impact measured in real terms.
                                </span>
                            </h1>
                            <p className="mt-5 text-lg text-niamind-muted leading-relaxed">
                                Slots are the internal currency of Niamind. They
                                determine how visible a professional is on the
                                platform, how access is funded for people who
                                cannot pay, and how contributions reach the
                                organisations doing the work on the ground.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What is a slot */}
                <section className="py-16 bg-white border-y border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <p className="text-sm font-bold text-niamind-teal uppercase tracking-wide">
                                    What is a slot
                                </p>
                                <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug">
                                    A unit of contribution with a real value
                                </h2>
                                <div className="mt-6 space-y-4 text-niamind-muted leading-relaxed">
                                    <p>
                                        A slot represents a unit of community
                                        contribution on Niamind. For
                                        professionals, slots are how the
                                        platform recognises and rewards the work
                                        they give to the community. The more
                                        slots a professional holds, the more
                                        visible they are to paying clients and
                                        corporate partners.
                                    </p>
                                    <p>
                                        To be listed on the platform at all, a
                                        professional must hold at least one
                                        slot. That slot is earned by running at
                                        least one community session — not by
                                        paying a listing fee. The platform is
                                        earned, not bought.
                                    </p>
                                    <p>
                                        Every slot has a transparent value shown
                                        in both slots and USD. Nothing is hidden
                                        in abstraction.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-sm font-bold text-niamind-navy">
                                        Minimum to be listed
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                        At least 1 slot is required to appear in
                                        the marketplace. This is earned through
                                        at least one community session.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-sm font-bold text-niamind-navy">
                                        Slots expire
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                        Slots expire after 6 months if unused.
                                        This keeps the marketplace active and
                                        ensures visibility is earned through
                                        consistent contribution, not a one-time
                                        act.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-sm font-bold text-niamind-navy">
                                        Always shown in USD
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                        Every slot transaction shows the slot
                                        count and its USD equivalent side by
                                        side. You always know exactly what
                                        something means in real terms.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Earning slots */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-5">
                        <p className="text-sm font-bold text-niamind-teal uppercase tracking-wide">
                            Earning slots
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug max-w-2xl">
                            Community sessions are how professionals earn
                        </h2>
                        <p className="mt-4 text-niamind-muted leading-relaxed max-w-2xl">
                            Every community session a professional runs earns
                            them slots. The number of slots earned reflects the
                            reach of the session — a group session that serves
                            more people earns more.
                        </p>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-teal/15 flex items-center justify-center">
                                    <User className="h-5 w-5 text-niamind-teal" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    1-on-1 session
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    A single community session with one person.
                                    Direct, personal, and the foundation of what
                                    Niamind is built on.
                                </p>
                                <div className="mt-5 rounded-xl bg-niamind-teal/10 border border-niamind-teal/20 px-4 py-3 flex items-center justify-between">
                                    <span className="text-xs text-niamind-muted font-semibold">
                                        Slots earned
                                    </span>
                                    <span className="text-xl font-extrabold text-niamind-navy">
                                        2
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-gold/20 flex items-center justify-center">
                                    <UsersRound className="h-5 w-5 text-niamind-navy" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Small group session
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    A group session with fewer than 6
                                    participants. Community circles, peer
                                    groups, and focused group work.
                                </p>
                                <div className="mt-5 rounded-xl bg-niamind-gold/10 border border-niamind-gold/20 px-4 py-3 flex items-center justify-between">
                                    <span className="text-xs text-niamind-muted font-semibold">
                                        Slots earned
                                    </span>
                                    <span className="text-xl font-extrabold text-niamind-navy">
                                        4
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                                <div className="h-11 w-11 rounded-2xl bg-niamind-green/15 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-niamind-green" />
                                </div>
                                <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                                    Large group session
                                </h3>
                                <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                    A group session with 6 or more participants.
                                    Wider reach, greater impact, and the highest
                                    slot return.
                                </p>
                                <div className="mt-5 rounded-xl bg-niamind-green/10 border border-niamind-green/20 px-4 py-3 flex items-center justify-between">
                                    <span className="text-xs text-niamind-muted font-semibold">
                                        Slots earned
                                    </span>
                                    <span className="text-xl font-extrabold text-niamind-navy">
                                        6
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Purchasing slots */}
                <section className="py-16 bg-white border-y border-niamind-border">
                    <div className="mx-auto max-w-6xl px-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <p className="text-sm font-bold text-niamind-gold uppercase tracking-wide">
                                    Purchasing slots
                                </p>
                                <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug">
                                    Fair pricing, by design
                                </h2>
                                <div className="mt-6 space-y-4 text-niamind-muted leading-relaxed">
                                    <p>
                                        Professionals can also purchase slots
                                        directly on the platform. The price per
                                        slot is calculated from the median of
                                        their listed rate range — not a flat
                                        price for everyone.
                                    </p>
                                    <p>
                                        This means a professional who charges
                                        higher rates pays more per slot than one
                                        with lower rates. The system scales with
                                        your practice — and it makes
                                        professionals think carefully about the
                                        rates they list, because those rates
                                        determine what contribution back to the
                                        community looks like for them.
                                    </p>
                                    <p>
                                        Slots are also available for purchase by
                                        anyone on the platform — not just
                                        professionals. Individuals and
                                        organisations can buy slots and direct
                                        them to partner programs.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-sm font-bold text-niamind-navy">
                                        How the price is calculated
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                        Niamind uses an internal flat fee per
                                        slot. When a professional purchases
                                        slots, the amount paid is divided by
                                        that flat fee to determine the number of
                                        slots issued. The price they pay per
                                        slot equals the median of their listed
                                        rate range.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-6 shadow-sm">
                                    <p className="text-sm font-bold text-niamind-navy">
                                        Always shown in USD
                                    </p>
                                    <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                                        Every slot purchase shows the slot count
                                        and the USD equivalent clearly. You
                                        always know what you are paying and what
                                        you are getting.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Donating slots */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-5">
                        <p className="text-sm font-bold text-niamind-green uppercase tracking-wide">
                            Donating slots
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold text-niamind-navy leading-snug max-w-2xl">
                            Choose where your slots go
                        </h2>
                        <p className="mt-4 text-niamind-muted leading-relaxed max-w-2xl">
                            Purchased slots are donatable. Professionals and
                            supporters choose exactly where their slots land.
                        </p>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-6 flex flex-col">
                                <div className="h-10 w-10 rounded-xl bg-niamind-teal/15 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-niamind-teal" />
                                </div>
                                <p className="mt-4 font-extrabold text-niamind-navy text-sm">
                                    One organisation
                                </p>
                                <p className="mt-1.5 text-xs text-niamind-muted leading-relaxed flex-1">
                                    Direct all your slots to a single verified
                                    partner program of your choice.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-6 flex flex-col">
                                <div className="h-10 w-10 rounded-xl bg-niamind-gold/20 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-niamind-navy" />
                                </div>
                                <p className="mt-4 font-extrabold text-niamind-navy text-sm">
                                    Multiple organisations
                                </p>
                                <p className="mt-1.5 text-xs text-niamind-muted leading-relaxed flex-1">
                                    Split your slots across several partner
                                    programs at whatever distribution you
                                    choose.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-6 flex flex-col">
                                <div className="h-10 w-10 rounded-xl bg-niamind-green/15 flex items-center justify-center">
                                    <UsersRound className="h-5 w-5 text-niamind-green" />
                                </div>
                                <p className="mt-4 font-extrabold text-niamind-navy text-sm">
                                    Evenly across all
                                </p>
                                <p className="mt-1.5 text-xs text-niamind-muted leading-relaxed flex-1">
                                    Distribute your slots equally across every
                                    listed partner program on Niamind.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-6 flex flex-col">
                                <div className="h-10 w-10 rounded-xl bg-niamind-navy/10 flex items-center justify-center">
                                    <HeartHandshake className="h-5 w-5 text-niamind-navy" />
                                </div>
                                <p className="mt-4 font-extrabold text-niamind-navy text-sm">
                                    Include Niamind
                                </p>
                                <p className="mt-1.5 text-xs text-niamind-muted leading-relaxed flex-1">
                                    Choose to allocate a percentage to Niamind
                                    itself to support platform operations
                                    alongside your partner contributions.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl bg-niamind-bg border border-niamind-border p-6">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-niamind-teal mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-niamind-navy">
                                        Every donation is transparent
                                    </p>
                                    <p className="mt-1 text-sm text-niamind-muted leading-relaxed">
                                        Every slot donation shows the slot
                                        count, the USD equivalent, the
                                        organisation receiving it, and when it
                                        was made. The public impact ledger
                                        records everything. Nothing is absorbed
                                        without a record.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-niamind-navy">
                    <div className="mx-auto max-w-4xl px-5 text-center">
                        <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                            Get involved
                        </p>
                        <h2 className="mt-4 text-3xl font-extrabold text-white leading-snug">
                            The platform is only as strong as the people in it.
                        </h2>
                        <p className="mt-4 text-base text-white/70 leading-relaxed max-w-xl mx-auto">
                            Whether you are a professional building your
                            practice or someone who wants their contribution to
                            mean something real, the slot system is how that
                            happens.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/#waitlist"
                                className="inline-flex justify-center px-6 py-3 rounded-xl bg-white text-niamind-navy font-bold hover:opacity-95 transition"
                            >
                                Get early access
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition"
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
