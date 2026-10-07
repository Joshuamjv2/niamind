// components/Navbar.js
import React from "react";
import { HeartHandshake } from "lucide-react";

export default function Navbar() {
    const scrollToHero = () => {
        const hero = document.querySelector("section");
        hero?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    return (
        <header
            className="
                fixed top-0 left-0 right-0 z-50
                bg-niamind-bg/85 backdrop-blur
            "
        >
            <div
                className="
                    mx-auto max-w-6xl px-5 py-4 md:py-8
                    flex items-center justify-center
                "
            >
                <a href="/" className="flex items-center gap-3 py-2 px-8 rounded-3xl">
                    <div
                        className="
                            h-10 w-10 rounded-xl
                            bg-niamind-teal
                            flex items-center justify-center
                            shadow-sm
                        "
                    >
                        <HeartHandshake className="h-5 w-5 text-white" />
                    </div>

                    <div>
                        <p
                            className="
                                font-extrabold text-lg
                                tracking-tight text-niamind-navy
                            "
                        >
                            Niamind
                        </p>
                    </div>
                </a>

                {/* <button
                    onClick={scrollToHero}
                    className="
                        inline-flex items-center
                        px-5 py-2.5 rounded-xl
                        bg-niamind-teal
                        text-white text-sm font-bold
                        shadow-sm
                        hover:opacity-90 transition
                    "
                >
                    Join early community
                </button> */}
            </div>
        </header>
    );
}
