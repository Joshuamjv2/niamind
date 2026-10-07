import { ShieldCheck, LockKeyhole, Users } from "lucide-react";
import SectionHeader from "../SectionHeader";

export default function TrustSafetySection() {
    return (
        <section
            id="trust"
            className="py-20 bg-white border-y border-niamind-border"
        >
            <div className="mx-auto max-w-6xl px-5">
                <SectionHeader
                    eyebrow="Trust & safety"
                    title="Designed for privacy, accountability, and dignity."
                    subtitle="Mental health care only works when people feel safe. Every part of this platform is built to protect the people who use it and to earn their trust over time."
                />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-7 shadow-sm">
                        <ShieldCheck className="h-7 w-7 text-niamind-teal" />
                        <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                            Verified professionals
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            Every professional is identity and credential
                            verified before they take on a single case. You
                            always know exactly who you are speaking to.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-7 shadow-sm">
                        <LockKeyhole className="h-7 w-7 text-niamind-green" />
                        <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                            Payments held securely
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            All payments are held and only released once both
                            parties have confirmed the session took place.
                            Everyone on both sides is protected.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-niamind-bg border border-niamind-border p-7 shadow-sm">
                        <Users className="h-7 w-7 text-niamind-gold" />
                        <h3 className="mt-4 text-lg font-extrabold text-niamind-navy">
                            Reviews rooted in real care
                        </h3>
                        <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                            Feedback on professionals comes only from people who
                            have been through a community session. Just honest
                            accounts from people who were actually impacted.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
