import React from "react";
import { User, Star } from "lucide-react";
import SectionHeader from "../SectionHeader";

const reviews = [
    {
        professional: {
            name: "Dr. Sarah Nakato",
            title: "Clinical Psychologist",
            credential: "Licensed Specialist",
            color: "teal",
            sessions: 94,
            reviews: 94,
        },
        review: "I was not sure what to expect but from the first session I felt genuinely heard. She did not rush me or make me feel like a case to get through. I have been coming back every two weeks.",
        reviewer: {
            name: "Anon",
            location: "Kampala",
            color: "green",
        },
        rating: 5,
    },
    {
        professional: {
            name: "Moses Ochieng",
            title: "Counselling Therapist",
            credential: "Certified Practitioner",
            color: "green",
            sessions: 61,
            reviews: 61,
        },
        review: "I had been carrying a lot for years and never talked to anyone about it. Moses made it feel safe to start. Three months in and I feel like a different person.",
        reviewer: {
            name: "Anon",
            location: "Nairobi",
            color: "teal",
        },
        rating: 5,
    },
    {
        professional: {
            name: "Dr. Amina Ssali",
            title: "Psychiatrist",
            credential: "Licensed Specialist",
            color: "gold",
            sessions: 112,
            reviews: 112,
        },
        review: "What surprised me most is that she remembered everything from our previous sessions. It felt like continuity, not a service.",
        reviewer: {
            name: "Anon",
            location: "Kampala",
            color: "gold",
        },
        rating: 5,
    },
    {
        professional: {
            name: "Grace Apio",
            title: "Peer Support Counsellor",
            credential: "Peer Support",
            color: "navy",
            sessions: 38,
            reviews: 38,
        },
        review: "I could not afford a full session and I was worried that meant I would get less. That was not my experience at all. Grace showed up fully and I never felt like a lesser client.",
        reviewer: {
            name: "Anon",
            location: "Gulu",
            color: "green",
        },
        rating: 5,
    },
    {
        professional: {
            name: "Dr. James Mugisha",
            title: "Trauma Therapist",
            credential: "Licensed Specialist",
            color: "teal",
            sessions: 77,
            reviews: 77,
        },
        review: "He gave me tools I actually use every day. Not just someone to talk at, someone who actively works with you.",
        reviewer: {
            name: "Anon",
            location: "Kampala",
            color: "navy",
        },
        rating: 5,
    },
    {
        professional: {
            name: "Patience Otieno",
            title: "Adolescent Counsellor",
            credential: "Certified Practitioner",
            color: "green",
            sessions: 53,
            reviews: 53,
        },
        review: "My daughter was struggling and I did not know how to help her. Patience worked with both of us and the change has been real. I recommend her to everyone.",
        reviewer: {
            name: "Anon",
            location: "Entebbe",
            color: "teal",
        },
        rating: 5,
    },
];

const avatarColorMap = {
    teal: "bg-niamind-teal/15 text-niamind-teal",
    green: "bg-niamind-green/15 text-niamind-green",
    gold: "bg-niamind-gold/20 text-niamind-navy",
    navy: "bg-niamind-navy/10 text-niamind-navy",
};

const credentialColorMap = {
    "Licensed Specialist": "bg-niamind-teal/10 text-niamind-teal",
    "Certified Practitioner": "bg-niamind-green/10 text-niamind-green",
    "Peer Support": "bg-niamind-gold/10 text-niamind-navy",
};

export default function ReviewsSection() {
    return (
        <section
            id="reviews"
            className="py-20 bg-white border-y border-niamind-border"
        >
            <div className="mx-auto max-w-6xl px-5">
                <SectionHeader
                    eyebrow="From the community"
                    title="Real sessions. Real people."
                    subtitle="These reviews come from people who have been through a session on Niamind. No filters, no edits."
                />

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((item) => (
                        <div
                            key={item.professional.name}
                            className="rounded-2xl bg-white border border-niamind-border shadow-card p-6 flex flex-col"
                        >
                            {/* Professional profile */}
                            <div className="flex items-start gap-3">
                                <div
                                    className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${avatarColorMap[item.professional.color]}`}
                                >
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-extrabold text-niamind-navy text-sm">
                                        {item.professional.name}
                                    </p>
                                    <p className="text-xs text-niamind-muted mt-0.5">
                                        {item.professional.title}
                                    </p>
                                    <p className="text-xs text-niamind-muted mt-1.5">
                                        <span className="font-bold text-niamind-navy">
                                            {item.professional.sessions}
                                        </span>{" "}
                                        community sessions
                                        <span className="mx-1.5 text-niamind-border">
                                            ·
                                        </span>
                                        <span className="font-bold text-niamind-navy">
                                            {item.professional.reviews}
                                        </span>{" "}
                                        reviews
                                    </p>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="mt-4 flex items-center gap-0.5">
                                {Array.from({ length: item.rating }).map(
                                    (_, i) => (
                                        <Star
                                            key={i}
                                            className="h-4 w-4 text-niamind-gold fill-niamind-gold"
                                        />
                                    ),
                                )}
                            </div>

                            {/* Review text */}
                            <p className="mt-3 text-sm text-niamind-muted leading-relaxed flex-1">
                                "{item.review}"
                            </p>

                            {/* Reviewer */}
                            <div className="mt-5 flex items-center gap-2 pt-4 border-t border-niamind-border">
                                <div
                                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${avatarColorMap[item.reviewer.color]}`}
                                >
                                    <User className="h-3.5 w-3.5" />
                                </div>
                                <p className="text-xs font-bold text-niamind-muted">
                                    {item.reviewer.name},{" "}
                                    {item.reviewer.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
