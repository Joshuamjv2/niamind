import React from "react";
import SectionHeader from "../SectionHeader";
import CTACard from "../CTACard";

export default function ForSeekersSection() {
    return (
        <section
            id="for-seekers"
            className="py-20 bg-white border-y border-niamind-border"
        >
            <div className="mx-auto max-w-6xl px-5">
                <SectionHeader
                    eyebrow="For seekers"
                    title="Support that meets you where you are."
                    subtitle="Wherever you are starting from, there is a path forward. Your circumstances do not determine the quality of care you receive."
                />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CTACard
                        title="Book a session"
                        description="Browse verified professionals, see their availability, and book a time that works for you. No referrals, no waiting rooms, no guesswork."
                        buttonText="Join the waitlist"
                        href="#waitlist"
                        variant="primary"
                    />
                    <CTACard
                        title="Get matched to a professional"
                        description="Not in a position to pay right now? Tell us what you are going through. A verified professional will review your situation and take your case. The care is the same."
                        buttonText="Join the waitlist"
                        href="#waitlist"
                        variant="secondary"
                    />
                    <CTACard
                        title="Join a community circle"
                        description="Not ready to speak one-on-one? Community circles led by trained facilitators are a welcoming place to start. No pressure, no expectations."
                        buttonText="Join the waitlist"
                        href="#waitlist"
                        variant="gold"
                    />
                </div>
            </div>
        </section>
    );
}
