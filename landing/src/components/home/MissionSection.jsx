import React from "react";

const stats = [
    { number: "60+", label: "Verified professionals" },
    { number: "1,200+", label: "Community sessions" },
    { number: "4,800+", label: "People reached" },
    { number: "12", label: "Partner programs" },
];

export default function MissionSection() {
    return (
        <section className="py-20 bg-niamind-navy">
            <div className="mx-auto max-w-4xl px-5 text-center">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                    Why we exist
                </p>
                <h2 className="mt-5 text-2xl md:text-3xl font-extrabold text-white leading-snug">
                    Mental health help should not be a privilege. It should not
                    depend on where you were born, what you earn, or whether
                    someone told you it was okay to ask for help.
                </h2>
                <p className="mt-6 text-base text-white/70 leading-relaxed max-w-2xl mx-auto">
                    Niamind is a social enterprise. Not a charity, not a
                    profit-maximising product. Professionals earn trust through
                    community service. Access is funded by those who can.
                    Partner programs are funded directly by the community. This
                    platform is built to sustain itself and make mental health
                    care a shared resource, not a luxury.
                </p>

                {/* Impact numbers */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-niamind-navy px-6 py-8"
                        >
                            <p className="text-3xl font-extrabold text-white">
                                {stat.number}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-white/50">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 inline-block rounded-2xl bg-white/10 border border-white/10 px-6 py-4">
                    <p className="text-white font-bold text-lg">
                        "When you heal, we heal."
                    </p>
                </div>
            </div>
        </section>
    );
}
