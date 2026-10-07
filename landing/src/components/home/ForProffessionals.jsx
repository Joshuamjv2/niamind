import React from "react";
import SectionHeader from "../SectionHeader";
import CTACard from "../CTACard";

export default function ForProfessionalsSection() {
    return (
        <section id="for-pros" className="py-20">
            <div className="mx-auto max-w-6xl px-5">
                <SectionHeader
                    eyebrow="For professionals"
                    title="Do meaningful work. Build something that lasts."
                    subtitle="Niamind is for professionals who want their practice to stand for something — and who want to grow alongside a platform that shares that ambition."
                />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CTACard
                        title="Practice on your terms"
                        description="You set your rates, your availability, and your session structure. Your practice is yours. Niamind handles the reach."
                        buttonText="Join the waitlist"
                        href="#waitlist"
                        variant="secondary"
                    />
                    <CTACard
                        title="Let your work speak for you"
                        description="The care you provide shapes how visible you become on the platform. Your reputation is built on real interactions; not advertising, not algorithms."
                        buttonText="Learn the model"
                        href="#slots"
                        variant="primary"
                    />
                    <CTACard
                        title="Grow into new opportunities"
                        description="As your presence on the platform grows, so does your reach, including business organisations investing in the wellbeing of their people through our B2B model."
                        buttonText="Join the waitlist"
                        href="#waitlist"
                        variant="gold"
                    />
                </div>
            </div>
        </section>
    );
}
