import React from "react";

export function EmailRow({
    email,
    setEmail,
    onSubmit,
    inputRef,
    widthClass = "max-w-md",
}) {
    const handleKey = (e) => {
        if (e.key === "Enter") {
            onSubmit(email);
        }
    };

    return (
        <div
            className={`mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 rounded-2xl sm:rounded-full p-2 sm:pl-5 sm:pr-1.5 sm:py-1.5 ${widthClass} border border-niamind-border bg-white/40`}
        >
            <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-base py-3 sm:py-2 px-4 sm:px-0 text-niamind-text"
            />

            <button
                onClick={() => onSubmit(email)}
                className="bg-niamind-teal text-white font-bold text-sm px-6 sm:px-4 py-3 sm:py-2.5 rounded-xl sm:rounded-full whitespace-nowrap hover:opacity-90 transition w-full sm:w-auto"
            >
                Join the waitlist
            </button>
        </div>
    );
}
