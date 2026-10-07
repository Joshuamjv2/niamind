// Footer.js
import React from "react";
import { HeartHandshake } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-niamind-border bg-white">
            <div className="max-w-2xl mx-auto px-6 py-10 text-center">
                {/* Logo with HeartHandshake */}
                <div className="flex items-center justify-center gap-3 mb-1">
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

                    <p className="ff-serif text-lg text-niamind-text font-bold">
                        Niamind
                    </p>
                </div>

                <p className="ff-serif italic mt-1 text-niamind-muted hidden">
                    Life moves better together.
                </p>
                <p className="my-2 text-sm text-niamind-text font-semibold">
                    <a href="https://github.com" target="_blank">
                        <span className="text-niamind-gold hover:text-niamind-muted">
                            {" "}
                            Built in public,
                        </span>{" "}
                    </a>
                    <a
                        className="hover:text-niamind-muted"
                        href="https://www.tembeatours.com/"
                        target="_blank"
                    >
                        from Kampala.
                    </a>
                </p>
                <p className="my-4 text-sm text-niamind-muted">
                    <a
                        href="mailto:info@niamind.com"
                        className="hover:text-niamind-primary transition-colors"
                    >
                        info@niamind.com
                    </a>
                </p>
                <p className="text-xs text-niamind-muted">© 2026 Niamind</p>
            </div>
        </footer>
    );
}
