import { useState, useRef } from "react";
import { SCREENS } from "../constants";
import { QuestionScreen } from "./QuestionScreen";

export default function WaitlistFlow({ email }) {
    const [step, setStep] = useState(0);

    const [answers, setAnswers] = useState({
        working: "",
        talk: "",
        goodDay: "",
        bring: "",
        focus: [],
        focusOther: "",
    });

    const activeFieldRef = useRef(null);

    const advance = () => {
        if (step < SCREENS.length) {
            setStep((s) => s + 1);
        }
    };

    const toggleFocus = (value) => {
        setAnswers((prev) => ({
            ...prev,
            focus: prev.focus.includes(value)
                ? prev.focus.filter((v) => v !== value)
                : [...prev.focus, value],
        }));
    };

    if (step === SCREENS.length) {
        return <ConfirmationScreen email={email} answers={answers} />;
    }

    return (
        <section className="min-h-[80vh] flex items-center">
            <div className="max-w-2xl mx-auto px-6 w-full">
                <div className="mb-12">
                    <p className="text-sm text-niamind-muted">
                        A few honest questions before you're in.
                    </p>

                    <p className="mt-1 text-sm text-niamind-muted">
                        Takes about two minutes. Skip anything you'd rather not
                        answer.
                    </p>
                </div>

                <div className="flex gap-2 mb-10">
                    {SCREENS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 flex-1 rounded-full ${
                                i <= step
                                    ? "bg-niamind-gold"
                                    : "bg-niamind-border"
                            }`}
                        />
                    ))}
                </div>

                <QuestionScreen
                    screen={SCREENS[step]}
                    answers={answers}
                    setAnswers={setAnswers}
                    toggleFocus={toggleFocus}
                    advance={advance}
                    activeFieldRef={activeFieldRef}
                />
            </div>
        </section>
    );
}
