import React from "react";

export function ScreenActions({ advance, goBack }) {
    return (
        <div className="mt-8 flex items-center gap-6">
            <button
                onClick={advance}
                className="bg-niamind-teal text-white font-medium px-6 py-3 rounded-full text-sm hover:opacity-85 transition-opacity"
            >
                Continue
            </button>

            <button
                onClick={goBack}
                className="text-sm underline-offset-4 hover:underline focus-ring rounded text-niamind-muted"
            >
                Back
            </button>
        </div>
    );
}
