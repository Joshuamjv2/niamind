import React, { useRef } from "react";
import { EmailRow } from "../Emailrow";

export default function Hero({ email, setEmail, onJoin }) {
    const inputRef = useRef(null);

    return (
        <section className="max-w-2xl mx-auto px-6 pt-20 pb-24">
            <h1 className="ff-serif text-4xl sm:text-5xl leading-tight text-niamind-text">
                When did you last say{" "}
                <em className="not-italic text-niamind-gold">the real thing</em>
                ?
            </h1>

            <p className="mt-6 text-lg leading-relaxed max-w-md text-niamind-muted">
                There are things you talk about. And there are things you keep
                meaning to talk about. The second list is usually more
                important.
            </p>

            <EmailRow
                email={email}
                setEmail={setEmail}
                onSubmit={() => onJoin(email)}
                inputRef={inputRef}
            />

            <p className="mt-3 text-sm text-niamind-muted hidden">
                No spam. Just an honest note when it's time.
            </p>
        </section>
    );
}
