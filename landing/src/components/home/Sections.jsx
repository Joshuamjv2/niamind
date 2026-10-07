// Sections.js
import React, {useRef} from "react";
import { EmailRow } from "../Emailrow";

export function Recognition() {
    return (
        <section className="max-w-2xl mx-auto px-6 pb-20">
            <div className="space-y-6 text-lg leading-relaxed text-niamind-text">
                <p>
                    You're doing fine. Genuinely. Things are moving. People
                    would say you've got it together, and by most measures, you
                    do.
                </p>
                <p>
                    Somewhere along the way, the friendships that used to hold
                    the real version of you got quieter. They're still there.
                    Just thinner than they used to be. You still talk to people
                    every day. Few of those conversations go anywhere.
                </p>
                <p>
                    You've thought about texting someone back about how you've
                    actually been. You've also thought better of it.
                </p>
                <p>
                    It's quieter than loneliness, whatever this is. And there
                    aren't many places built for it.
                </p>
            </div>
        </section>
    );
}

export function WhatIsNiamind() {
    return (
        <section className="bg-white max-w-none w-full py-20">
            <div className="max-w-2xl mx-auto px-6">
                <div className="space-y-6 text-lg leading-relaxed text-niamind-text">
                    <p>
                        Niamind is where your inner life gets taken seriously.
                    </p>
                    <p>
                        Reflect privately. Talk to people who actually get what
                        you're going through. Get real guidance when you need
                        it, from people qualified to give it. We're not trying
                        to keep you on the app longer than you need to be. If
                        anything, we'd rather you came, got what you needed, and
                        went back to your life a little lighter.
                    </p>
                    <p>
                        It's still early days. We're building this carefully,
                        and the people who join now will shape what it becomes.
                    </p>
                </div>
            </div>
        </section>
    );
}

export function SignalSection() {
    // Kept hidden — product described once in WhatIsNiamind
    return null;
}

export function FounderNote() {
    return (
        <section className="max-w-2xl mx-auto px-6 py-24">
            {/* Title above the border */}
            <div className="mb-10">
                <h2 className="ff-serif text-3xl sm:text-4xl text-niamind-text">
                    Note from The Founder
                </h2>
            </div>

            {/* Content with yellow border */}
            <div className="max-w-xl pl-6 border-l-2 border-niamind-gold space-y-5">
                <p className="ff-serif italic text-xl leading-relaxed text-niamind-text">
                    I built Niamind for myself, if I'm honest.
                </p>
                <p className="ff-serif italic text-xl leading-relaxed text-niamind-text">
                    I kept ending up in places that only worked if I already had
                    things figured out. Like you needed to be confident or
                    ambitious just to be allowed in.
                </p>
                <p className="ff-serif italic text-xl leading-relaxed text-niamind-text">
                    Most days I wasn't that. I was just trying to work out what
                    I actually wanted, and I couldn't find anywhere that made
                    room for that.
                </p>
                <p className="ff-serif italic text-xl leading-relaxed text-niamind-text">
                    So I started building this instead. Somewhere you don't have
                    to perform anything to belong.
                </p>
                <p className="ff-serif italic text-xl leading-relaxed text-niamind-text">
                    It's still very early, and I'm doing most of it myself. I
                    read every signup personally. Right now, who's actually here
                    matters more to me than how many.
                </p>
            </div>

            {/* Signature outside the border */}
            <div className="max-w-xl mt-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-niamind-teal/10 flex items-center justify-center text-xl select-none">
                        👨🏾‍💻
                    </div>
                    <div>
                        <p className="font-semibold text-niamind-text">
                            Muwanguzi Joshua
                        </p>
                        <p className="text-sm text-niamind-muted">
                            Founder, Niamind
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}


export function ClosingCTA({ email, setEmail, onJoin }) {
    const inputRef = useRef(null);
    return (
        <section className="bg-white max-w-none w-full py-24 relative">
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
                <h2 className="ff-serif text-3xl px-6 sm:text-4xl leading-tight max-w-md text-niamind-text">
                    Ready when you are.
                </h2>

                <div className="w-full px-6 flex justify-center">
                    <EmailRow
                        email={email}
                        setEmail={setEmail}
                        onSubmit={() => onJoin(email)}
                        inputRef={inputRef}
                        widthClass="w-full max-w-md"
                    />
                </div>

                <p className="mt-4 text-sm text-niamind-muted hidden">
                    We'll reach out when it's time. Nothing before then.
                </p>
            </div>
        </section>
    );
}
