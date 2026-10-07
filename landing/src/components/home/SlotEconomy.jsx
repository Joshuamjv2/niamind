import React from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../SectionHeader";
import {
    Coins,
    ArrowRight,
    UsersRound,
    User,
    Users,
    HeartHandshake,
} from "lucide-react";

export default function SlotEconomySection() {
    return (
        <section
            id="slots"
            className="py-20 bg-white border-y border-niamind-border relative overflow-hidden"
        >
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-niamind-teal/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-niamind-gold/10 blur-3xl" />

            <div className="mx-auto max-w-6xl px-5 relative">
                <SectionHeader
                    eyebrow="The slot system"
                    title="Visibility earned. Access expanded."
                    subtitle="Slots are how Niamind turns professional contribution into community access. Every session given, every slot purchased, every donation made — it all moves through the same transparent system."
                />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Earn */}
                    <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-7 flex flex-col">
                        <div className="h-11 w-11 rounded-2xl bg-niamind-teal/15 flex items-center justify-center">
                            <User className="h-5 w-5 text-niamind-teal" />
                        </div>
                        <h3 className="mt-4 font-extrabold text-niamind-navy text-lg">
                            Professionals earn slots
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed flex-1">
                            Every community session a professional runs earns
                            them slots. One-on-one sessions, small group
                            circles, and larger groups each earn a different
                            amount. Slots are what determine how visible a
                            professional is on the platform.
                        </p>
                        <div className="mt-5 space-y-2">
                            <div className="flex items-center justify-between rounded-xl bg-white border border-niamind-border px-4 py-2.5">
                                <div className="flex items-center gap-2 text-xs text-niamind-muted">
                                    <User className="h-3.5 w-3.5 text-niamind-teal" />
                                    1-on-1 session
                                </div>
                                <span className="text-xs font-extrabold text-niamind-navy">
                                    2 slots
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-white border border-niamind-border px-4 py-2.5">
                                <div className="flex items-center gap-2 text-xs text-niamind-muted">
                                    <UsersRound className="h-3.5 w-3.5 text-niamind-teal" />
                                    Group under 6
                                </div>
                                <span className="text-xs font-extrabold text-niamind-navy">
                                    4 slots
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-white border border-niamind-border px-4 py-2.5">
                                <div className="flex items-center gap-2 text-xs text-niamind-muted">
                                    <Users className="h-3.5 w-3.5 text-niamind-teal" />
                                    Group of 6 or more
                                </div>
                                <span className="text-xs font-extrabold text-niamind-navy">
                                    6 slots
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Purchase */}
                    <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-7 flex flex-col">
                        <div className="h-11 w-11 rounded-2xl bg-niamind-gold/20 flex items-center justify-center">
                            <Coins className="h-5 w-5 text-niamind-navy" />
                        </div>
                        <h3 className="mt-4 font-extrabold text-niamind-navy text-lg">
                            Slots can be purchased
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed flex-1">
                            Professionals can also purchase slots directly. The
                            price per slot is calculated from the median of
                            their listed rate — keeping things fair across the
                            platform regardless of where a professional sits in
                            the market.
                        </p>
                        <div className="mt-5 rounded-xl bg-white border border-niamind-border px-4 py-4">
                            <p className="text-xs font-bold text-niamind-navy">
                                Why median pricing?
                            </p>
                            <p className="mt-1.5 text-xs text-niamind-muted leading-relaxed">
                                A slot costs what your practice reflects. A
                                high-end professional pays more per slot than
                                one with lower rates. Fair by design — and it
                                makes professionals think carefully about the
                                rates they list.
                            </p>
                        </div>
                    </div>

                    {/* Give */}
                    <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-7 flex flex-col">
                        <div className="h-11 w-11 rounded-2xl bg-niamind-green/15 flex items-center justify-center">
                            <HeartHandshake className="h-5 w-5 text-niamind-green" />
                        </div>
                        <h3 className="mt-4 font-extrabold text-niamind-navy text-lg">
                            Slots become real impact
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed flex-1">
                            Purchased slots are donatable. Professionals choose
                            where they go — one organisation, split across
                            several, or distributed evenly across all listed
                            programs. Every slot shows its value in both slots
                            and USD.
                        </p>
                        <div className="mt-5 rounded-xl bg-white border border-niamind-border px-4 py-4">
                            <p className="text-xs font-bold text-niamind-navy">
                                Full transparency, always
                            </p>
                            <p className="mt-1.5 text-xs text-niamind-muted leading-relaxed">
                                Every slot is shown alongside its USD
                                equivalent. You always know exactly what your
                                contribution means in real terms.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-10 rounded-2xl bg-niamind-navy text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-extrabold text-white text-lg">
                            There is more to the slot system than this.
                        </p>
                        <p className="mt-1 text-sm text-white/60 leading-relaxed max-w-xl">
                            How slots are calculated, how donations are
                            distributed, and how the whole thing stays
                            transparent and fair.
                        </p>
                    </div>
                    <Link
                        to="/slots"
                        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-niamind-navy font-bold hover:opacity-95 transition text-sm"
                    >
                        How slots work
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
