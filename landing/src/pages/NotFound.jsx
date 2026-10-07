import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ArrowRight } from "lucide-react";

const links = [
    { label: "Find help", href: "/#waitlist" },
    { label: "Join as a professional", href: "/#waitlist" },
    { label: "Partner programs", href: "/partners" },
    { label: "How slots work", href: "/slots" },
];

export default function NotFound() {
    return (
        <MainLayout>
            <section className="min-h-[70vh] flex items-center">
                <div className="mx-auto max-w-6xl px-5 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left */}
                    <div>
                        <p className="text-sm font-bold text-niamind-teal uppercase tracking-widest">
                            404
                        </p>
                        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-niamind-navy leading-tight">
                            This page does not exist.
                        </h1>
                        <p className="mt-5 text-lg text-niamind-muted leading-relaxed max-w-md">
                            The link may be broken or the page may have moved.
                            Either way, you can find what you are looking for
                            from here.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/"
                                className="inline-flex justify-center px-6 py-3 rounded-xl bg-niamind-teal text-white font-bold shadow-soft hover:opacity-95 transition"
                            >
                                Back to Niamind
                            </Link>
                            <Link
                                to="/#waitlist"
                                className="inline-flex justify-center px-6 py-3 rounded-xl bg-white border border-niamind-border text-niamind-navy font-bold hover:bg-niamind-bg transition"
                            >
                                Join the waitlist
                            </Link>
                        </div>
                    </div>

                    {/* Right — helpful links */}
                    <div className="rounded-2xl bg-white border border-niamind-border shadow-card p-7">
                        <p className="text-sm font-bold text-niamind-navy">
                            Where would you like to go?
                        </p>
                        <p className="mt-1 text-sm text-niamind-muted">
                            Here are the most useful places on Niamind.
                        </p>

                        <div className="mt-6 space-y-3">
                            {links.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-niamind-border hover:bg-niamind-bg hover:border-niamind-teal/30 transition group"
                                >
                                    <span className="text-sm font-bold text-niamind-navy">
                                        {link.label}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-niamind-muted group-hover:text-niamind-teal transition" />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-6 rounded-xl bg-niamind-navy text-white px-5 py-4">
                            <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                                Niamind
                            </p>
                            <p className="mt-1 text-sm font-bold leading-snug">
                                Nia means purpose in Swahili. We believe a mind
                                with purpose can spark a community into healing.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
