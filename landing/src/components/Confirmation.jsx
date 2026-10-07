import React, { useEffect } from "react";

export function Confirmation({ data, onClose }) {
    useEffect(() => {
        console.log("Final onboarding submission:", data);

        /*
        Later:

        await fetch("/api/waitlist", {
            method: "POST",
            body: JSON.stringify(data),
        });
        */
    }, [data]);

    return (
        <div className="text-center">
            <h2 className="ff-serif text-3xl sm:text-4xl text-niamind-text">
                You're in.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-niamind-text">
                I read every one of these myself. I'll reach out personally when
                it's time.
            </p>

            <p className="mt-4 text-sm text-niamind-muted">
                Until then, there's nothing else to do.
            </p>

            <div className="mt-12 pt-8 border-t border-niamind-border">
                <p className="text-sm leading-relaxed text-niamind-muted">
                    In the meantime, we have a small space where early members
                    are already getting to know each other.
                </p>

                <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-block mt-3 text-sm focus-ring rounded text-niamind-gold"
                >
                    Join the early group →
                </a>
            </div>

            <button
                onClick={onClose}
                className="mt-10 text-sm focus-ring rounded text-niamind-muted"
            >
                Back to the page
            </button>
        </div>
    );
}
