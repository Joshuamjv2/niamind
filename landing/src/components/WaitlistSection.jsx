export default function WaitlistSection() {
    return (
        <section id="waitlist" className="px-5 py-24">
            <div
                className="
                mx-auto max-w-4xl
            "
            >
                <div
                    className="
                    rounded-3xl
                    bg-white
                    border border-niamind-border
                    p-8 md:p-12
                    shadow-sm
                    text-center
                "
                >
                    <span
                        className="
                        inline-block h-2 w-2
                        rounded-full
                        bg-niamind-gold
                    "
                    />

                    <h2
                        className="
                        mt-6
                        text-3xl md:text-5xl
                        font-extrabold
                        tracking-tight
                        text-niamind-navy
                    "
                    >
                        You don't have to do this part alone either.
                    </h2>

                    <p
                        className="
                        mt-5
                        max-w-xl mx-auto
                        text-niamind-muted
                        leading-relaxed hidden
                    "
                    >
                        We'll reach out when it's time. Nothing before then.
                    </p>

                    <div
                        className="
                        mt-8
                        flex flex-col sm:flex-row
                        gap-3 max-w-xl mx-auto
                    "
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="
                                flex-1
                                rounded-xl
                                border border-niamind-border
                                px-5 py-3
                                outline-none
                                focus:border-niamind-teal
                            "
                        />

                        <button
                            className="
                                px-6 py-3
                                rounded-xl
                                bg-niamind-teal
                                text-white
                                font-bold
                                hover:opacity-95
                                transition
                            "
                        >
                            Join the community
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
