import React, { useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import Hero from "../components/home/Hero";
import SEO from "../components/SEO";
import {
    Recognition,
    WhatIsNiamind,
    SignalSection,
    FounderNote,
    ClosingCTA,
} from "../components/home/Sections";

import { FlowOverlay } from "../components/FlowOverlay";

const INITIAL_USER_DATA = {
    email: "",
    working: "",
    talk: "",
    goodDay: "",
    bring: "",
    focus: [],
    focusOther: "",
};

export default function App() {
    const [userData, setUserData] = useState(INITIAL_USER_DATA);
    const [flowOpen, setFlowOpen] = useState(false);
    const [step, setStep] = useState(-1);

    const activeFieldRef = useRef(null);

    const setEmail = (email) => {
        setUserData((prev) => ({
            ...prev,
            email,
        }));
    };

    const handleJoin = (email) => {
        if (!email.trim()) return;

        setUserData((prev) => ({
            ...prev,
            email,
        }));

        setStep(-1);
        setFlowOpen(true);
    };

    const advance = () => {
        setStep((prev) => prev + 1);
    };

    const goBack = () => {
        setStep((prev) => prev - 1);
    };

    const toggleFocus = (option) => {
        setUserData((prev) => ({
            ...prev,
            focus: prev.focus.includes(option)
                ? prev.focus.filter((item) => item !== option)
                : [...prev.focus, option],
        }));
    };

    const resetOnboarding = () => {
        setUserData(INITIAL_USER_DATA);
        setStep(-1);
        setFlowOpen(false);
    };

    return (
        <>
        
            <MainLayout>
                <Hero
                    email={userData.email}
                    setEmail={setEmail}
                    onJoin={handleJoin}
                />

                <Recognition />

                <WhatIsNiamind />

                <SignalSection />

                <FounderNote />

                <ClosingCTA
                    email={userData.email}
                    setEmail={setEmail}
                    onJoin={handleJoin}
                />
            </MainLayout>

            {flowOpen && (
                <FlowOverlay
                    step={step}
                    setStep={setStep}
                    answers={userData}
                    setAnswers={setUserData}
                    toggleFocus={toggleFocus}
                    advance={advance}
                    goBack={goBack}
                    activeFieldRef={activeFieldRef}
                    onClose={resetOnboarding}
                />
            )}
        </>
    );
}
