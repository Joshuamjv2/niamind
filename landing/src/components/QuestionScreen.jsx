// QuestionScreen.js
import React from "react";
import { FOCUS_OPTIONS } from "../constants";
import { ScreenActions } from "./ScreenAction";

export function QuestionScreen({
    screen,
    answers,
    setAnswers,
    toggleFocus,
    advance,
    goBack,
    activeFieldRef,
}) {
    if (screen.multi) {
        return (
            <div>
                <h2 className="ff-serif text-2xl sm:text-3xl leading-snug text-niamind-text">
                    {screen.q}
                </h2>
                <div className="mt-7 flex flex-wrap gap-2">
                    {FOCUS_OPTIONS.map((opt) => {
                        const selected = answers.focus.includes(opt);
                        return (
                            <button
                                key={opt}
                                onClick={() => toggleFocus(opt)}
                                className={`text-sm px-4 py-2 rounded-full transition-colors focus-ring ${
                                    selected
                                        ? "bg-niamind-gold/14 text-niamind-gold border-niamind-gold"
                                        : "border border-niamind-border text-niamind-text"
                                }`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
                {answers.focus.includes("Something else") && (
                    <input
                        value={answers.focusOther}
                        onChange={(e) =>
                            setAnswers((a) => ({
                                ...a,
                                focusOther: e.target.value,
                            }))
                        }
                        placeholder="Say more, if you'd like."
                        className="mt-4 w-full bg-transparent outline-none text-base py-2 border-b border-niamind-border text-niamind-text"
                    />
                )}
                <ScreenActions advance={advance} goBack={goBack} />
            </div>
        );
    }

    return (
        <div>
            <h2 className="ff-serif text-2xl sm:text-3xl leading-snug text-niamind-text">
                {screen.q}
            </h2>
            <textarea
                ref={activeFieldRef}
                rows={3}
                value={answers[screen.key]}
                onChange={(e) =>
                    setAnswers((a) => ({ ...a, [screen.key]: e.target.value }))
                }
                placeholder={screen.placeholder}
                className="mt-7 w-full bg-transparent outline-none text-lg leading-relaxed resize-none border-b border-niamind-border py-2 text-niamind-text"
            />
            <ScreenActions advance={advance} />
        </div>
    );
}
