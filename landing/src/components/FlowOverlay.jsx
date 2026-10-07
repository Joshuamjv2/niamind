// FlowOverlay.js
import React from "react";
import { SCREENS } from "../constants";
import { QuestionScreen } from "./QuestionScreen";
import { Confirmation } from "./Confirmation";

export function FlowOverlay({
    step,
    setStep,
    answers,
    setAnswers,
    toggleFocus,
    advance,
    goBack,
    activeFieldRef,
    onClose,
}) {
    const showDots = step >= 0 && step <= 4;

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col bg-niamind-bg"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-between px-6 py-5">
                <div className="flex gap-2">
                    {showDots &&
                        SCREENS.map((_, i) => (
                            <span
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                    i <= step
                                        ? "bg-niamind-teal border-niamind-teal"
                                        : "border border-niamind-border bg-transparent"
                                }`}
                            />
                        ))}
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="text-2xl leading-none px-2 focus-ring rounded text-niamind-muted"
                >
                    ×
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-6">
                <div key={step} className="step-anim w-full max-w-md">
                    {step === -1 && (
                        <div className="text-center">
                            <h2 className="ff-serif text-2xl sm:text-3xl leading-snug text-niamind-text">
                                A few honest questions before you're in.
                            </h2>
                            <p className="mt-4 text-sm text-niamind-muted">
                                Takes about two minutes. Skip anything you'd
                                rather not answer.
                            </p>
                            <button
                                onClick={advance}
                                className="bg-niamind-gold text-white font-medium mt-8 px-6 py-3 rounded-full text-sm hover:opacity-85 transition-opacity"
                            >
                                Begin
                            </button>
                        </div>
                    )}

                    {step >= 0 && step <= 4 && (
                        <QuestionScreen
                            screen={SCREENS[step]}
                            answers={answers}
                            setAnswers={setAnswers}
                            toggleFocus={toggleFocus}
                            advance={advance}
                            goBack={goBack}
                            activeFieldRef={activeFieldRef}
                        />
                    )}

                    {step === 5 && (
                        <Confirmation data={answers} onClose={onClose} />
                    )}
                </div>
            </div>
        </div>
    );
}
